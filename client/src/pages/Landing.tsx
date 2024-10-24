import { useEffect, useRef, useState } from "react";
import { Room } from "./Room";
import "./pages/Landing.css"; // Importing a CSS file for styles

export const Landing = () => {
    const [name, setName] = useState("");
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [joined, setJoined] = useState(false);

    const getCam = async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];
        setLocalAudioTrack(audioTrack);
        setlocalVideoTrack(videoTrack);
        if (!videoRef.current) {
            return;
        }
        videoRef.current.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play();
    };

    useEffect(() => {
        if (videoRef && videoRef.current) {
            getCam();
        }
    }, [videoRef]);

    const handleJoin = () => {
        setJoined(true);
    };

    if (!joined) {
        return (
            <div className="landing-container">
                <video autoPlay ref={videoRef} className="background-video"></video>
                <div className="overlay">
                    <h1 className="title">Welcome to the Future of Communication</h1>
                    <input
                        type="text"
                        placeholder="Enter your name..."
                        onChange={(e) => setName(e.target.value)}
                        className="name-input"
                    />
                    <button onClick={handleJoin} className="join-button">
                        Join
                    </button>
                </div>
            </div>
        );
    }

    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />;
};
