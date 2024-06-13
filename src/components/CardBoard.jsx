import React, { useState } from 'react';
import '../css/CardBoard.css';

const ALL_CARDS = [
  '살면서 가장 감사하게 생각하는 3가지는 무엇인가요?',
  '오늘 하루 중 가장 즐거웠던 순간은 언제였나요?',
  '당신이 가장 좋아하는 취미는 무엇인가요?',
  '가장 좋아하는 여행지는 어디인가요?',
  '가장 기억에 남는 책은 무엇인가요?',
  '어렸을 때 꿈꾸던 직업은 무엇이었나요?',
  '가장 최근에 본 영화는 무엇인가요?',
  '가장 감명 깊게 본 영화는 무엇인가요?',
  '가장 좋아하는 음식은 무엇인가요?',
  '당신이 가장 존경하는 사람은 누구인가요?',
  '당신이 이루고 싶은 목표는 무엇인가요?',
  '어렸을 때 가장 좋아했던 게임은 무엇인가요?',
  '당신이 즐겨 하는 운동은 무엇인가요?',
  '당신의 인생에 가장 큰 영향을 준 사람은 누구인가요?',
  '가장 인상 깊었던 경험은 무엇인가요?',
  '당신이 가장 좋아하는 계절은 무엇인가요?',
  '당신이 가장 좋아하는 명언은 무엇인가요?',
  '가장 최근에 배운 것은 무엇인가요?',
  '당신이 가장 좋아하는 색깔은 무엇인가요?',
  '가장 좋아하는 음악 장르는 무엇인가요?',
  '당신이 가고 싶은 여행지는 어디인가요?',
  '당신이 가장 자주 가는 레스토랑은 어디인가요?',
  '가장 좋아하는 영화 배우는 누구인가요?',
  '당신이 가장 좋아하는 동물은 무엇인가요?',
  '가장 좋아하는 휴일은 무엇인가요?',
  '당신이 가장 좋아하는 장소는 어디인가요?',
  '가장 좋아하는 꽃은 무엇인가요?',
  '가장 좋아하는 날씨는 어떤가요?',
  '가장 좋아하는 아이스크림 맛은 무엇인가요?',
  '당신이 가장 좋아하는 게임은 무엇인가요?',
  '당신이 가장 기억에 남는 생일은 언제였나요?',
  '가장 좋아하는 스포츠 팀은 어디인가요?',
  '가장 좋아하는 TV 쇼는 무엇인가요?',
  '당신이 가장 소중히 여기는 것은 무엇인가요?',
  '가장 좋아하는 만화책은 무엇인가요?',
  '당신이 좋아하는 커피 종류는 무엇인가요?',
];

function CardBoard() {
  const [selectedCards, setSelectedCards] = useState(getRandomCards());
  const [revealedCards, setRevealedCards] = useState([false, false, false]);

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

  return (
    <div className="card-board">
      <ul className="card-list">
        {selectedCards.map((card, index) => (
          <li
            key={index}
            className="card-item"
            onClick={() => revealCard(index)}
          >
            {revealedCards[index] ? card : '클릭하여 확인'}
          </li>
        ))}
      </ul>
      <button className="update-button" onClick={updateCards}>
        + 토픽 카드 새로 고침
      </button>
    </div>
  );
}

export default CardBoard;
