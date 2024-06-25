import * as DeepAR from 'deepar';
import React, { useEffect, useRef } from 'react';

function DeepARVideoCall() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const deepARRef = useRef(null);

  useEffect(() => {
    // Deep AR 초기화
    const deepAR = new DeepAR({
      licenseKey:
        '454f2f58fb0318da7929459e8ec3425a39cdaf82061cfb02e899bb7341d22779c30e8aea9246718c',
      canvas: canvasRef.current,
      width: videoRef.current.offsetWidth,
      height: videoRef.current.offsetHeight,
      numberOfFaces: 1,
      onInitialize: () => {
        console.log('Deep AR initialized');
        deepAR.startVideo();
      },
    });

    deepARRef.current = deepAR;

    return () => {
      // Deep AR 종료 및 클린업
      if (deepARRef.current) {
        deepARRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // 비디오 스트림 가져오기
    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        if (deepARRef.current) {
          deepARRef.current.setVideoElement(videoRef.current);
        }
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    };

    startVideoStream();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: '100%', height: '100%' }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}

export default DeepARVideoCall;
