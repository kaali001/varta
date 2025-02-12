import React, { useState, useEffect, useCallback, useRef } from "react";
import { Camera, Mic, X, Info, ChevronRight, ChevronLeft } from "lucide-react";
import { PermissionStatus } from "./PermissionStatus";
import { MediaToggle } from "./MediaComponent";

interface UserPermissionProps {
  isPopoverOpen: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalAudioTrack: React.Dispatch<React.SetStateAction<MediaStreamTrack | null>>;
  setLocalVideoTrack: React.Dispatch<React.SetStateAction<MediaStreamTrack | null>>;
  setError: React.Dispatch<React.SetStateAction<{ isError: boolean; errorMsg: string }>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
}

const languageOptions = [
  "English", "Hindi", "Spanish", "French", "German",
  "Mandarin", "Japanese", "Korean"
];

export default function UserPermission({
  isPopoverOpen,
  setIsPopoverOpen,
  setLocalAudioTrack,
  setLocalVideoTrack,
  setError,
  setName,
  setSelectedLanguages,
}: UserPermissionProps) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState(() => {
    // Retrieve username from localStorage if it exists
    return localStorage.getItem("username") || "";
  });
  const [selectedLangs, setSelectedLangs] = useState<string[]>(() => {
    // Retrieve selected languages from localStorage if they exist
    const storedLangs = localStorage.getItem("selectedLanguages");
    return storedLangs ? JSON.parse(storedLangs) : [];
  });
  const [showLangOptions, setShowLangOptions] = useState(false);
  const [videoPermission, setVideoPermission] = useState<boolean | null>(null);
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const didUserInteracted = sessionStorage.getItem("didUserInteracted");
  const popoverRef = useRef<HTMLDivElement>(null);

  const handlePermissionRequest = useCallback(async (mediaType: "video" | "audio") => {
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
  }, [setLocalVideoTrack, setLocalAudioTrack, setError]);

  const handleLanguageSelect = (lang: string) => {
    const updatedLangs = selectedLangs.includes(lang)
      ? selectedLangs.filter(l => l !== lang)
      : [...selectedLangs, lang];
    setSelectedLangs(updatedLangs);
    // Save selected languages to localStorage
    localStorage.setItem("selectedLanguages", JSON.stringify(updatedLangs));
  };

  const removeLanguage = (lang: string) => {
    const updatedLangs = selectedLangs.filter(l => l !== lang);
    setSelectedLangs(updatedLangs);
    // Save updated languages to localStorage
    localStorage.setItem("selectedLanguages", JSON.stringify(updatedLangs));
  };

  const handleNextStep = () => {
    if (userName.trim() && selectedLangs.length > 0) {
      setName(userName);
      setSelectedLanguages(selectedLangs);
      localStorage.setItem("username", userName);
      setStep(2);
    }
  };

  const handlePreviousStep = () => setStep(1);

  const handleOnConfirm = () => {
    if (audioPermission && videoPermission) {
      sessionStorage.setItem("audioPermissionGranted", "true");
      sessionStorage.setItem("videoPermissionGranted", "true");
    }
    setIsPopoverOpen(false);
  };
 
  const checkPermissions  = useCallback(async () => {
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
        await handlePermissionRequest("video");
        setVideoPermission(true);
      }

      if (microphone.state === "denied" || microphone.state === "prompt") {
        if (microphone.state === "denied") {
          sessionStorage.setItem("didUserInteracted", "true");
        }
        setAudioPermission(false);
      } else {
        await handlePermissionRequest("audio");
        setAudioPermission(true);
      }
    } catch (error) {
      setError({
        isError: true,
        errorMsg: `Permission check error:, ${error}`,
      });
    }
  }, [handlePermissionRequest, setError]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowLangOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    checkPermissions();
  },  [checkPermissions]);

  if (!isPopoverOpen) return null;

  return (
    <div className="fixed inset-0 mt-4 flex items-center justify-center z-50">
    <div
      ref={popoverRef}
      className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl"
    >
      <div className="p-6">
        <button
          onClick={() => setIsPopoverOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
  
        {step === 1 ? (
          <div className="relative">
            <h3 className="text-2xl font-bold text-primaryPink mb-6">Profile Setup</h3>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primaryPink"
                placeholder="Enter your name"
              />
            </div>
  
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Languages
              </label>
              
              {/* Custom language input */}
              <div 
                className="relative border rounded-lg p-2 min-h-[46px] cursor-text"
                onClick={() => setShowLangOptions(true)}
              >
                <div className="flex flex-wrap gap-2">
                  {selectedLangs.map(lang => (
                    <div
                      key={lang}
                      className="bg-primaryPink text-white px-3 py-1 rounded-full flex items-center"
                    >
                      <span className="text-sm">{lang}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLanguage(lang);
                        }}
                        className="ml-2 hover:text-gray-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Dropdown arrow */}
                <div className="absolute right-3 top-3">
                  <svg 
                    className="w-5 h-5 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </div>
              </div>
  
              {/* Language options dropdown */}
              {showLangOptions && (
                <div className="mt-2 border rounded-lg p-2 max-h-28 overflow-y-auto">
                  {languageOptions.map(lang => (
                    <div
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`p-2 m-1 text-sm rounded-lg cursor-pointer ${
                        selectedLangs.includes(lang)
                          ? 'bg-primaryPink text-white'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={handleNextStep}
                disabled={!userName.trim() || selectedLangs.length === 0}
                className="px-6 py-2 bg-primaryPink text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors flex items-center"
              >
                Next
                <ChevronRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
          ) : (
            <>
              <button
                onClick={handlePreviousStep}
                className="mb-4 text-primaryPink text-sm hover:text-accentOrange flex items-center"
              >
                <ChevronLeft className="mr-1" /> Back
              </button>

              <h3 className="text-2xl font-bold text-primaryPink mb-6">Media Permissions</h3>

              <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex items-center">
                  <Info className="text-blue-500 mr-2" />
                  <p className="text-sm text-blue-800">
                    We need access to your camera and microphone for video calls.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <MediaToggle
                  icon={<Camera className="text-primaryPink" />}
                  title="Camera Access"
                  description="Allow camera for video calls"
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
                  icon={<Mic className="text-primaryPink" />}
                  title="Microphone Access"
                  description="Allow microphone for audio calls"
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

              <button
                onClick={handleOnConfirm}
                className="w-full bg-primaryPink text-white py-2 rounded-lg mt-6 hover:bg-opacity-90"
              >
                Start Chatting
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}