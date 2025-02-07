import { useEffect, useCallback, useRef, useState,useMemo } from "react";
import { Socket, io } from "socket.io-client";
import { HashLoader } from "react-spinners";
import config from "../config";
import ChatSection from "./ChatSection";

const URL = `${config.backendUrl}`;

interface OfferPayload {
  sdp: RTCSessionDescriptionInit;
  roomId: string;
}

interface AnswerPayload {
  sdp: RTCSessionDescriptionInit;
}

interface IceCandidatePayload {
  candidate: RTCIceCandidateInit;
  type: string;
  roomId: string;
}

interface Message {
  sender: "self" | "remote";
  content: string;
}

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
  chatInput,
  setChatInput,
  joinExitHandler,
  joinExitLabel,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
  chatInput: string;
  setChatInput: (value: string) => void;
  joinExitHandler: () => void;
  joinExitLabel: string;
}) => {
  const [lobby, setLobby] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [remoteUserCountry, setRemoteUserCountry] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Fixed
  const socketRef = useRef<Socket | null>(null);
  const sendingPcRef = useRef<RTCPeerConnection | null>(null);
  const receivingPcRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = useRef(new MediaStream());

  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const initializePeerConnection = (
    type: "sender" | "receiver",
    roomId: string
  ): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(`Sending ICE candidate from ${type} PC...`);
        socketRef.current?.emit("add-ice-candidate", {
          candidate: e.candidate,
          type,
          roomId,
        });
      }
    };

    pc.ontrack = (e) => {
      console.log("Received remote track:", e.track);
      if (!remoteStreamRef.current.getTrackById(e.track.id)) {
        remoteStreamRef.current.addTrack(e.track);
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        remoteVideoRef.current.onloadedmetadata = () => {
          console.log(
            "Remote video metadata loaded, attempting to play video."
          );
          if (remoteVideoRef.current?.paused) {
            remoteVideoRef.current
              .play()
              .catch((err) => console.error("Video playback error:", err));
          }
        };
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (e) => {
        const message = e.data;
        setMessages((prev: Message[]) => [
          ...prev,
          { sender: "remote", content: message },
        ]);
      };
    };

    return pc;
  };

  const handleOffer = useCallback(
    async ({ sdp, roomId }: OfferPayload) => {
      console.log("Received offer. Creating answer... RoomId:", roomId);
      setLobby(false);
      // setRoomId(roomId); // Store roomId in state

      const receivingPc = initializePeerConnection("receiver", roomId);
      receivingPcRef.current = receivingPc;

      try {
        await receivingPc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("Remote offer set successfully on receiving PC.");

        if (localAudioTrack) {
          receivingPc.addTrack(
            localAudioTrack,
            new MediaStream([localAudioTrack])
          );
          console.log("Added local audio track to receiving PC.");
        }
        if (localVideoTrack) {
          receivingPc.addTrack(
            localVideoTrack,
            new MediaStream([localVideoTrack])
          );
          console.log("Added local video track to receiving PC.");
        }

        const answer = await receivingPc.createAnswer();
        await receivingPc.setLocalDescription(answer);
        console.log("Sending answer SDP...");
        socketRef.current?.emit("answer", { sdp: answer, roomId });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    },
  [localAudioTrack, localVideoTrack]);

  const handleAnswer = async ({ sdp }: AnswerPayload) => {
    console.log("Received answer. Setting remote description...");
    const sendingPc = sendingPcRef.current;

    if (!sendingPc) {
      console.error("Sending PeerConnection not found.");
      return;
    }

    try {
      await sendingPc.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("Remote answer description set successfully on sending PC.");
    } catch (error) {
      console.error("Error setting remote answer SDP:", error);
    }
  };

  const handleAddIceCandidate = async ({
    candidate,
    type,
    roomId,
  }: IceCandidatePayload) => {
    console.log(
      "Received ICE candidate from remote:",
      candidate,
      "Type:",
      type
    );
    const pc =
      type === "sender" ? receivingPcRef.current : sendingPcRef.current;

    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log(`Added ICE candidate to ${type} PC.`);
      } catch (error) {
        console.error(
          `Error adding received ICE candidate to ${type} PC:`,
          error
        );
      }
    } else {
      console.warn(`PeerConnection for type ${type} not found.`);
    }
  };

  const handleSendMessage = () => {
    if (dataChannelRef.current && chatInput.trim()) {
      dataChannelRef.current.send(chatInput);
      setMessages((prev: Message[]) => [
        ...prev,
        { sender: "self", content: chatInput },
      ]);
      setChatInput("");
    }
  };

  const handleExit = () => {
    console.log("Exit button pressed. Cleaning up connections.");
  
    // Start matching delay
    setIsMatching(true);

    // Close peer connections
    sendingPcRef.current?.close();
    receivingPcRef.current?.close();
    sendingPcRef.current = null;
    receivingPcRef.current = null;
  
    setMessages([]);
    setRemoteUserCountry(null);
    
    // Clear states after an interval(must be less than removeRoom() in server.)
    setTimeout(() => {
      setLobby(true);
      setIsMatching(false);
    }, 1800); // 1.8-second delay
  
    // Notify the server to requeue the user
    socketRef.current?.emit("user-exit", { name });
  
    // Reset remote video
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      // remoteStreamRef.current = new MediaStream(); // Create fresh stream
    }
  
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };
  
  useEffect(() => {
    const socket = io(URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("send-offer", async ({ roomId, remoteCountry }) => {
      console.log("Received offer request. Creating offer... RoomId:", roomId);
      setLobby(false);
      setMessages([]);
      console.log("Received send-offer payload:", { roomId, remoteCountry });
      setRemoteUserCountry(remoteCountry);

      if (remoteCountry && remoteCountry !== "Unknown") {
        setRemoteUserCountry(remoteCountry);
      } else {
        setRemoteUserCountry(null);
      }

      const sendingPc = initializePeerConnection("sender", roomId);
      sendingPcRef.current = sendingPc;

      const dataChannel = sendingPc.createDataChannel("chat");
      dataChannelRef.current = dataChannel;

      dataChannel.onmessage = (e) => {
        setMessages((prev) => [...prev, { sender: "remote", content: e.data }]);
      };

      if (localVideoTrack) {
        sendingPc.addTrack(localVideoTrack, new MediaStream([localVideoTrack]));
        console.log("Added local video track to sending PC.");
      }
      if (localAudioTrack) {
        sendingPc.addTrack(localAudioTrack, new MediaStream([localAudioTrack]));
        console.log("Added local audio track to sending PC.");
      }

      try {
        const offer = await sendingPc.createOffer();
        await sendingPc.setLocalDescription(offer);
        console.log("Offer sent.");
        socket.emit("offer", { sdp: offer, roomId });
      } catch (error) {
        console.error("Error creating or sending offer:", error);
      }
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("add-ice-candidate", handleAddIceCandidate);
    socket.on("room-removed", () => {
      console.log("Room removed. Resetting state...");

      setIsMatching(true);
      // Clean up WebRTC connections
      sendingPcRef.current?.close();
      receivingPcRef.current?.close();
      sendingPcRef.current = null;
      receivingPcRef.current = null;
      setMessages([]);
      setRemoteUserCountry(null);

      setTimeout(() => {
        setLobby(true);
        setIsMatching(false);
      }, 1800);

      // Reset remote video
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current = new MediaStream();
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected. Closing peer connections.");
      sendingPcRef.current?.close();
      receivingPcRef.current?.close();
    });

    return () => {
      socket.disconnect();
      sendingPcRef.current?.close();
      receivingPcRef.current?.close();
    };
  }, [localAudioTrack, localVideoTrack, handleOffer]);

  // Local video rendering effect
  useEffect(() => {
    const videoElement = localVideoRef.current;
    if (videoElement && localVideoTrack) {
      const stream = new MediaStream([localVideoTrack]);
      videoElement.srcObject = stream;
      videoElement.muted = true;

      const handleCanPlay = () => {
        console.log("Local video is ready to play.");
        videoElement.play().catch((err) => console.error("Play error:", err));
      };

      videoElement.addEventListener("canplay", handleCanPlay);

      return () => {
        videoElement.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [localVideoTrack]);

  // Add useMemo to prevent unnecessary re-renders of video elements
  const videoConstraints = useMemo(
    () => ({
      className: "w-full h-full object-cover",
    }),
    []
  );

  useEffect(() => {
    const currentRemoteVideo = remoteVideoRef.current;
    return () => {
      // Cleanup only when component unmounts
      if (currentRemoteVideo) {
        currentRemoteVideo.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col min-h-[26rem] md:h-[29rem] lg:h-[31rem] 2xl:h-[41rem] justify-center md:flex-row ">
      <div className="relative flex-1">
        <div className="relative m-4 flex-1 h-[24rem] md:h-[27rem] lg:h-[29rem] 2xl:h-[39rem] flex items-center justify-center bg-white bg-opacity-50 rounded-lg overflow-hidden shadow-lg">
          {/* Username Label */}
          {!lobby && (
            <div className="absolute top-2 left-4 flex items-center bg-white rounded shadow-lg p-1">
              {remoteUserCountry && (
                <img
                  src={`https://flagcdn.com/16x12/${remoteUserCountry.toLowerCase()}.png`}
                  alt="Country Flag"
                  className="rounded-full size-[1.5rem] mr-2"
                />
              )}
              <span className="text-gray-700 font-semibold">{name}</span>
            </div>
          )}

          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={videoConstraints.className}
            onContextMenu={(e) => e.preventDefault()}
            key="remote-video" // Static key
          />

          {/* Loading Indicator */}
          {(lobby || isMatching) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50">
              <HashLoader color="#fa4e65" />
              <div className="mt-3 text-lg font-medium text-[#FA4E5B] ">
                Finding new partner...
              </div>
            </div>
          )}

          {/* Local Video */}
          <div className="absolute bottom-4 left-4 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-20 h-20 md:w-24 md:h-24 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="h-full lg:w-1/3">
        <ChatSection
          chatInput={chatInput}
          setChatInput={setChatInput}
          messages={messages}
          sendMessage={handleSendMessage}
          joinExitHandler={handleExit}
          joinExitLabel={joinExitLabel}
        />
      </div>
    </div>
  );
};