
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ClipLoader } from "react-spinners";
import config from "../config";

const URL = `${config.backendUrl}`;


declare global {
  interface Window {
    pcr: RTCPeerConnection | null;
  }
}

window.pcr = null;

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
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
     const socket = io(URL, {
      transports: ['websocket'], // Use only WebSocket
      withCredentials: true,      // Allow credentials (cookies/auth headers)
    });
    socketRef.current = socket;

    const initializePeerConnection = () => {
      const pc = new RTCPeerConnection(); // No ICE servers configured

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          console.log("Sending ICE candidate...");
          socket.emit("add-ice-candidate", { candidate: e.candidate });
        }
      };

      pc.ontrack = (e) => {
        console.log("Adding remote track:", e.track);
        const stream = remoteVideoRef.current?.srcObject as MediaStream || new MediaStream();
        stream.addTrack(e.track);
        remoteVideoRef.current!.srcObject = stream;
      };

      return pc;
    };

    socket.on("send-offer", async ({ roomId }) => {
      console.log("Received offer request. Creating offer...");
      setLobby(false);

      const pc = initializePeerConnection();
      peerConnectionRef.current = pc;

      if (localVideoTrack) pc.addTrack(localVideoTrack);
      if (localAudioTrack) pc.addTrack(localAudioTrack);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { sdp: offer, roomId });
    });

    socket.on("offer", async ({ sdp, roomId }) => {
      console.log("Received offer. Creating answer...");

      if (!peerConnectionRef.current) {
        const pc = initializePeerConnection();
        peerConnectionRef.current = pc;
      }

      const pc = peerConnectionRef.current;

      try {
        if (pc.signalingState !== "stable") {
          console.warn(`Unexpected signaling state: ${pc.signalingState}. Resetting...`);
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        }

        if (pc.signalingState === "have-remote-offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          console.log("Sending answer SDP...");
          socket.emit("answer", { sdp: answer, roomId });
        } else {
          console.warn(`Cannot create answer. Signaling state: ${pc.signalingState}`);
        }
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    socket.on("answer", async ({ sdp }) => {
      console.log("Received answer. Setting remote description...");
      const pc = peerConnectionRef.current;
      if (!pc) {
        console.error("Peer connection not initialized.");
        return;
      }

      try {
        if (pc.signalingState === "have-local-offer") {
          console.log("Setting remote answer SDP...");
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        } else {
          console.warn(`Unexpected state when receiving answer: ${pc.signalingState}`);
        }
      } catch (error) {
        console.error("Error setting remote answer SDP:", error);
      }
    });

    socket.on("add-ice-candidate", async ({ candidate }) => {
      console.log("Adding ICE candidate...");
      try {
        await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected. Closing peer connection...");
      peerConnectionRef.current?.close();
    });

    return () => {
      socket.disconnect();
      peerConnectionRef.current?.close();
    };
  }, [localAudioTrack, localVideoTrack]);

  useEffect(() => {
    if (localVideoRef.current && localVideoTrack) {
      const stream = new MediaStream([localVideoTrack]);
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(console.error);
    }
  }, [localVideoTrack]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div className="relative w-full h-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        {lobby && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <ClipLoader color="#4A90E2" size={50} />
          </div>
        )}
        <div className="absolute bottom-4 left-4 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            muted
            className="w-24 h-24 object-cover"
          />
        </div>
      </div>
      <p className="absolute bottom-2 text-lg font-semibold text-white">{name}</p>
    </div>
  );
};
