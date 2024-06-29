import React, { useState, useEffect } from 'react';
import '../css/Timer.css';
import ReactModal from 'react-modal';
import axios from 'axios';

// 모달의 루트 엘리먼트를 설정
ReactModal.setAppElement('#root');

function Timer({ initialTime }) {
  const [timeLeft, setTimeLeft] = useState(initialTime); // 초기 시간 설정
  const [progress, setProgress] = useState(100); // 진행률 초기 설정
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // timer 서버 연동
    // axios
    //   .get(
    //     'http://ec2-3-107-70-86.ap-southeast-2.compute.amazonaws.com/timer/time_left'
    //   )
    //   .then((res) => {
    //     console.log(res.data, 'Timer 몇 초남?');
    //     setTimeLeft(res.data);
    //   })
    //   .catch((error) => {
    //     console.error('Timer 이상', error);
    //   });

    if (timeLeft <= 0) {
      setIsModalOpen(true); // 타이머가 종료되면 모달을 열기
      return;
    } // 시간이 다 소진되면 타이머 중지

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // 1초마다 시간 감소
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    // 진행률 계산 (0에서 100 사이의 값)
    setProgress((timeLeft / initialTime) * 100);
  }, [timeLeft, initialTime]);

  // 남은 시간을 mm:ss 형식으로 포맷팅
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`;
  };

  // 진행 바의 색깔을 비율에 따라 변경
  const getBarColor = (percentage) => {
    if (percentage > 50) return 'limegreen';
    if (percentage > 20) return 'orange';
    return 'red';
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleTimeLeft = () => {
    axios
      .get('api/timer/time_left/')
      .then((res) => {
        console.log(res.data.timer);
      })
      .catch((error) => {
        console.error('Timer 이상', error);
      });
  };

  return (
    <div className="timer-container">
      <div className="timer-display" style={{ color: getBarColor(progress) }}>
        {formatTime(timeLeft)}
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
      <p>{timeLeft > 0 ? '시간이 줄어들고 있어요!' : '시간이 다 되었어요!'}</p>
      <button onClick={handleTimeLeft}>버튼</button>

      {/* 모달 창 */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Time's Up"
        className="timeupModal"
        overlayClassName="Overlay"
      >
        <h3>서로의 얼굴이 궁금하다면</h3>
        <h3>필터 해제에 동의 해주세요</h3>
        <p>모두 동의 시 5분의 추가 시간이 주어집니다.</p>
        <button>
          <a href="/">여기서 그만하기</a>
        </button>
        <button onClick={closeModal}>동의하고 계속하기</button>
      </ReactModal>
    </div>
  );
}

export default Timer;
