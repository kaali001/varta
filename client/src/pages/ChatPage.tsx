import React, { useState, useEffect } from "react";
import { Room } from "../components/Room";
import { Navbar } from "../components/Navbar";
import UserPermission from "../components/media_permission/UserPermission";
import getBrowserType from "../utils/getBrowser";
import { SendHorizontal } from "lucide-react";
import {
  checkPermissions,
  handleUserPermission,
} from "../components/media_permission/mediaPermissions";

const ChatPage: React.FC = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [name] = useState("User");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
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

  useEffect(() => {
    if (browser === "Chrome" || "Edge") {
      handleUserPermission(
        isChatActive,
        setIsPopoverOpen,
        getMediaTracks,
        setError
      );
    } else if (isChatActive) {
      getMediaTracks();
    }
  }, [isChatActive, browser]);

  useEffect(() => {
    if (browser === "Chrome" || "Edge") {
      checkPermissions(setError);
    }
  }, [isChatActive, browser]);

  if (error.isError) {
    console.log(error.errorMsg);
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 flex flex-col items-center p-4 pt-20 mt-0 min-h-screen overflow-hidden">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden">
          {/* Video Section */}
          <div className="flex-1 relative bg-gray-200 p-4 flex flex-col items-center min-h-[26rem] md:h-[29rem] lg:h-[31rem] 2xl:h-[41rem]">
            {!isPopoverOpen && isChatActive &&
            localAudioTrack?.enabled &&
            localVideoTrack?.enabled ? (
              <>
                <Room
                  name={name}
                  localAudioTrack={localAudioTrack}
                  localVideoTrack={localVideoTrack}
                />
              </>
            ) : (
              <>
                <img
                  className="opacity-50 mt-24 mx-auto"
                  src="./apple-icon-180x180.png"
                  alt="varta-logo"
                />
                <p className="text-gray-500 mt-8 mx-auto">
                  Click on join button to start match.....
                </p>
              </>
            )}
          </div>

          {/* Chat Section */}

          <div className="lg:w-1/3 bg-white border-l border-gray-300 lg:pl-4">
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-y-auto p-4 min-h-[7rem]">
                <p className="text-gray-700">Chat messages...</p>
              </div>

              <div className="flex items-center border-t p-2">
                <button
                  className="text-white bg-[#FA546B] py-2 px-4 mr-2 rounded-lg ml-2"
                  onClick={() => setIsChatActive((prev) => !prev)}
                >
                  {isChatActive ? "Exit" : "Join"}
                </button>

                <div className="relative w-full">
                  <input
                    type="text"
                    className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Type a message..."
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-400"
                    onClick={() => console.log("Send message!")}
                  >
                    <SendHorizontal />
                  </button>
                </div>
              </div>
            </div>
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
