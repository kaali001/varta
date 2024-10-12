

import React, { useState, useEffect} from "react";
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-4xl flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Video Chat</h2>
         
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
            onClick={() => setIsChatActive((prev) => !prev)}
          >
            {isChatActive ? "End Chat" : "Join"}
          </button>
        </div>

      
        <div className="relative bg-gray-200 h-64 rounded-lg flex justify-center items-center">
          {isChatActive ? (
            <Room
              name={name}
              localAudioTrack={localAudioTrack}
              localVideoTrack={localVideoTrack}
            />
          ) : (
            <p className="text-gray-500">Chat Ended</p>
          )}
        </div>

      
        <div className="border-t pt-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            placeholder="Type your message..."
            rows={3}
          />
          <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg mt-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;