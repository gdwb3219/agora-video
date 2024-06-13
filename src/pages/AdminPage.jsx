import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import '../css/App.css';

function AdminPage() {
  const [isOperator, setIsOperator] = useState(false);
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
          {!inCall ? (
            <div className="join-buttons">
              {/* <button onClick={joinAsUser}>
                <Link to="meeting" state={{ isAdmin: 'False' }}>
                  Join as User
                </Link>
              </button> */}
              <button onClick={joinAsOperator}>
                <Link to="/meeting" state={{ isAdmin: true }}>
                  Join as Operator
                </Link>
              </button>
            </div>
          ) : (
            <VideoCall isOperator={isOperator} />
          )}
        </header>
      </div>
    </>
  );
}

export default AdminPage;
