import React from 'react';
import { useGameState } from '../context/GameStateContext';
import PlayerStats from './PlayerStats';
import storyData from '../data/story.json';
import EndScreen from './EndScreen';

const GameScreen = () => {
  const { gameState, handleChoice } = useGameState();
  const currentNode = storyData[gameState.currentNodeKey];

  if (!currentNode) {
    return <div>Error: Story node not found!</div>;
  }

  if (currentNode.isEnding) {
    return <EndScreen />;
  }

  const availableChoices = currentNode.choices.filter(choice => {
    if (choice.requires && !gameState.inventory.includes(choice.requires)) {
      return false;
    }
    if (choice.hideIf && gameState.inventory.includes(choice.hideIf)) {
        return false;
    }
    return true;
  });

  return (
    <div className="game-screen">
      <PlayerStats />
      <div className="story-text">
        <p>{currentNode.text}</p>
      </div>
      <div className="choices">
        {availableChoices.map((choice, index) => (
          <button key={index} onClick={() => handleChoice(choice)}>
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;