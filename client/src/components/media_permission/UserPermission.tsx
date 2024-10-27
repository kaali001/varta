import React, { useState, useEffect, useRef } from "react";

import { Camera, Mic, X, Info } from "lucide-react";

import { PermissionStatus } from "./PermissionStatus";

import { MediaToggle } from "./MediaComponent";

interface UserPermissionProps {
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalAudioTrack: React.Dispatch<
    React.SetStateAction<MediaStreamTrack | null>
  >;
  setLocalVideoTrack: React.Dispatch<
    React.SetStateAction<MediaStreamTrack | null>
  >;
  setError: React.Dispatch<
    React.SetStateAction<{
      isError: boolean;
      errorMsg: string;
    }>
  >;
}

export default function UserPermission({
  isPopoverOpen,
  setIsPopoverOpen,
  setLocalAudioTrack,
  setLocalVideoTrack,
  setError,
}: UserPermissionProps) {
  const [videoPermission, setVideoPermission] = useState<boolean | null>(null);
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const didUserInteracted = sessionStorage.getItem("didUserInteracted");
  const popoverRef = useRef<HTMLDivElement>(null);

  const handlePermissionRequest = async (mediaType: "video" | "audio") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        [mediaType]: true,
      });

      if (mediaType === "video") {
        setVideoPermission(true);
        setLocalVideoTrack(stream.getVideoTracks()[0]);
      } else {
        setAudioPermission(true);
        setLocalAudioTrack(stream.getAudioTracks()[0]);
      }
    } catch (error) {
      if (mediaType === "video") {
        setVideoPermission(false);
      } else {
        setAudioPermission(false);
      }
      setError({
        isError: true,
        errorMsg: `${mediaType} permission denied: ${error}`,
      });
    }
  };

  const handleOnConfirm = () => {
    if (audioPermission && videoPermission) {
      sessionStorage.setItem("audioPermissionGranted", "true");
      sessionStorage.setItem("videoPermissionGranted", "true");
    }
    setIsPopoverOpen(false);
  };

  const checkPermissions = async () => {
    try {
      const [camera, microphone] = await Promise.all([
        navigator.permissions.query({ name: "camera" as PermissionName }),
        navigator.permissions.query({ name: "microphone" as PermissionName }),
      ]);

      if (camera.state === "denied" || camera.state === "prompt") {
        if (camera.state === "denied") {
          sessionStorage.setItem("didUserInteracted", "true");
        }
        setVideoPermission(false);
      } else {
        handlePermissionRequest("video");
        setVideoPermission(true);
      }

      if (microphone.state === "denied" || microphone.state === "prompt") {
        if (microphone.state === "denied") {
          sessionStorage.setItem("didUserInteracted", "true");
        }
        setAudioPermission(false);
      } else {
        handlePermissionRequest("audio");
        setAudioPermission(true);
      }
    } catch (error) {
      setError({
        isError: true,
        errorMsg: `Permission check error:, ${error}`,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    checkPermissions();
  }, []);

  if (!isPopoverOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={popoverRef}
        className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-lg shadow-2xl bg-white ring-1 ring-black ring-opacity-5 transition duration-300 ease-in-out transform"
      >
        <div className="rounded-lg bg-white overflow-hidden">
          <div className="relative p-6">
            <button
              onClick={() => setIsPopoverOpen(false)}
              className="absolute top-4 right-4 text-highlightOrange hover:text-accentOrange transition duration-150 ease-in-out"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold leading-6 text-primaryPink mb-4">
              Media Access Permissions
            </h3>

            <div className="bg-highlightOrange border-l-4 border-accentOrange p-4 mb-6">
              <div className="grid grid-flow-col items-center">
                <Info
                  className="h-6 w-6 text-accentOrange"
                  aria-hidden="true"
                />
                <p className="text-sm text-white ml-3">
                  We need your permission to access your camera and microphone
                  for the best experience. Your privacy is important to us.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <MediaToggle
                icon={<Camera className="h-8 w-8 text-dangerRed mr-4" />}
                title="Camera Access"
                description="Allow us to use your camera for video calls"
                isPermissionGranted={videoPermission}
                onPermissionRequest={() => handlePermissionRequest("video")}
              />
              {videoPermission !== null && (
                <PermissionStatus
                  isGranted={videoPermission}
                  label="Camera"
                  didUserInteracted={didUserInteracted}
                />
              )}

              <MediaToggle
                icon={<Mic className="h-8 w-8 text-dangerRed mr-4" />}
                title="Microphone Access"
                description="Allow us to use your microphone for audio calls"
                isPermissionGranted={audioPermission}
                onPermissionRequest={() => handlePermissionRequest("audio")}
              />
              {audioPermission !== null && (
                <PermissionStatus
                  isGranted={audioPermission}
                  didUserInteracted={didUserInteracted}
                  label="Microphone"
                />
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleOnConfirm}
                className="w-full bg-primaryPink hover:bg-gradient-to-r hover:from-dangerRed hover:to-accentOrange text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryPink transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Confirm Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
