import React from 'react';
import { useGameState } from '../context/GameStateContext';


const itemEmojis = {
  Asin: '🧂',
  Bawang: '🧄',
  Agimat: '📿',
};


const PlayerStats = () => {
  const { gameState } = useGameState();
  const hpPercentage = (gameState.hp / 100) * 100;

  const getHpBarColor = () => {
    if (hpPercentage > 60) {
      return '#6bcf6b';
    }
    if (hpPercentage > 30) {
      return '#e0ac4c'; 
    }
    return '#B80F0A';
  };

  return (
    <div className="player-stats">
      <div className="stat">
        <strong>Hunter:</strong> {gameState.playerName}
      </div>

      <div className="stat-hp">
        <div className="hp-bar-container">
          <div
            className="hp-bar-fill"
            style={{
              width: `${hpPercentage}%`,
              backgroundColor: getHpBarColor(),
            }}
          ></div>
          <div className="hp-bar-text">
            HP: {gameState.hp} / 100
          </div>
        </div>
      </div>

      <div className="stat">
        <strong>Inventory:</strong>{' '}
        {gameState.inventory.length > 0
          ? gameState.inventory
              .map((item) => {

                const emoji = itemEmojis[item] || ''; 

                return `${emoji} ${item}`.trim();
              })
              .join(', ')
          : 'None'}
      </div>
    </div>
  );
};

export default PlayerStats;