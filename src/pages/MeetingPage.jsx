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

function MeetingPage() {
  let location = useLocation();
  const { isAdmin } = location.state || {};

  return (
    <>
      <NavBar />
      <div className='total-container'>
        <div className='meeting-content'>
          <MonstVideo isOperator={isAdmin} />
          <div>
            <Timer isAdmin={isAdmin} />
          </div>
        </div>
        <div className='card-content'>
          <CardBoard />
        </div>
      </div>
    </>
  );
}

export default MeetingPage;
