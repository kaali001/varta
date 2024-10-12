
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ClipLoader } from "react-spinners";


const URL = "http://localhost:5000";

// Extend the Window interface
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
//   const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const sendingPcRef = useRef<RTCPeerConnection | null>(null);
  const receivingPcRef = useRef<RTCPeerConnection | null>(null);
  
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
  const socket = io(URL);
  socketRef.current = socket;

  socket.on("send-offer", async ({ roomId }) => {
    console.log("Received offer request. Creating offer...");
    setLobby(false);
    const pc = new RTCPeerConnection();
    sendingPcRef.current = pc;

    if (localVideoTrack) pc.addTrack(localVideoTrack);
    if (localAudioTrack) pc.addTrack(localAudioTrack);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("Sending ICE candidate...");
        socket.emit("add-ice-candidate", { candidate: e.candidate, type: "sender", roomId });
      }
    };

    pc.onnegotiationneeded = async () => {
      console.log("Negotiation needed. Creating offer...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { sdp: offer, roomId });
    };
  });


  socket.on("offer", async ({ roomId, sdp }) => {
    console.log("Received offer. Creating answer...");
    const pc = new RTCPeerConnection();
    receivingPcRef.current = pc;
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    pc.ontrack = (e) => {
        console.log("Adding remote track:", e.track);
        const stream = new MediaStream();
        stream.addTrack(e.track);
      
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.play().catch((error) => {
              console.error("Remote video playback failed:", error);
            });
        }
      };
      
      

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("Sending ICE candidate...");
        socket.emit("add-ice-candidate", { candidate: e.candidate, type: "receiver", roomId });
      }
    };

    socket.emit("answer", { sdp: answer, roomId });
  });


  socket.on("answer", async ({ sdp, roomId }) => {
    console.log("Received answer. Setting remote description...");
    const pc = sendingPcRef.current;
    if (!pc) {
      console.error("PeerConnection not initialized for the sender.");
      return;
    }
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  });


  socket.on("add-ice-candidate", async ({ candidate, type }) => {
    console.log(`Adding ICE candidate for ${type}...`);
    const pc = type === "sender" ? sendingPcRef.current : receivingPcRef.current;
    if (!pc) {
      console.error("PeerConnection not initialized.");
      return;
    }
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  });

  
  socket.on("disconnect", () => {
    console.log("Socket disconnected. Closing PeerConnection...");
    sendingPcRef.current?.close();
    receivingPcRef.current?.close();
  });
  
  
  return () => {
    socket.disconnect();
  };
}, [localVideoTrack, localAudioTrack]);

  useEffect(() => {
    if (localVideoRef.current && localVideoTrack) {
      const stream = new MediaStream([localVideoTrack]);
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(console.error);
    }
    
  }, [localVideoTrack]);


  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {/* Remote Video */}
      <div className="relative w-full h-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />

        {/* Circular Loader */}
        {lobby && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <ClipLoader color="#4A90E2" size={50} />
          </div>
        )}

        {/* Self Video (Bottom-Left Corner) */}
        <div className="absolute bottom-4 left-4 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            muted
            className="w-24 h-24 object-cover"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      </div>

      {/* User Name Below Video */}
      <p className="absolute bottom-2 text-lg font-semibold text-white">
        {name}
      </p>
    </div>
  );
};