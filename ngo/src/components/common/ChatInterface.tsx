/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/chat";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import {
  useGetMessagesByChatRoomIdQuery,
  useSendMessageMutation,
  useStartChatMutation,
} from "@/store/features/protectedApiSlice";
import { Input } from "../ui/input";
import {format} from 'date-fns';

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

const ChatInterface = ({
  sender,
  reciever,
}: {
  sender: string;
  reciever: string;
}) => {
  const [chatRoomId, setChatRoomId] = useState(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [startChat, { isLoading: isStartingChat, error: startChatError }] =
    useStartChatMutation();
  const [
    sendMessage,
    { isLoading: isSendingMessage, error: sendMessageError },
  ] = useSendMessageMutation();

  const {
    data: historicalMessages,
    error: historicalMessagesError,
    isLoading: isLoadingHistoricalMessages,
    isFetching: isFetchingHistoricalMessages,
  } = useGetMessagesByChatRoomIdQuery(chatRoomId, {
    skip: !chatRoomId,
    pollingInterval: 0,
  });

  useEffect(() => {
    const initiateChat = async () => {
      if (!sender || !reciever) {
        setChatRoomId(null);
        setMessages([]);
        return;
      }

      try {
        const result = await startChat({ recieverUserId: reciever }).unwrap();
        setChatRoomId(result.chatRoomId);
        toast.success(`Chat initiated!`);
      } catch (error) {
        console.error("Failed to start/find chat room:", error);
        toast.error("Failed to load chat. Please try again.");
        setChatRoomId(null);
        setMessages([]);
      }
    };

    initiateChat();
  }, [sender, reciever, startChat]);

  useEffect(() => {
    if (!chatRoomId) {
      setMessages([]);
      return;
    }

    if (historicalMessages) {
      const sortedMessages = [...historicalMessages].sort((a, b) => {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      setMessages(sortedMessages);
    }

    console.log(
      `ChatInterface: Attempting to subscribe to Realtime channel: chat_room_${chatRoomId}`
    );
    const channel = supabase
      .channel(`chat_room_${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload: any) => {
          console.log("ChatInterface: Realtime payload received:", payload);
          setMessages((prevMessages) => {
            if (prevMessages.some((msg) => msg.id === payload.new.id)) {
              console.log(
                "ChatInterface: Duplicate message received from Realtime, skipping."
              );
              return prevMessages;
            }
            return [...prevMessages, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`Unsubscribed from chat_room_${chatRoomId}`);
      }
    };
  }, [chatRoomId, historicalMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatRoomId || newMessageContent.trim() === "") {
      toast.error("Please type a message.");
      return;
    }

    try {
      await sendMessage({
        chatRoomId,
        content: newMessageContent.trim(),
      }).unwrap();
      setNewMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !isSendingMessage) {
      handleSendMessage();
    }
  };

  if (!sender || !reciever) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Please select a user to start chatting.
      </div>
    );
  }

  if (
    isStartingChat ||
    isLoadingHistoricalMessages ||
    isFetchingHistoricalMessages
  ) {
    return (
      <div className="flex items-center justify-center h-full text-gray-700">
        <Loader2 className="animate-spin h-8 w-8 mr-3 text-violet-600" />
        Loading chat...
      </div>
    );
  }

  if (startChatError || historicalMessagesError || sendMessageError) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        Error loading chat, Try Refreshing.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${
                msg.sender_id === sender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.sender_id === sender
                    ? "bg-violet-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                } rounded-lg px-4 py-2 max-w-[70%] shadow-sm break-words`}
              >
                <p>{msg.content}</p>
                <span className="block text-xs mt-1 opacity-75">
                  {format(new Date(msg.created_at), "do MMMM, hh:mm a")}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center space-x-2 border-t pt-4">
        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-violet-400 transition text-gray-800"
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={!chatRoomId || isSendingMessage}
        />
        <button
          className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition shadow-md flex items-center justify-center"
          onClick={handleSendMessage}
          disabled={
            !chatRoomId || isSendingMessage || newMessageContent.trim() === ""
          }
        >
          {isSendingMessage ? (
            <Loader2 className="animate-spin h-5 w-5 text-white" />
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Send
            </>
          )}
        </button>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
