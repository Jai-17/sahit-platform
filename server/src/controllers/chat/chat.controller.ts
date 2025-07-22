import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import chatClient from "../../chat";

const getOrderedUserIds = (id1: string, id2: string) => {
  return id1 < id2 ? [id1, id2] : [id2, id1];
};

// /api/v1/chat/token
export const chatJwt = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  try {
    const token = jwt.sign(
      {
        user_id: userId,
        sub: userId,
        role: "authenticated",
      },
      process.env.SUPABASE_JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ supabase_jwt: token });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error generating supabase jwt token" });
  }
};

// /api/v1/chat/start
export const startChat = async (req: Request, res: Response): Promise<void> => {
  const { recieverUserId } = req.body;
  const senderUserId = req.user?.userId;

  if (!recieverUserId) {
    res.status(400).json({ message: "No reciever user id" });
    return;
  }

  if (senderUserId == recieverUserId) {
    res.status(400).json({ message: "Cannot start a chat with yourself" });
  }

  try {
    const userIds = [senderUserId, recieverUserId];

    for (const userId of userIds) {
      const { data: profile, error: profileError } = await chatClient
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        const { error: insertError } = await chatClient
          .from("profiles")
          .insert({ id: userId, username: `User_${userId.substring(0, 8)}` });
        if (insertError) throw insertError;
      } else if (profileError) {
        throw profileError;
      }
    }

    const [user1_id, user2_id] = getOrderedUserIds(
      senderUserId,
      recieverUserId
    );

    let { data: chatRoom, error: findError } = await chatClient
      .from("chat_rooms")
      .select("id")
      .eq("user1_id", user1_id)
      .eq("user2_id", user2_id)
      .single();

    if (findError && findError.code === "PGRST116") {
      const { data: newChatRoom, error: createError } = await chatClient
        .from("chat_rooms")
        .insert({
          user1_id,
          user2_id,
          last_message_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createError) throw createError;
      chatRoom = newChatRoom;
    } else if (findError) {
      throw findError;
    }

    res.status(200).json({ chatRoomId: chatRoom?.id });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ error: "Failed to start or find chat room." });
  }
};

// /api/v1/chat/messages/:chatRoomId
export const getChatRoomById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { chatRoomId } = req.params;
  const userId = req.user?.userId;

  try {
    const { data: chatRoom, error: chatRoomError } = await chatClient
      .from("chat_rooms")
      .select("user1_id, user2_id")
      .eq("id", chatRoomId)
      .single();

    if (chatRoomError || !chatRoom) {
      res.status(404).json({ error: "Chat room not found." });
      return;
    }

    if (chatRoom.user1_id !== userId && chatRoom.user2_id !== userId) {
      res
        .status(403)
        .json({ error: "Forbidden: Not a participant in this chat room." });
      return;
    }

    const { data: messages, error: messagesError } = await chatClient
      .from("messages")
      .select("id, sender_id, content, created_at")
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages." });
  }
};

// /api/v1/chat/send
export const sendChat = async (req: Request, res: Response): Promise<void> => {
  const { chatRoomId, content } = req.body;
  const userId = req.user.userId;

  try {
    const { data: chatRoom, error: chatRoomError } = await chatClient
      .from("chat_rooms")
      .select("user1_id, user2_id")
      .eq("id", chatRoomId)
      .single();

    if (chatRoomError || !chatRoom) {
      res.status(404).json({ error: "Chat room not found." });
      return;
    }

    if (chatRoom.user1_id !== userId && chatRoom.user2_id !== userId) {
      res
        .status(403)
        .json({ error: "Forbidden: Not a participant in this chat room." });
      return;
    }


    const {data: newMessage, error: insertError} = await chatClient.from('messages').insert({chat_room_id: chatRoomId, sender_id: userId, content: content.trim()}).select("id").single();
    if (insertError) throw insertError;

    const { error: updateError } = await chatClient
      .from('chat_rooms')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chatRoomId);

    if (updateError) {
      console.warn('Warning: Could not update last_message_at for chat room', chatRoomId, updateError);
    }

    res.status(201).json({ success: true, messageId: newMessage.id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};
