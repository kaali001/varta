import React, { useState, useEffect } from "react";

import { Room } from "./Room";

import UserPermission from "../components/UserPermission";

import getBrowserType from "../utils/getBrowser";

const ChatPage: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);

  const [name] = useState("User");

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);

  const [localVideoTrack, setLocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);

  // Created the error object for better error handling.
  // Note : Catch block erorrs are type casted as any carefully working with it.
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

  // Update session storage if permissions are revoked
  const updateSessionPermissions = (cameraState: string, micState: string) => {
    if (cameraState !== "granted" || micState !== "granted") {
      sessionStorage.removeItem("audioPermissionGranted");
      sessionStorage.removeItem("videoPermissionGranted");
    }
  };

  // Check current permission status of camera and microphone
  // Firefox doesnot support navigator.permissions.query()
  const checkPermissions = async () => {
    try {
      const [camera, microphone] = await Promise.all([
        navigator.permissions.query({ name: "camera" as PermissionName }),
        navigator.permissions.query({ name: "microphone" as PermissionName }),
      ]);

      updateSessionPermissions(camera.state, microphone.state);
    } catch (error: any) {
      setError({ isError: true, errorMsg: error.message });
    }
  };

  // Manage user permission checks when activating the chat.
  // If permission has already been granted, we skip prompting the user again by referring to the session data.
  // For users who enable 'always allow,' we first verify if access is already granted.
  // If access is granted, we directly call getMediaTracks() to proceed with media access.

  const handleUserPermission = async () => {
    try {
      const camera = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      const microphone = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      const hasAudioPermission =
        sessionStorage.getItem("audioPermissionGranted") === "true";

      const hasVideoPermission =
        sessionStorage.getItem("videoPermissionGranted") === "true";

      if (isChatActive) {
        if (microphone.state === "granted" && camera.state === "granted") {
          getMediaTracks();
        } else if (!hasAudioPermission || !hasVideoPermission) {
          setIsPopoverOpen(true);
        } else {
          getMediaTracks();
        }
      }
    } catch (error: any) {
      setError({ isError: true, errorMsg: error.message });
    }
  };

  /* Note : I have not tested out the feature on other browser. So , defaulting the feature to only chrome and edge. */
  useEffect(() => {
    if (browser === "Chrome" || "Edge") {
      handleUserPermission();
    } else {
      if (isChatActive) {
        getMediaTracks();
      }
    }
  }, [isChatActive]);

  useEffect(() => {
    if (browser === "Chrome" || "Edge") {
      checkPermissions();
    }
  }, [isChatActive]);

  if (error.isError) {
    console.log(error.errorMsg);
  }

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
  );
};

export default ChatPage;
