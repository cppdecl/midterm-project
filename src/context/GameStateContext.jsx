import React, { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import storyData from '../data/story.json';

const GameStateContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGameState = () => useContext(GameStateContext);

const initialState = {
  playerName: '',
  hp: 100,
  inventory: [],
  currentNodeKey: 'start',
  gameStarted: false,
};

const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useLocalStorage('aswangHunterState', initialState);

  const startGame = (name) => {
    setGameState({
      ...initialState,
      playerName: name,
      gameStarted: true,
    });
  };

  const resetGame = () => {
    setGameState(initialState);
  };

  const handleChoice = useCallback((choice) => {
    const currentNode = storyData[gameState.currentNodeKey];
    if (currentNode.isEnding) return;

    let newHp = gameState.hp;
    let newInventory = [...gameState.inventory];

    if (currentNode.onArrive) {
      if (currentNode.onArrive.addItem && !gameState.inventory.includes(currentNode.onArrive.addItem)) {
        newInventory.push(currentNode.onArrive.addItem);
      }
      if (currentNode.onArrive.takeDamage) {
        newHp -= currentNode.onArrive.takeDamage;
      }
    }

    const nextNodeKey = choice.to;
    const nextNode = storyData[nextNodeKey];

    if (nextNode.onArrive) {
        if (nextNode.onArrive.addItem) {
            newInventory.push(nextNode.onArrive.addItem);
        }
        if (nextNode.onArrive.takeDamage) {
            newHp -= nextNode.onArrive.takeDamage;
        }
    }

    if (newHp <= 0) {
      setGameState(prev => ({
        ...prev,
        hp: 0,
        currentNodeKey: 'gameOver_hp',
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        hp: newHp,
        inventory: newInventory,
        currentNodeKey: nextNodeKey,
      }));
    }
  }, [gameState, setGameState]);

  const value = {
    gameState,
    startGame,
    resetGame,
    handleChoice,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;