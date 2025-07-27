import { createClient } from "@supabase/supabase-js";
import {config} from 'dotenv';
import { SupabaseClient } from "@supabase/supabase-js";
config();

const chatClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!, {
    auth: {
        persistSession: false,
    }
})

export const deleteChatBetweenUsers = async (
  supabase: SupabaseClient,
  userId1: string,
  userId2: string
): Promise<void> => {
  const [user1_id, user2_id] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
    
  const { data: chatRoom, error: chatRoomError } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("user1_id", user1_id)
    .eq("user2_id", user2_id)
    .single();

  if (chatRoomError || !chatRoom) {
    console.warn("Chat room not found or already deleted");
    return;
  }

  const chatRoomId = chatRoom.id;

  const { error: msgError } = await supabase
    .from("messages")
    .delete()
    .eq("chat_room_id", chatRoomId);

  if (msgError) {
    console.error("Failed to delete messages:", msgError);
    return;
  }

  const { error: roomError } = await supabase
    .from("chat_rooms")
    .delete()
    .eq("id", chatRoomId);

  if (roomError) {
    console.error("Failed to delete chat room:", roomError);
  }
};


export default chatClient;