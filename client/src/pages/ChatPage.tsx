import React, { useState, useEffect } from "react";
import { Room } from "./Room";

export default function ChatPage() {
  const [isChatActive, setIsChatActive] = useState(false);
  const [name, setName] = useState("User");
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [message, setMessage] = useState("");

  const getMediaTracks = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalAudioTrack(stream.getAudioTracks()[0]);
      setLocalVideoTrack(stream.getVideoTracks()[0]);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    if (isChatActive) getMediaTracks();
  }, [isChatActive]);

  const handleSendMessage = () => {
    // Implement send message functionality here
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Video Meeting</h2>
          <button
            className={`${
              isChatActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white py-2 px-4 rounded-lg transition-colors duration-200`}
            onClick={() => setIsChatActive((prev) => !prev)}
          >
            {isChatActive ? "End Meeting" : "Join Meeting"}
          </button>
        </div>

        <div className="flex gap-4">
          <div className="w-[60%] bg-gray-200 rounded-lg overflow-hidden">
            {isChatActive ? (
              <Room
                name={name}
                localAudioTrack={localAudioTrack}
                localVideoTrack={localVideoTrack}
              />
            ) : (
              <div className="h-96 flex items-center justify-center">
                <p className="text-gray-500">Meeting not started</p>
              </div>
            )}
          </div>

          <div className="w-[30%] flex flex-col">
            <div className="bg-gray-100 rounded-lg p-4 flex-grow mb-4 overflow-y-auto h-80">
              {/* Chat messages would be displayed here */}
              <p className="text-gray-500">Chat messages will appear here...</p>
            </div>

            <div className="mt-auto">
              <textarea
                className="w-full p-2 border rounded-lg resize-none"
                placeholder="Type your message..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg mt-2 w-full transition-colors duration-200"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}