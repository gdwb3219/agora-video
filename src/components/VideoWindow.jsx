import React, { useEffect, useState, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import * as deepar from "deepar";

const licenseKey =
  "fa3e2ece3c087b6cf66e5c173a003a057c9d5ea69cec9e7e360cf59112cd53dd33360d8276a48e08";
const appId = "5a11237b69e2452cb234a5583b8d08ff";
const token =
  "007eJxTYBD/eleyei+vYnpLaZaUhQfTi2Nhm6arfvG/8nNKQ82l5AYFBtNEQ0MjY/MkM8tUIxNTo+QkI2OTRFNTC+MkixQDi7S0k9O60hoCGRnUWHVYGBkgEMRnYchNzMxjYAAADZ0eLg==";
const channel = "main";
const effectList = [
  "effects/Bomb.deepar",
  "effects/three-eye-monster.deepar",
  "effects/ray-ban-wayfarer.deepar",
  "effects/viking_helmet.deepar",
  "effects/MakeupLook.deepar",
  "effects/Split_View_Look.deepar",
  "effects/flower_face.deepar",
  "effects/Stallone.deepar",
  "effects/galaxy_background_web.deepar",
  "effects/Humanoid.deepar",
  "effects/Neon_Devil_Horns.deepar",
  "effects/Ping_Pong.deepar",
  "effects/Pixel_Hearts.deepar",
  "effects/Snail.deepar",
  "effects/Hope.deepar",
  "effects/Vendetta_Mask.deepar",
  "effects/Fire_Effect.deepar",
];

const VideoWindow = () => {
  const [deepAR, setDeepAR] = useState(null);
  const [filterIndex, setFilterIndex] = useState(0);
  const [agoraEngine, setAgoraEngine] = useState(null);
  const [mainStreamId, setMainStreamId] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const loadingProgressBarRef = useRef(null);
  const deepARScreenRef = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const deepARInstance = await deepar.initialize({
          licenseKey,
          previewElement: deepARScreenRef.current,
          effect: effectList[0],
          rootPath: "./deepar-resources", // Adjusted to match public folder structure
        });
        setDeepAR(deepARInstance);

        const agoraInstance = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp9",
        });
        setAgoraEngine(agoraInstance);

        await agoraInstance.join(appId, channel, token);
        const canvas = deepARInstance.getCanvas();
        const outputStream = canvas.captureStream(30);

        let localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        let localVideoTrack = AgoraRTC.createCustomVideoTrack({
          mediaStreamTrack: outputStream.getVideoTracks()[0],
        });

        await agoraInstance.publish([localVideoTrack, localAudioTrack]);

        agoraInstance.on("user-published", async (user, mediaType) => {
          await agoraInstance.subscribe(user, mediaType);
          if (mediaType === "video") {
            handleUserPublished(user);
          }
        });

        agoraInstance.on("user-unpublished", handleUserUnpublished);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    initialize();

    return () => {
      if (agoraEngine) {
        agoraEngine.leave();
      }
    };
  }, []);

  const handleUserPublished = (user) => {
    const remoteId = user.uid;
    if (Object.keys(remoteStreams).length === 0) {
      setRemoteStreams((prev) => ({ ...prev, [remoteId]: user }));
      setMainStreamId(remoteId);
      user.videoTrack.play("full-screen-video");
    } else {
      addRemoteStreamMiniView(user);
    }
  };

  const handleUserUnpublished = (user) => {
    const remoteId = user.uid;
    const updatedStreams = { ...remoteStreams };
    delete updatedStreams[remoteId];
    setRemoteStreams(updatedStreams);

    if (remoteId === mainStreamId) {
      const streamIds = Object.keys(updatedStreams);
      if (streamIds.length > 0) {
        const newMainStreamId =
          streamIds[Math.floor(Math.random() * streamIds.length)];
        updatedStreams[newMainStreamId].videoTrack.play("full-screen-video");
        setMainStreamId(newMainStreamId);
      }
    }
  };

  const addRemoteStreamMiniView = (user) => {
    const remoteId = user.uid;
    const containerId = `${remoteId}_container`;

    const remoteStreamsDiv = document.getElementById("remote-streams");
    const streamContainer = document.createElement("div");
    streamContainer.id = containerId;
    streamContainer.className = "remote-stream-container col";

    const videoDiv = document.createElement("div");
    videoDiv.id = `agora_remote_${remoteId}`;
    videoDiv.className = "remote-video";

    streamContainer.appendChild(videoDiv);
    remoteStreamsDiv.appendChild(streamContainer);

    user.videoTrack.play(videoDiv.id);

    streamContainer.ondblclick = () => handleStreamDoubleClick(remoteId);

    setRemoteStreams((prev) => ({ ...prev, [remoteId]: user }));
  };

  const handleStreamDoubleClick = (streamId) => {
    agoraEngine.setRemoteVideoStreamType(mainStreamId, 1);
    agoraEngine.setRemoteVideoStreamType(streamId, 0);

    document.getElementById(`${mainStreamId}_container`).remove();
    remoteStreams[mainStreamId].videoTrack.stop();
    addRemoteStreamMiniView(remoteStreams[mainStreamId]);

    remoteStreams[streamId].videoTrack.stop();
    remoteStreams[streamId].videoTrack.play("full-screen-video");
    setMainStreamId(streamId);
  };

  const changeFilter = async () => {
    if (deepAR) {
      const nextFilterIndex = (filterIndex + 1) % effectList.length;
      setFilterIndex(nextFilterIndex);
      await deepAR.switchEffect(effectList[nextFilterIndex]);
    }
  };

  return (
    <div id="main-container" hidden={isLoading}>
      <div
        id="loading-screen"
        style={{ display: isLoading ? "block" : "none" }}
      >
        <div id="loading-progress-bar" ref={loadingProgressBarRef} />
      </div>
      <div id="deepar-screen" ref={deepARScreenRef} />
      <div id="full-screen-video" />
      <div id="remote-streams" className="row" />
      <button id="change-filter-button" onClick={changeFilter}>
        Change Filter
      </button>
    </div>
  );
};

export default VideoWindow;
