import React from "react";
import { SendHorizontal } from "lucide-react";

interface ChatSectionProps {
  chatInput: string;
  setChatInput: (value: string) => void;
  messages: { sender: string; content: string }[];
  sendMessage: () => void;
  joinExitHandler: () => void; // Callback for the button
  joinExitLabel: string; // Label for the button
}

const ChatSection: React.FC<ChatSectionProps> = ({
  chatInput,
  setChatInput,
  messages,
  sendMessage,
  joinExitHandler,
  joinExitLabel,
}) => {
  return (
    <div className="lg:w-1/3 bg-white border-l border-gray-300 lg:pl-4">
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4 min-h-[7rem]">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex mb-2 ${
                message.sender === "self" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.sender === "self"
                    ? "bg-indigo-300 text-black"
                    : "bg-pink-300 text-black"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center border-t p-2">
          <button
            className="text-white bg-[#FA546B] py-2 px-4 mr-2 rounded-lg"
            onClick={joinExitHandler}
          >
            {joinExitLabel}
          </button>
          <div className="relative w-full">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full p-2 pr-10 border flex-1 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Type a message..."
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-500"
              onClick={sendMessage}
            >
              <SendHorizontal />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;