import React, { useEffect, useRef, useState } from 'react';
import '../css/Modal.css'; // 모달의 스타일을 정의한 CSS 파일
import ReactModal from 'react-modal';
import { Link, Navigate, Redirect } from 'react-router-dom';

// 모달 컴포넌트
function Modal({ isModalOpen, closeModal, pyWsRef }) {
  const [qtime, setQtime] = useState(30);
  const [answer, setAnswer] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const qtimeRef = useRef(null);
  const resWSRef = useRef(null);

  // console.log("모달 컴포넌트 실행!?#3", qtimeRef.current, qtime);
  useEffect(() => {
    qtimeRef.current = setInterval(() => {
      // console.log("Interval 실행 중!!!#1", qtimeRef.current, qtime);
      setQtime((prevSeconds) => {
        // console.log("Interval 실행 중!!!#2", qtime, prevSeconds);
        if (prevSeconds <= 1) {
          clearInterval(qtimeRef.current);
          // pyWsRef.current.send('User가 제한 시간 내 선택하지 않았습니다.');
          window.location.href = 'https://forms.gle/ytJQ6kRqPwBHQGxP7';
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(qtimeRef.current);
    };
  }, []);

  // pyWS response 웹소켓 연결
  // useEffect(() => {
  //   resWSRef.current = new WebSocket('ws://127.0.0.1:8000/ws/response');
  //   resWSRef.current.onopen = () => {
  //     console.log('파이썬 resWSRef 연결');
  //   };
  // }, []);

  // Python Websocket 연결 및 메시지 이벤트 핸들러 등록
  useEffect(() => {
    pyWsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('modal도 ws 메시지 받았다!', event.data, data);
      if (data === 'All True') {
        console.log('modal도 All True가 실행되었어요!!!');
        setRedirect('next');
      } else {
        console.log('ws로부터 메시지 도착', event.data);
      }
    };
  }, []);

  if (redirect === 'next') {
    console.log('init 메시지 sending');
    pyWsRef.current.send(JSON.stringify({ action: 'init' }));
    return <Navigate to="/meeting2" />;
  } else if (redirect === 'qna') {
    return <Navigate to="/qna" />;
  }

  const handleTrue = () => {
    pyWsRef.current.send(JSON.stringify({ action: 'true' }));
    console.log('더 합시다');
    setAnswer('수락 하셨습니다. 잠시만 대기해주세요.');
  };

  const handleFalse = () => {
    pyWsRef.current.send(JSON.stringify({ action: 'false' }));
    console.log('여기서 그만합시다');
    setAnswer('거절 하셨습니다. 잠시만 대기해주세요.');
    window.location.href = 'https://forms.gle/ytJQ6kRqPwBHQGxP7';
  };
  return (
    <>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Time's Up"
        className="timeupModal"
        overlayClassName="Overlay"
      >
        <h3>서로의 얼굴이 궁금하다면 {qtime}</h3>
        <h3>필터 해제에 동의 해주세요</h3>
        <p>모두 동의 시 5분의 추가 시간이 주어집니다.</p>
        <button onClick={handleFalse}>여기서 그만하기</button>

        <button onClick={handleTrue}>동의하고 계속하기</button>
        <h3>{answer}</h3>
      </ReactModal>
    </>
  );
}

export default Modal;
