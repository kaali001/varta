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
    <div className=" bg-white border-l border-gray-300 lg:pl-4"   style={{
        backgroundImage: `url('./apple-icon-180x180.png')`, // Replace with your image path
        backgroundSize: '70px', // Cover the entire area
        backgroundPosition: 'center', // Center the image
        // opacity: 0.5, 
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
      }}>
      <div
        className="flex flex-col h-[11rem] md:h-[29rem] lg:h-[31rem] 2xl:h-[41rem]"
        style={{ maxHeight: "100%" }}
      >
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.sender === "self" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2  max-w-[80%] shadow ${
                  message.sender === "self"
                    ? "bg-indigo-300 text-black rounded-s-xl rounded-se-xl"
                    : "bg-pink-300 text-black rounded-e-xl rounded-es-xl"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center border-t p-2 bg-gray-100">
          <button
            className="text-white bg-[#FA546B] py-2 px-4 mr-2 rounded-lg hover:bg-[#e0445e] transition"
            onClick={joinExitHandler}
          >
            {joinExitLabel}
          </button>
          <div className="relative w-full">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
              placeholder="Type a message..."
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-500 hover:text-indigo-600 transition"
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
