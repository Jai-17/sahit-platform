import React from "react";

const ChatInterface = () => {
  return (
    <div  className="p-4 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <div className="flex items-start space-x-2">
          <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-[70%]">
            <p>
              Hi, I&apos;m here to help you. Can you tell me more about the
              issue?
            </p>
          </div>
        </div>
        <div className="flex items-start justify-end space-x-2">
          <div className="bg-violet-200 rounded-lg px-4 py-2 max-w-[70%]">
            <p>Yes, I’m feeling unsafe and need guidance on legal steps.</p>
          </div>
        </div>
        {/* Add more messages dynamically here */}
      </div>

      {/* Input Bar */}
      <div className="mt-4 flex items-center space-x-2 border-t pt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-md border focus:outline-none"
        />
        <button className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
