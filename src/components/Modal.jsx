import React, { useEffect, useRef, useState } from "react";
import "../css/Modal.css"; // 모달의 스타일을 정의한 CSS 파일
import ReactModal from "react-modal";
import { Link, Navigate, Redirect } from "react-router-dom";

// 모달 컴포넌트
function Modal({ isModalOpen, closeModal, wsRef }) {
  const [qtime, setQtime] = useState(30);
  const [answer, setAnswer] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const qtimeRef = useRef(null);

  // console.log("모달 컴포넌트 실행!?#3", qtimeRef.current, qtime);
  useEffect(() => {
    qtimeRef.current = setInterval(() => {
      // console.log("Interval 실행 중!!!#1", qtimeRef.current, qtime);
      setQtime((prevSeconds) => {
        // console.log("Interval 실행 중!!!#2", qtime, prevSeconds);
        if (prevSeconds <= 1) {
          clearInterval(qtimeRef.current);
          wsRef.current.send("User가 제한 시간 내 선택하지 않았습니다.");
          window.location.href = "https://forms.gle/ytJQ6kRqPwBHQGxP7";
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(qtimeRef.current);
    };
  }, []);

  useEffect(() => {
    wsRef.current.onmessage = (event) => {
      console.log("Model도 ws 메시지 받았다!", event.data);
      if (event.data === "All true") {
        console.log("modal도 All True가 실행되었어요!!!");
        setRedirect("next");
      } else {
        console.log("ws로부터 메시지 도착", event.data);
      }
    };
  }, []);

  if (redirect === "next") {
    return <Navigate to='/meeting2' />;
  } else if (redirect === "qna") {
    return <Navigate to='/qna' />;
  }

  const handleTrue = () => {
    wsRef.current.send("true");
    console.log("더 합시다");
    setAnswer("수락 하셨습니다. 잠시만 대기해주세요.");
  };

  const handleFalse = () => {
    wsRef.current.send("false");
    console.log("여기서 그만합시다");
    setAnswer("거절 하셨습니다. 잠시만 대기해주세요.");
  };
  return (
    <>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Time's Up"
        className='timeupModal'
        overlayClassName='Overlay'
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
