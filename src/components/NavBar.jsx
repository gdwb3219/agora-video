import React from "react";
import "../css/NavBar.css";
import { useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  // NavBar 현재 url 위치에 따라 ClassName 변경
  const step1Class = () => {
    switch (location.pathname) {
      case "/meeting":
        return "card-highlight";
      case "/meeting2":
        return "card";
      default:
        return "card";
    }
  };

  const step2Class = () => {
    switch (location.pathname) {
      case "/meeting":
        return "card";
      case "/meeting2":
        return "card-highlight";
      default:
        return "card";
    }
  };

  const handleQuit = () => {
    window.location.href = "https://forms.gle/ytJQ6kRqPwBHQGxP7";
  };

  return (
    <div className='navbar'>
      <div className='nav-header'>
        <div className='logo-container'>
          <a href='/' className='logo'>
            MonstAR
          </a>
        </div>

        <button className='nav-button' onClick={handleQuit}>
          매칭 종료하기
        </button>
      </div>

      <div className='cards-container'>
        <div className={step1Class()}>
          <span>Step 1. AR 블라인드 대화하기</span>
        </div>
        <div className='arrow'>▶</div>
        <div className={step2Class()}>
          <span>Step 2. 얼굴 보고 대화하기 (모두 동의 시)</span>
        </div>
        <div className='arrow'>▶</div>
        <div className='card'>
          <span>Step 3. 연락처 공유하기</span>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
