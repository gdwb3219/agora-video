import React from 'react';
import '../css/NavBar.css';

function NavBar() {
  return (
    <div className="navbar">
      <div className="nav-header">
        <button className="nav-button">내 프로필</button>

        <div className="logo-container">
          <a href="/" className="logo">
            MonstAR 로고
          </a>
        </div>

        <button className="nav-button">매칭 종료하기</button>
      </div>

      <div className="cards-container">
        <div className="card">
          <span>Step 1. AR 블라인드 대화하기</span>
        </div>
        <div className="arrow">▶</div>
        <div className="card">
          <span>Step 2. 얼굴 보고 대화하기 (모두 동의 시)</span>
        </div>
        <div className="arrow">▶</div>
        <div className="card">
          <span>Step 3. 연락처 공유하기</span>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
