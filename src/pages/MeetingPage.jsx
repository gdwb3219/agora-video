import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useLocation } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import '../css/App.css';
import '../css/MeetingPage.css';
import Timer from '../components/Timer';
import CardBoard from '../components/CardBoard';

function MeetingPage() {
  let location = useLocation();
  const { isAdmin } = location.state || {};
  const [isOperator, setIsOperator] = useState(isAdmin);
  const [inCall, setInCall] = useState(false);
  console.log('관리자냐?', isOperator);

  useEffect(() => {
    console.log('useEffect 실행 와드---', isOperator);
    setInCall(true);
  }, []);
  return (
    <>
      <NavBar />
      <div className="total-container">
        <div className="meeting-content">
          <VideoCall isOperator={isOperator} />
          <Timer initialTime={10} />
        </div>
        <div className="card-content">
          <CardBoard />
        </div>
      </div>
    </>
  );
}

export default MeetingPage;
