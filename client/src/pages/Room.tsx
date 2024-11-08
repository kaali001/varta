import { useEffect, useCallback, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ClipLoader } from "react-spinners";
import config from "../config";

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

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) => {
  const [lobby, setLobby] = useState(true);
  // const [RoomId, setRoomId] = useState<string | null>(null); // Storing roomId in state
  const socketRef = useRef<Socket | null>(null);
  const sendingPcRef = useRef<RTCPeerConnection | null>(null);
  const receivingPcRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = useRef(new MediaStream());

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

  useEffect(() => {
    const socket = io(URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("send-offer", async ({ roomId }) => {
      console.log("Received offer request. Creating offer... RoomId:", roomId);
      setLobby(false);
      // setRoomId(roomId);
      // console.log("roomId:",RoomId);

      const sendingPc = initializePeerConnection("sender", roomId);
      sendingPcRef.current = sendingPc;

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

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div className="relative w-full h-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-full object-cover"
        />

        {lobby && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <ClipLoader color="#4A90E2" size={50} />
          </div>
        )}

        <div className="absolute bottom-4 left-4 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-24 h-24 object-cover"
          />
        </div>
      </div>
      <p className="absolute bottom-2 text-lg font-semibold text-white">
        {name}
      </p>
    </div>
  );
};
