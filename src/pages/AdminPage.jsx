import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import '../css/App.css';
import AGRtest from '../components/AGRtest';
import MonstVideo from '../components/MonstVideo';
import MeetingPage from './MeetingPage';

function AdminPage() {
  console.log('Admin Page 실행');
  const [isOperator, setIsOperator] = useState(false);
  // 비디오 시작 여부
  const [inCall, setInCall] = useState(false);

  const joinAsUser = () => {
    setIsOperator(false);
    setInCall(true);
  };

  const joinAsOperator = () => {
    setIsOperator(true);
    setInCall(true);
  };
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Monst AR 관리자 페이지</h1>
          {/* False 시에 관리자 시작 버튼 */}
          {!inCall ? (
            <div className="join-buttons">
              <button onClick={joinAsOperator}>
                <Link to="/meeting" state={{ isAdmin: true }}>
                  Join as Operator
                </Link>
              </button>
            </div>
          ) : (
            // 버튼 누르면, isOper True로 meeting 시작
            // <VideoCall isOperator={isOperator} />
            <MeetingPage idOperator={isOperator} />
          )}
          <div>관리자 모듈</div>
        </header>
      </div>
    </>
  );
}

export default AdminPage;
