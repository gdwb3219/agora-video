import React, { useEffect, useRef, useState } from "react";
import "../css/Modal.css"; // 모달의 스타일을 정의한 CSS 파일
import ReactModal from "react-modal";
import { Link } from "react-router-dom";

// 모달 컴포넌트
function Modal({ isModalOpen, closeModal, wsRef }) {
  const [qtime, setQtime] = useState(30);
  const [answer, setAnswer] = useState(null);
  const qtimeRef = useRef(null);

  console.log("모달 컴포넌트 실행!?#3", qtimeRef.current, qtime);
  useEffect(() => {
    qtimeRef.current = setInterval(() => {
      console.log("Interval 실행 중!!!#1", qtimeRef.current, qtime);
      setQtime((prevSeconds) => {
        console.log("Interval 실행 중!!!#2", qtime, prevSeconds);
        if (prevSeconds <= 1) {
          clearInterval(qtimeRef.current);

          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(qtimeRef.current);
    };
  }, []);
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
        <button onClick={handleFalse}>
          {/* <a href='/'>여기서 그만하기</a> */}
          여기서 그만하기
        </button>
        {/* <button>
          <Link to='/meeting2' state={{ isAdmin: false }} onClick={handleTrue}>
            동의하고 계속하기
          </Link>
        </button> */}
        <button onClick={handleTrue}>동의하고 계속하기</button>
        <h3>{answer}</h3>
      </ReactModal>
    </>
  );
}

export default Modal;
