import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useLocation } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import "../css/App.css";
import "../css/MeetingPage.css";
import Timer from "../components/Timer";
import CardBoard from "../components/CardBoard";
import MonstVideo from "../components/MonstVideo";
import Timer2 from "../components/Timer2";
import MonstVideo2 from "../components/MonstVideo2";

function MeetingPage2() {
  let location = useLocation();
  const { isAdmin } = location.state || {};
  // const [isAdmin, setIsOperator] = useState(isOperator);
  const [inCall, setInCall] = useState(false);
  console.log("관리자냐?", isAdmin);

  useEffect(() => {
    console.log("useEffect 실행 와드---", isAdmin);
    setInCall(true);
  }, []);

  return (
    <>
      <NavBar />
      <div className="total-container">
        <div className="meeting-content">
          <MonstVideo2 isOperator={isAdmin} />
          <Timer2 isAdmin={isAdmin} />
        </div>
        <div className="card-content">
          <CardBoard />
        </div>
      </div>
    </>
  );
}

export default MeetingPage2;
