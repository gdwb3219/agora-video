import React, { useState, useEffect, useRef } from 'react';
import '../css/Timer.css';
import ReactModal from 'react-modal';
import axios from 'axios';

const round2time = 30;

// 모달의 루트 엘리먼트를 설정
ReactModal.setAppElement('#root');

// 남은 시간을 mm:ss 형식으로 포맷팅
// 렌더링 return에서 사용
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

function Timer2({ isAdmin: isOperator }) {
  const [isRunning, setIsRunning] = useState(false); // 진행 중 여부
  const [inputSecond, setInputSecond] = useState(round2time); // 입력 초기값
  // 현재 남은 시간 확인 (서버용)
  const [timeLeft, setTimeLeft] = useState(round2time); // 초기 시간 설정
  // 현재 남은 시간 확인 (리액트용)
  const [progress, setProgress] = useState(100); // 진행률 초기 설정
  const timerRef = useRef(null);

  // web socket 전용 state
  // const [ws, setWs] = useState(null);
  const wsRef = useRef(null);
  const [wsMessage, setWsMessage] = useState([]);

  // 서버 시간을 불러와서 state에 반영하는 함수
  const fetchTimeLeft = async () => {
    try {
      console.log('서버 시간 불러온ㄷ!!!');
      const response = await axios.get('/timer/status');
      const timer = response.data.timer;
      console.log(timer.is_running, timer.time_left, 'response Data');
      setIsRunning(timer.is_running);
      setTimeLeft(timer.is_running ? Math.floor(timer.time_left) : inputSecond);
      console.log('---타이머 왜 안돼', isRunning, Math.floor(timer.time_left));
      if (timer.is_running) {
        console.log('타이머 실행 시작');
        startTimer(Math.floor(timer.time_left));
      }
    } catch (error) {
      console.error('Error fetching the time left:', error);
    }
  };

  // 이전 타이머를 받아와서 1초씩 카운트다운 하는 함수
  const startTimer = async () => {
    clearInterval(timerRef.current); // 이전 타이머가 있으면 정리
    timerRef.current = setInterval(() => {
      setTimeLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timerRef.current);
          axios.post('/timer/reset');
          setIsRunning(false);
          if (!isOperator) {
            window.location.href = 'https://forms.gle/gYvNCvFbtBFQYgeA9';
          }
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  // ------------------------ web Socket 로컬 호스트 테스트 ----------------
  // local 8000 ws 간이 테스트 (서버에서 web socket 관리 기능 필요)
  useEffect(() => {
    console.log('wsMessage', wsMessage);
    wsRef.current = new WebSocket('ws://localhost:8000/ws/timer_10min');

    // 웹소켓 이벤트 핸들러 (메시지 받는 경우)
    wsRef.current.onmessage = (event) => {
      console.log('Message 받았음 핸들러!!!');
      const newMessage = event.data;
      setWsMessage((prevMessages) => [...prevMessages, newMessage]);
      if (event.data === 'start') {
        console.log('정상 시작!', event.data);
        setIsRunning(true);

        // start일 때에만 setInterval 시작

        startTimer(timeLeft);
      } else if (event.data === 'reset') {
        console.log('정상 리셋!', event.data);
        setIsRunning(false);
        setTimeLeft(inputSecond);

        clearInterval(timerRef.current);
      } else {
        console.log('정상 else!', event.data);
      }
    };

    // WebSocket 연결이 열렸을 때 실행될 이벤트 핸들러 설정
    wsRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket Connection Closed');
    };

    return () => {
      wsRef.current.close();
    };
  }, []);

  // ------------------------ web Socket 로컬 호스트 테스트 ----------------

  // useEffect 서버 시간
  // client 상태 바뀔 때마다 변경 요청
  useEffect(() => {
    console.log('서버용 시간 확인');
    fetchTimeLeft();
    console.log('@@@@@', timeLeft, isRunning);

    // 프론트 타이머 시간 관리

    return () => clearInterval(timerRef.current);
  }, []);

  // 진행 바의 색깔을 비율에 따라 변경
  const getBarColor = (percentage) => {
    if (!isRunning) return 'gray';
    if (percentage > 50) return 'limegreen';
    if (percentage > 20) return 'orange';
    return 'red';
  };

  // ------------------ 타이버 조작 버튼 (관리자) ------------------
  const handleStart = async () => {
    if (!isRunning) {
      setIsRunning(true);
      console.log('Running 상태로 변경 : True');
    }
    // axios로 서버에 시작 요청
    try {
      const response = await axios.post(`/timer/start?duration=${inputSecond}`);
      console.log(response, '서버 시간 start 됐다?');
      wsRef.current.send('start');
    } catch (error) {
      console.error('왜 Error가 났는 지 찾아보기');
    }
  };

  const handleReset = async () => {
    setIsRunning(false);
    setTimeLeft(inputSecond);

    try {
      const response = await axios.post('/timer/reset');
      console.log(response, 'Reset 완료!');
      wsRef.current.send('reset');
      clearInterval(timerRef.current);
    } catch (error) {
      console.error('Error 났음, Reset에서');
    }
  };

  const handleInputChange = (e) => {
    const newInputSecond = Number(e.target.value);
    console.log(newInputSecond, '초기 시간');
    setInputSecond(newInputSecond);
    // setTimeLeft(newTime);
  };

  // 타이머 메시지 함수
  const renderMessage = () => {
    if (isRunning && timeLeft > 0) {
      return '시간이 가고 있어요!';
    } else if (!isRunning && timeLeft > 0) {
      return '시작하기 전이에요!';
    } else {
      return '시간이 끝났어요!';
    }
  };

  const handleMessage = () => {
    if (wsRef.current) {
      wsRef.current.send('후후후 express 서버 연결 성공');
      console.log('메시지 보냈음!!!');
    } else {
      console.log('WS가 연결이 안되어서 못보냄');
    }
  };

  return (
    <div className="timer-container">
      <div className="timer-display" style={{ color: getBarColor(progress) }}>
        {isRunning ? formatTime(timeLeft) : '시작 전'}
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress}%`,
            backgroundColor: getBarColor(progress),
          }}
        ></div>
      </div>
      <p>{renderMessage()}</p>

      {/* //*--------- 여기부터 admin 영역 *---------/ */}
      <div>
        {isOperator && (
          <input
            type="number"
            value={inputSecond}
            onChange={handleInputChange}
            disabled={isRunning}
          />
        )}
        <div>Time Left: {timeLeft} seconds</div>
        {isOperator && (
          <>
            <button onClick={handleStart} disabled={isRunning}>
              Start
            </button>

            <button onClick={handleReset}>Reset</button>
          </>
        )}
      </div>
      {/* //*--------- 여기까지 admin 영역 *---------/ */}
    </div>
  );
}

export default Timer2;
