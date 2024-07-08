import React, { useState, useEffect, useRef } from "react";
import "../css/Timer.css";
import ReactModal from "react-modal";
import axios from "axios";

// 모달의 루트 엘리먼트를 설정
ReactModal.setAppElement("#root");

// 남은 시간을 mm:ss 형식으로 포맷팅
// 렌더링 return에서 사용
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

function Timer({ isAdmin: isOperator }) {
  const [isRunning, setIsRunning] = useState(false); // 진행 중 여부
  const [inputSecond, setInputSecond] = useState(600); // 입력 초기값
  // 현재 남은 시간 확인 (서버용)
  const [timeLeft, setTimeLeft] = useState(600); // 초기 시간 설정
  // 현재 남은 시간 확인 (리액트용)
  const [seconds, setSeconds] = useState(600);
  const [progress, setProgress] = useState(100); // 진행률 초기 설정
  const timerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // web socket 전용 state
  // const [ws, setWs] = useState(null);
  const wsRef = useRef(null);
  const [wsMessage, setWsMessage] = useState([]);

  console.log("Timer 컴포넌트 실행@@@@", timeLeft);

  // 서버 시간을 불러와서 state에 반영하는 함수
  const fetchTimeLeft = async () => {
    try {
      console.log("서버 시간 불러온ㄷ!!!");
      const response = await axios.get("/timer/status");
      const timer = response.data.timer;
      console.log(timer.is_running, timer.time_left, "response Data");
      setIsRunning(timer.is_running);
      setTimeLeft(timer.is_running ? Math.floor(timer.time_left) : 600);

      // if (timer.is_running === false) {
      //   console.log("시작 안한 상태@@@");
      //   setTimeLeft(seconds);
      //   setIsRunning(false);
      // } else {
      //   console.log("시작 한 상태@@@");
      //   setTimeLeft(timer.time_left);
      //   setIsRunning(true);
      // }
    } catch (error) {
      console.error("Error fetching the time left:", error);
    }
  };

  // ------------------------ web Socket 로컬 호스트 테스트 ----------------
  // local 8000 ws 간이 테스트 (서버에서 web socket 관리 기능 필요)
  useEffect(() => {
    console.log("wsMessage", wsMessage);
    wsRef.current = new WebSocket("ws://localhost:8000/ws/timer_10min");

    // 웹소켓 이벤트 핸들러 (메시지 받는 경우)
    wsRef.current.onmessage = (event) => {
      console.log("Message 받았음 핸들러!!!");
      const newMessage = event.data;
      setWsMessage((prevMessages) => [...prevMessages, newMessage]);
      if (event.data === "start") {
        console.log("정상 시작!", event.data);
        setIsRunning(true);

        // start일 때에만 setInterval 시작

        timerRef.current = setInterval(() => {
          setTimeLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);
      } else if (event.data === "reset") {
        console.log("정상 리셋!", event.data);
        setIsRunning(false);
        setTimeLeft(inputSecond);

        clearInterval(timerRef.current);
      } else {
        console.log("정상 else!", event.data);
      }
    };

    // WebSocket 연결이 열렸을 때 실행될 이벤트 핸들러 설정
    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket Connection Closed");
    };

    return () => {
      wsRef.current.close();
    };
  }, [wsMessage]);

  // ------------------------ web Socket 로컬 호스트 테스트 ----------------

  // useEffect 서버 시간
  // client 상태 바뀔 때마다 변경 요청
  useEffect(() => {
    console.log("서버용 시간 확인");
    fetchTimeLeft();
    console.log("@@@@@", timeLeft, isRunning);

    // 프론트 타이머 시간 관리

    if (timeLeft === 0) {
      setIsModalOpen(true);
    }

    return () => clearInterval(timerRef.current);
    // 처음 실행 시, 러닝 중이면(타이머 동작 중에 새로고침) 실행
    // if (isRunning === true) {
    //   console.log("새로고침 안했고, run상태 True로 바뀜");

    //   fetchTimeLeft();
    // } else {
    //   // 초기 실행 시, isRunning false인 경우, 서버에 요청해서 실행 중인지
    //   // 확인 여부에 따라 isRUnning 변경
    //   const fetchIsRunning = async () => {
    //     try {
    //       // 일단 서버에 요청할껀데, 서버가 false 면 냅두고,
    //       // 서버가 러닝 중이면 state를 true로 변경
    //       const response = await axios.get("/timer/time_left");
    //       if (response.data.timer === "Not started") {
    //         // client False, 서버 False
    //         console.log("새로고침/Reset했고, 시작 안한 상태");
    //       } else {
    //         // client False, 서버가 True 상태인 경우
    //         console.log("새로고침 했고, 시작한 상태");
    //         setIsRunning(true);
    //         fetchTimeLeft();
    //       }
    //     } catch (error) {
    //       console.error("fetchIsRunning에서 에러");
    //     }
    //   };
    //   fetchIsRunning();
    // }
  }, []);

  // -----------------------------------------------------
  // timeLeft 변경 시 실행되는 useEffect 타이머 현재 남은 시간
  // useEffect(() => {
  //   console.log("!@#", timeLeft, seconds);
  //   if (timeLeft == false || timeLeft == null) {
  //     console.log("timeLeft가 없는 듯?", timeLeft);
  //   } else if (timeLeft <= 0) {
  //     console.log("timeLeft가 0이어서 모달을 연다", timeLeft);
  //     setIsModalOpen(true); // 타이머가 종료되면 모달을 열기
  //     return;
  //     // 시간이 다 소진되면 타이머 중지
  //   } else {
  //     console.log("??ㅋㅋ실행 중");
  //     const intervalId = setInterval(() => {
  //       setSeconds((prevTime) => {
  //         if (prevTime <= 1) {
  //           clearInterval(intervalId);
  //           setIsRunning(false);
  //           return 0;
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);
  //   }
  // }, [timeLeft]);

  // 진행 바의 색깔을 비율에 따라 변경
  const getBarColor = (percentage) => {
    if (!isRunning) return "gray";
    if (percentage > 50) return "limegreen";
    if (percentage > 20) return "orange";
    return "red";
  };

  // 모달 팝업 닫기
  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  // ------------------ 타이버 조작 버튼 (관리자) ------------------
  const handleStart = async () => {
    if (!isRunning) {
      setIsRunning(true);
      console.log("Running 상태로 변경 : True");
    }
    // axios로 서버에 시작 요청
    try {
      const response = await axios.post(`/timer/start?duration=${inputSecond}`);
      console.log(response, "서버 시간 start 됐다?");
      wsRef.current.send("start");
    } catch (error) {
      console.error("왜 Error가 났는 지 찾아보기");
    }

    // axios
    //   .post(`/timer/start?duration=${seconds}`)
    //   .then((res) => {
    //     console.log("Response가 왔네", res.data);
    //   })
    //   .catch((error) => {
    //     console.error("POST Error", error);
    //   });

    // axios
    //   .post('start', seconds, {
    //     params: {
    //       duration: seconds,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res, 'params로 seconds를 보내고 난 뒤의 res');
    //   })
    //   .catch((error) => {
    //     console.error(error, 'params쪽 에러');
    //   });
  };
  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = async () => {
    setIsRunning(false);
    // setTimeLeft(inputSecond);

    try {
      const response = await axios.post("/timer/reset");
      console.log(response, "Reset 완료!");
      wsRef.current.send("reset");
      clearInterval(timerRef.current);
    } catch (error) {
      console.error("Error 났음, Reset에서");
    }
  };

  const handleInputChange = (e) => {
    const newInputSecond = Number(e.target.value);
    console.log(newInputSecond, "초기 시간");
    setInputSecond(newInputSecond);
    // setTimeLeft(newTime);
  };

  // 타이머 메시지 함수
  const renderMessage = () => {
    if (isRunning && timeLeft > 0) {
      return "시간이 가고 있어요!";
    } else if (!isRunning && timeLeft > 0) {
      return "시작하기 전이에요!";
    } else {
      return "시간이 끝났어요!";
    }
  };

  const handleMessage = () => {
    if (wsRef.current) {
      wsRef.current.send("후후후 express 서버 연결 성공");
      console.log("메시지 보냈음!!!");
    } else {
      console.log("WS가 연결이 안되어서 못보냄");
    }
  };

  return (
    <div className='timer-container'>
      <div className='timer-display' style={{ color: getBarColor(progress) }}>
        {isRunning ? formatTime(timeLeft) : "시작 전"}
      </div>
      <div className='progress-bar'>
        <div
          className='progress-bar-fill'
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
            type='number'
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
            <button onClick={handleStop} disabled={!isRunning}>
              Stop
            </button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleMessage}>Websocket으로 메시지 보내기</button>
          </>
        )}
      </div>
      {/* //*--------- 여기까지 admin 영역 *---------/ */}

      {/* /* 모달 창 */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Time's Up"
        className='timeupModal'
        overlayClassName='Overlay'
      >
        <h3>서로의 얼굴이 궁금하다면</h3>
        <h3>필터 해제에 동의 해주세요</h3>
        <p>모두 동의 시 5분의 추가 시간이 주어집니다.</p>
        <button>
          <a href='/'>여기서 그만하기</a>
        </button>
        <button onClick={closeModal}>동의하고 계속하기</button>
      </ReactModal>
    </div>
  );
}

export default Timer;
