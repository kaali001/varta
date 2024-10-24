import React, { useState, useEffect } from "react";
import { Room } from "./Room"; 

const ChatPage: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [name, setName] = useState("User");
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col justify-center items-center">
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-4xl flex flex-col space-y-4 backdrop-filter backdrop-blur-lg border border-gray-300">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 transition duration-300 transform hover:scale-105">
            Video Chat
          </h2>
          <button
            className={`py-2 px-4 rounded-lg transition duration-300 
            ${isChatActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white shadow-md`}
            onClick={() => setIsChatActive((prev) => !prev)}
          >
            {isChatActive ? "End Chat" : "Join"}
          </button>
        </div>

        <div className="relative bg-gray-200 h-64 rounded-lg flex justify-center items-center overflow-hidden shadow-lg">
          {isChatActive ? (
            <Room
              name={name}
              localAudioTrack={localAudioTrack}
              localVideoTrack={localVideoTrack}
            />
          ) : (
            <p className="text-gray-500">Chat Ended</p>
          )}
          <div className="absolute inset-0 bg-opacity-20 animate-pulse bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="border-t pt-4">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Type your message..."
            rows={3}
          />
          <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg mt-2 hover:bg-indigo-700 transition duration-300 shadow-md">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
