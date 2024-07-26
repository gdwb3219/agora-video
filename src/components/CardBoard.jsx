import React, { useEffect, useRef, useState } from "react";
import "../css/CardBoard.css";
import axios from "axios";

const ALL_CARDS = [
  "살면서 가장 감사하게 생각하는 3가지는 무엇인가요?",
  "오늘 하루 중 가장 즐거웠던 순간은 언제였나요?",
  "당신이 가장 좋아하는 취미는 무엇인가요?",
  "가장 좋아하는 여행지는 어디인가요?",
  "가장 기억에 남는 책은 무엇인가요?",
  "어렸을 때 꿈꾸던 직업은 무엇이었나요?",
  "가장 최근에 본 영화는 무엇인가요?",
  "가장 감명 깊게 본 영화는 무엇인가요?",
  "가장 좋아하는 음식은 무엇인가요?",
  "당신이 가장 존경하는 사람은 누구인가요?",
  "당신이 이루고 싶은 목표는 무엇인가요?",
  "어렸을 때 가장 좋아했던 게임은 무엇인가요?",
  "당신이 즐겨 하는 운동은 무엇인가요?",
  "당신의 인생에 가장 큰 영향을 준 사람은 누구인가요?",
  "가장 인상 깊었던 경험은 무엇인가요?",
  "당신이 가장 좋아하는 계절은 무엇인가요?",
  "당신이 가장 좋아하는 명언은 무엇인가요?",
  "가장 최근에 배운 것은 무엇인가요?",
  "당신이 가장 좋아하는 색깔은 무엇인가요?",
  "가장 좋아하는 음악 장르는 무엇인가요?",
  "당신이 가고 싶은 여행지는 어디인가요?",
  "당신이 가장 자주 가는 레스토랑은 어디인가요?",
  "가장 좋아하는 영화 배우는 누구인가요?",
  "당신이 가장 좋아하는 동물은 무엇인가요?",
  "가장 좋아하는 휴일은 무엇인가요?",
  "당신이 가장 좋아하는 장소는 어디인가요?",
  "가장 좋아하는 꽃은 무엇인가요?",
  "가장 좋아하는 날씨는 어떤가요?",
  "가장 좋아하는 아이스크림 맛은 무엇인가요?",
  "당신이 가장 좋아하는 게임은 무엇인가요?",
  "당신이 가장 기억에 남는 생일은 언제였나요?",
  "가장 좋아하는 스포츠 팀은 어디인가요?",
  "가장 좋아하는 TV 쇼는 무엇인가요?",
  "당신이 가장 소중히 여기는 것은 무엇인가요?",
  "가장 좋아하는 만화책은 무엇인가요?",
  "당신이 좋아하는 커피 종류는 무엇인가요?",
];

function CardBoard() {
  const [selectedCards, setSelectedCards] = useState(getRandomCards());
  const [revealedCards, setRevealedCards] = useState([false, false, false]);
  const [showIntroCard, setShowIntroCard] = useState(true);

  const cardWsRef = useRef(null);

  useEffect(() => {
    cardWsRef.current = new WebSocket("ws://127.0.0.1:8000/ws/random-items");
    cardWsRef.current.onopen = () => {
      console.log("CARD 랜덤 소켓!");
    };

    try {
      cardWsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data, "card WS 첫 데이터");
      };
    } catch (error) {
      console.error(error, "ERROR");
    }

    return () => {
      cardWsRef.current.close();
      console.log("cardWsRef 연결이 종료 됨");
    };
  }, []);

  function getRandomCards() {
    const shuffled = ALL_CARDS.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  const updateCards = () => {
    setSelectedCards(getRandomCards());
    setRevealedCards([false, false, false]);
  };

  const revealCard = (index) => {
    setRevealedCards((prevRevealed) => {
      const newRevealed = [...prevRevealed];
      newRevealed[index] = true;
      return newRevealed;
    });
  };

  // 처음 자기소개 카드
  const handleIntroCardClick = () => {
    setShowIntroCard(false);
  };

  const handleCard = async () => {
    // pyWsRef.current.send(JSON.stringify({ action: 'start' }));

    try {
      const response = await axios.get("http://127.0.0.1:8000/random-items");
      const card = response.data;
      console.log(card);
      cardWsRef.current.send(JSON.stringify("무언가"));
    } catch (error) {
      console.error("Error fetching the time left:", error);
    }
  };

  return (
    <div className='card-board'>
      <ul className='card-list'>
        {showIntroCard && (
          <div className='intro-card' onClick={handleIntroCardClick}>
            간단한 자기소개 부탁해요!
          </div>
        )}
        {selectedCards.map((card, index) => (
          <li
            key={index}
            // className="card-item"
            className={`card-item ${
              revealedCards[index] ? "revealed" : "hidden"
            }`}
            onClick={() => revealCard(index)}
          >
            {card}
            {/* {revealedCards[index] ? card : '클릭하여 확인'} */}
          </li>
        ))}
      </ul>
      <button className='update-button' onClick={updateCards}>
        + 토픽 카드 새로 고침
      </button>
      <button onClick={handleCard}>random Card</button>
    </div>
  );
}

export default CardBoard;
