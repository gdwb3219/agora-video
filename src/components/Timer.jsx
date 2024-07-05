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
  const [seconds, setSeconds] = useState(600);
  const [inputSecond, setInputSecond] = useState(600); // 입력 초기값
  // 현재 남은 시간 확인
  const [timeLeft, setTimeLeft] = useState("시작 전"); // 초기 시간 설정
  const [progress, setProgress] = useState(100); // 진행률 초기 설정
  const initTimeRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // timeLeft 변경 시 실행되는 useEffect 타이머 현재 남은 시간
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsModalOpen(true); // 타이머가 종료되면 모달을 열기
      return;
      // 시간이 다 소진되면 타이머 중지
    }
    setProgress((timeLeft / inputSecond) * 100);
    const fetchTimeLeft = async () => {
      try {
        const response = await axios.get("/timer/time_left");
        if (response.data.timer === "Not started") {
          setTimeLeft(inputSecond);
        } else {
          setTimeLeft(Math.floor(response.data.timer));
          console.log(Math.floor(response.data.timer), "서버 시간");
        }
      } catch (error) {
        console.error("Error fetching the time left:", error);
      }
    };

    console.log("Timer 시간이 몇시인가?");
    const intervalId = setInterval(fetchTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // 서버에 시간을 요청하고, 바뀔 때마다 렌더링 한다
  // 그러니까 타이머가 실행 중일 때에만 관리
  // useEffect(() => {
  //   // if (isRunning === true) {
  //   //   const interval = setInterval(() => {
  //   //     setTimeLeft((prevTime) => prevTime - 1); // 1초마다 시간 감소
  //   //   }, 1000);
  //   // }
  //   // Clean up interval on component unmount
  //   // return () => clearInterval(interval);
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

  // 서버 시간 가져오기 함수
  // const handleTimeLeft = () => {
  //   console.log("함수 실행 완료!");
  //   axios
  //     .get("time_left")
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((error) => {
  //       console.error("Timer 이상해", error);
  //     });
  // };

  // ------------------ 타이버 조작 버튼 (관리자) ------------------
  const handleStart = async () => {
    if (!isRunning) {
      setIsRunning(true);
      // intervalRef.current = setInterval(() => {
      //   setTimeLeft((prevTime) => {
      //     if (prevTime <= 1) {
      //       clearInterval(intervalRef.current);
      //       setIsRunning(false);
      //       return 0;
      //     }
      //     return prevTime - 1;
      //   });
      // }, 1000);
    }
    // axios로 서버에 시작 요청
    try {
      const response = await axios.post(`/timer/start?duration=${seconds}`);
      console.log(response, "start 됐나?");
    } catch (error) {
      console.error("왜 Error가 났는 지 찾아보기");
    }

    axios
      .post(`/timer/start?duration=${seconds}`)
      .then((res) => {
        console.log("Response가 왔네", res.data);
      })
      .catch((error) => {
        console.error("POST Error", error);
      });

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
    // clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleReset = async () => {
    // clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(seconds);

    try {
      const response = await axios.post("/timer/reset");
      console.log(response, "Reset 완료!");
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
