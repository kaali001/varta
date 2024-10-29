import React, { useState, useEffect } from "react";

import { Room } from "./Room";
import { Navbar } from "../Components/Navbar";
import UserPermission from "../components/media_permission/UserPermission";

import getBrowserType from "../utils/getBrowser";
import {
  checkPermissions,
  handleUserPermission,
} from "../components/media_permission/mediaPermissions";

const ChatPage: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);

  const [name] = useState("User");

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);

  const [localVideoTrack, setLocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);

  console.log({
    localVideoTrack,
    localAudioTrack,
  });

  const [error, setError] = useState({ isError: false, errorMsg: "" });

  const browser = getBrowserType();

  const getMediaTracks = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalAudioTrack(stream.getAudioTracks()[0]);
      setLocalVideoTrack(stream.getVideoTracks()[0]);
    } catch (error: any) {
      setError({ isError: true, errorMsg: error.message });
    }
  };

  // Firefox doesnot support navigator.permissions.query() used in handleUserPermission.
  useEffect(() => {
    if (browser === "Chrome" || "Edge") {
      handleUserPermission(
        isChatActive,
        setIsPopoverOpen,
        getMediaTracks,
        setError
      );
    } else {
      if (isChatActive) {
        getMediaTracks();
      }
    }
  }, [isChatActive]);

  useEffect(() => {
    if (browser === "Chrome" || "Edge") {
      checkPermissions(setError);
    }
  }, [isChatActive]);

  if (error.isError) {
    console.log(error.errorMsg);
  }

  return (
    <>
    <Navbar/>
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
          {/* Render only if both Audio and Video track are not null and chat is active. */}
          {isChatActive &&
          localAudioTrack?.enabled &&
          localVideoTrack?.enabled ? (
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

      {isPopoverOpen && (
        <UserPermission
          setIsPopoverOpen={setIsPopoverOpen}
          isPopoverOpen={isPopoverOpen}
          setLocalAudioTrack={setLocalAudioTrack}
          setLocalVideoTrack={setLocalVideoTrack}
          setError={setError}
        />
      )}
    </div>
    </>
  );
};

export default ChatPage;
