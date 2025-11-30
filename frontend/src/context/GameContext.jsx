import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { 
  initSocket, 
  disconnectSocket,
  joinGame,
  onRoundStart,
  onTimerUpdate,
  onBettingLocked,
  onDiceRolling,
  onRoundResult,
  onBetPlaced,
  onBalanceUpdate,
  onBalanceUpdateAll,
  onCurrentRound,
  removeAllListeners
} from '../services/socket';
import { GAME_STATUS } from '../utils/constants';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { isAuthenticated, updateBalance } = useContext(AuthContext);

  // Game state
  const [currentRound, setCurrentRound] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.OPEN);
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [socket, setSocket] = useState(null);

  // Current bet state
  const [currentBet, setCurrentBet] = useState({
    tai: 0,
    xiu: 0
  });

  // Initialize socket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const socketInstance = initSocket();
      setSocket(socketInstance);

      if (socketInstance) {
        // Join game room
        joinGame();

        // Listen to events
        setupSocketListeners();
      }

      return () => {
        removeAllListeners();
        disconnectSocket();
      };
    }
  }, [isAuthenticated]);

  // Setup socket event listeners
  const setupSocketListeners = () => {
    // Round start
    onRoundStart((data) => {
      console.log('Round start:', data);
      setCurrentRound(data);
      setTimeLeft(15);
      setGameStatus(GAME_STATUS.OPEN);
      setDiceResult(null);
      setIsRolling(false);
      setCurrentBet({ tai: 0, xiu: 0 });
    });

    // Timer update
    onTimerUpdate((data) => {
      setTimeLeft(data.timeLeft);
    });

    // Betting locked
    onBettingLocked(() => {
      setGameStatus(GAME_STATUS.LOCKED);
    });

    // Dice rolling
    onDiceRolling(() => {
      setIsRolling(true);
      setGameStatus(GAME_STATUS.ROLLING);
    });

    // Round result
    onRoundResult((data) => {
      console.log('Round result:', data);
      setDiceResult(data);
      setIsRolling(false);
      setGameStatus(GAME_STATUS.RESULT);
    });

    // Bet placed by someone
    onBetPlaced((data) => {
      console.log('Bet placed:', data);
    });

    // Balance update
    onBalanceUpdate((data) => {
      updateBalance(data.coins);
    });

    // Balance update all (after round result)
    onBalanceUpdateAll(() => {
      // Refresh balance
      // userAPI.getBalance() nếu cần
    });

    // Current round info (when joining)
    onCurrentRound((data) => {
      if (data) {
        setCurrentRound(data);
        setTimeLeft(data.timeLeft || 15);
        setGameStatus(data.status || GAME_STATUS.OPEN);
      }
    });
  };

  // Add bet to current bet
  const addBet = (side, amount) => {
    setCurrentBet(prev => ({
      ...prev,
      [side]: prev[side] + amount
    }));
  };

  // Clear current bet
  const clearBet = () => {
    setCurrentBet({ tai: 0, xiu: 0 });
  };

  const value = {
    currentRound,
    timeLeft,
    gameStatus,
    diceResult,
    isRolling,
    currentBet,
    addBet,
    clearBet,
    socket
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
