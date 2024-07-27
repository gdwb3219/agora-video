import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import tokenData from "../token.json";
import "../css/Main.css";

function MainPage() {
  console.log(
    "MainPage 실행 와드-----------MainPage 실행 와드-----------MainPage 실행 와드-----------MainPage 실행 와드-----------"
  );
  const [isOperator, setIsOperator] = useState(false);
  const [inputCode, setInputCode] = useState(""); // 사용자 입력 코드 상태
  const [isCodeValid, setIsCodeValid] = useState(true); // 코드 유효성 상태

  const entryCodes = tokenData.entryCodes; // token.json에서 입장 코드를 불러옴
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleCodeChange = (e) => {
    setInputCode(e.target.value);
  };

  const joinAsUser = () => {
    if (entryCodes.includes(inputCode)) {
      setIsOperator(false);
      setIsCodeValid(true);
      navigate("/meeting", { state: { isAdmin: false } }); // 페이지 이동
    } else {
      setIsCodeValid(false);
    }
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Monst AR</h1>
          <input
            type="text"
            placeholder="Enter code"
            value={inputCode}
            onChange={handleCodeChange}
            className={isCodeValid ? "" : "invalid-code"}
          />
          {!isCodeValid && (
            <p className="error-message">Invalid code, please try again.</p>
          )}
          <button onClick={joinAsUser} className="join-button">
            Join
          </button>
        </header>
      </div>
    </>
  );
}

export default MainPage;
