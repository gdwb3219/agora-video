import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/App.css";

function MainPage() {
  console.log(
    "MainPage 실행 와드-----------MainPage 실행 와드-----------MainPage 실행 와드-----------MainPage 실행 와드-----------"
  );
  const [isOperator, setIsOperator] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const joinAsUser = () => {
    setIsOperator(false);
    setInCall(true);
  };

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <h1>Monst AR 랜딩 페이지</h1>
          <button onClick={joinAsUser}>
            <Link to='/meeting' state={{ isAdmin: false }}>
              Join as User
            </Link>
          </button>
        </header>
      </div>
    </>
  );
}

export default MainPage;
