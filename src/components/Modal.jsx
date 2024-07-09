import React, { useState } from "react";
// import "./Modal.css"; // 모달의 스타일을 정의한 CSS 파일
import ReactModal from "react-modal";
import { Link } from "react-router-dom";

// 모달 컴포넌트
function Modal({ isModalOpen, closeModal }) {
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
        <h3>서로의 얼굴이 궁금하다면</h3>
        <h3>필터 해제에 동의 해주세요</h3>
        <p>모두 동의 시 5분의 추가 시간이 주어집니다.</p>
        <button>
          <a href='/'>여기서 그만하기</a>
        </button>
        <button>
          <Link to='/meeting2' state={{ isAdmin: false }}>
            동의하고 계속하기
          </Link>
        </button>
      </ReactModal>
    </>
  );
}

export default Modal;
