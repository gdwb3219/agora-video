import React, { useState, useEffect, useRef } from 'react';
import '../css/Timer.css';
import ReactModal from 'react-modal';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import tokenData from '../token.json';

const round1time = 20;

// 모달의 루트 엘리먼트를 설정
ReactModal.setAppElement('#root');

// 남은 시간을 mm:ss 형식으로 포맷팅
// 렌더링 return에서 사용
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

function Timer({ isAdmin: isOperator }) {
  const [isRunning, setIsRunning] = useState(false); // 진행 중 여부
  const [inputSecond, setInputSecond] = useState(round1time); // 입력 초기값
  // 현재 남은 시간 확인 (서버용)
  const [timeLeft, setTimeLeft] = useState(round1time); // 초기 시간 설정
  // 현재 남은 시간 확인 (리액트용)
  const [progress, setProgress] = useState(100); // 진행률 초기 설정
  const timerRef = useRef(null);
  const pyWsRef = useRef(null);
  const cardWsRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // web socket 전용 state
  // const [ws, setWs] = useState(null);
  const wsRef = useRef(null);
  const [wsMessage, setWsMessage] = useState([]);

  // 서버 시간을 불러와서 state에 반영하는 함수
  const fetchTimeLeft = async () => {
    try {
      const response = await axios.get('/timer/status');
      const timer = response.data.timer;

      setIsRunning(timer.is_running);
      setTimeLeft(timer.is_running ? Math.floor(timer.time_left) : inputSecond);

      if (timer.is_running) {
        startTimer();
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

          setIsModalOpen(true);

          axios.post('/timer/reset');

          setIsRunning(false);

          if (isOperator) {
            console.log('Time Complete');
            // pyWsRef.current.send('Timer Complete');
          }

          return 0;
        }
        setProgress(((prevSeconds - 1) / inputSecond) * 100); // progress를 남은 시간 비율에 따라 업데이트
        return prevSeconds - 1;
      });
    }, 1000);
  };

  // 태섭 ws fastapi
  // useEffect(() => {
  //   tsWsRef.current = new WebSocket(
  //     'ws://ec2-3-107-70-86.ap-southeast-2.compute.amazonaws.com/ws/timer'
  //   );
  //   tsWsRef.current.onopen = () => {
  //     console.log('태섭 ws 연결');
  //   };
  // });

  // python ws/timer
  useEffect(() => {
    pyWsRef.current = new WebSocket(tokenData.websocketurl);
    pyWsRef.current.onopen = () => {
      console.log('파이썬 ws 연결');
    };

    try {
      pyWsRef.current.onmessage = (event) => {
        // console.log('Python WS에서 메시지가 온거 같다?', event.data);
        const data = JSON.parse(event.data);
        console.log('Message from server:', data, data.action);

        if (data.action === 'start') {
          console.log('WS start!');
          setIsRunning(true);
          setTimeLeft(timeLeft);
          startTimer();
        } else if (data.action === 'reset') {
          console.log('WS Reset!');
          setIsRunning(false);
          setTimeLeft(inputSecond);
          clearInterval(timerRef.current);
        } else if (data.action === 'All true') {
          console.log('All True');
        } else {
          console.log('Else');
        }
      };
    } catch (error) {
      console.error(error, 'ERROR');
    }

    return () => {
      pyWsRef.current.close();
      console.log('파이썬 WS 연결이 종료 됨');
    };
  }, []);

  // ------------------------ web Socket 로컬 호스트 테스트 ----------------
  // local 8000 ws 간이 테스트 (서버에서 web socket 관리 기능 필요)
  // useEffect(() => {
  //   console.log('웹소켓으로부터 받은 메시지', wsMessage);
  //   wsRef.current = new WebSocket('ws://localhost:8000/ws/timer_10min');

  //   // 웹소켓 이벤트 핸들러 (메시지 받는 경우)
  //   wsRef.current.onmessage = (event) => {
  //     console.log('Message 받았음 핸들러!!!');
  //     const newMessage = event.data;
  //     setWsMessage(newMessage);
  //     if (event.data === 'start') {
  //       console.log('정상 시작!', event.data, timeLeft);
  //       setIsRunning(true);
  //       setTimeLeft(timeLeft);

  //       // start일 때에만 setInterval 시작

  //       startTimer();
  //     } else if (event.data === 'reset') {
  //       console.log('정상 리셋!', event.data);
  //       setIsRunning(false);

  //       setTimeLeft(inputSecond);
  //       clearInterval(timerRef.current);
  //     } else if (event.data === 'All true') {
  //     } else {
  //       console.log('정상 else!', event.data);
  //     }
  //   };

  //   // WebSocket 연결이 열렸을 때 실행될 이벤트 핸들러 설정
  //   wsRef.current.onopen = () => {
  //     console.log('WebSocket connection opened');
  //   };

  //   wsRef.current.onclose = () => {
  //     console.log('WebSocket Connection Closed');
  //   };

  //   return () => {
  //     wsRef.current.close();
  //   };
  // }, []);

  // ------------------------ web Socket 로컬 호스트 테스트 ----------------

  // useEffect 서버 시간
  // client 상태 바뀔 때마다 변경 요청
  useEffect(() => {
    console.log('서버용 시간 확인');
    fetchTimeLeft();

    // 프론트 타이머 시간 관리

    return () => clearInterval(timerRef.current);
  }, []);

  // 진행 바의 색깔을 비율에 따라 변경
  const getBarColor = (percentage) => {
    if (!isRunning) return 'gray';
    if (percentage > 50) return '#3fff00';
    if (percentage > 20) return 'orange';
    return 'red';
  };

  // 모달 팝업 닫기
  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  // ------------------ 타이버 조작 버튼 (관리자) ------------------
  const handleStart = async () => {
    if (!isRunning) {
      setIsRunning(true);
      pyWsRef.current.send(JSON.stringify({ action: 'start' }));
    }
    // axios로 서버에 시작 요청
    try {
      // aws 서버용 (동일기능)
      const response = await axios.post(`/timer/start?duration=${inputSecond}`);

      // const response = await axios.post(
      //   `http://ec2-3-107-70-86.ap-southeast-2.compute.amazonaws.com/timer/start?duration=${inputSecond}`
      // );

      // local 서버용
      // const response = await axios.post(
      //   `http://localhost:8000/timer/start?duration=${inputSecond}`
      // );
      console.log(response, '서버 시간 start 됐다?');
    } catch (error) {
      console.error('start 에러, 왜 Error가 났는 지 찾아보기');
    }
  };

  const handleReset = async () => {
    setIsRunning(false);
    setTimeLeft(inputSecond);
    pyWsRef.current.send(JSON.stringify({ action: 'reset' }));
    try {
      const response = await axios.post('/timer/reset');
      console.log(response, 'Reset 완료!');

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
    if (isRunning && timeLeft < 180) {
      return '시간이 얼마 남지 않았어요!';
    } else if (isRunning) {
      return ' ';
    } else if (!isRunning && timeLeft > 0) {
      return '시작하기 전이에요!';
    } else {
      return '시간이 끝났어요!';
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

        {isOperator && (
          <>
            <div>Time Left: {timeLeft} seconds</div>
            <button onClick={handleStart} disabled={isRunning}>
              Start
            </button>

            <button onClick={handleReset}>Reset</button>

            <button>
              <Link to="/meeting2" state={{ isAdmin: true }}>
                관리자 meeting2 입장
              </Link>
            </button>
          </>
        )}
      </div>
      {/* //*--------- 여기까지 admin 영역 *---------/ */}

      {/* /* 모달 창 */}

      {!isOperator && isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          pyWsRef={pyWsRef}
        />
      )}
    </div>
  );
}

export default Timer;
