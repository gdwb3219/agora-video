import React, { useEffect, useRef, useState } from "react";
import "../css/CardBoard.css";
// import axios from "axios";

const initialList = ["1번 초기값", "2번 초기값", "3번 초기값"];

function CardBoard() {
  const [selectedCards, setSelectedCards] = useState(initialList);
  const [revealedCards, setRevealedCards] = useState([false, false, false]);
  const [showIntroCard, setShowIntroCard] = useState(true);

  const cardWsRef = useRef(null);

  // 랜덤 카드 웹소켓 연결
  useEffect(() => {
    // ************************************************************
    // 실제 서버 연결 시
    // cardWsRef.current = new WebSocket(
    //   "wss://www.api.monst-ar.com/ws/random-items"
    // );
    // ************************************************************

    // ************************************************************
    // 테스트 로컬 서버 연결 시
    cardWsRef.current = new WebSocket("ws://127.0.0.1:8000/ws/random-items");
    // ************************************************************
    cardWsRef.current.onopen = () => {
      console.log("CARD 랜덤 소켓!");
    };

    try {
      cardWsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data", data);
        if ("selected_items" in data) {
          console.log("구분 데이터", data);
          const cardList = data.selected_items;
          console.log(data.selected_items, "card WS 첫 데이터");
          setSelectedCards(cardList);
          setRevealedCards([false, false, false]);
        } else {
          console.log("인덱스 데이터", data.index_received);
          setRevealedCards((prevRevealed) => {
            const newRevealed = [...prevRevealed];
            newRevealed[data.index_received] = true;
            return newRevealed;
          });
        }
      };
    } catch (error) {
      console.error(error, "ERROR");
    }

    return () => {
      cardWsRef.current.close();
      console.log("cardWsRef 연결이 종료 됨");
    };
  }, []);

  // function getRandomCards() {
  //   const shuffled = ALL_CARDS.sort(() => 0.5 - Math.random());
  //   console.log();
  //   return shuffled.slice(0, 3);
  // }

  const updateCards = () => {
    cardWsRef.current.send("shuffle");
    // setSelectedCards(getRandomCards());
    setRevealedCards([false, false, false]);
  };

  const revealCard = (index) => {
    cardWsRef.current.send(index);
  };

  // 처음 자기소개 카드
  const handleIntroCardClick = () => {
    setShowIntroCard(false);
    cardWsRef.current.send("shuffle");
  };

  return (
    <div className='card-board'>
      <ul className='card-list'>
        {showIntroCard && (
          <div className='intro-card' onClick={handleIntroCardClick}>
            간단한 자기소개 후 아래 버튼을 클릭하여 토픽 카드를 확인해보세요!
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
    </div>
  );
}

export default CardBoard;
