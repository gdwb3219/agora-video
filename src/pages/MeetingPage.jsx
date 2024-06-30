import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useLocation } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import '../css/App.css';
import '../css/MeetingPage.css';
import Timer from '../components/Timer';
import CardBoard from '../components/CardBoard';
import MonstVideo from '../components/MonstVideo';

function MeetingPage({ isOperator }) {
  let location = useLocation();
  const { isAdmin } = location.state || {};
  // const [isAdmin, setIsOperator] = useState(isOperator);
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
          <MonstVideo isOperator={isOperator} />
          <Timer />
        </div>
        <div className="card-content">
          <CardBoard />
        </div>
      </div>
    </>
  );
}

export default MeetingPage;
