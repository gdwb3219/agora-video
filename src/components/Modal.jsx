import React, { useState } from 'react';
import './Modal.css'; // 모달의 스타일을 정의한 CSS 파일

// 모달 컴포넌트
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
