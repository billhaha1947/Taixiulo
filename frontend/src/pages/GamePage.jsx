import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';

// Layout components
import Header from '../components/Layout/Header';
import UserProfile from '../components/Layout/UserProfile';

// Game components
import RoundCounter from '../components/Game/RoundCounter';
import Timer from '../components/Game/Timer';
import DiceArena from '../components/Game/DiceArena';
import BettingPanel from '../components/Game/BettingPanel';
import ChipSelector from '../components/Game/ChipSelector';
import ActionButtons from '../components/Game/ActionButtons';

const GamePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { addBet } = useGame();
  
  const [selectedChip, setSelectedChip] = useState(null);

  const handleBack = () => {
    if (window.confirm('Bạn có chắc muốn thoát?')) {
      logout();
      navigate('/login');
    }
  };

  const handleBetClick = (side) => {
    if (!selectedChip) {
      alert('Vui lòng chọn chip trước!');
      return;
    }
    
    addBet(side, selectedChip);
  };

  const handleAllIn = (amount) => {
    // Logic để đặt ALL-IN sẽ được xử lý trong ActionButtons
  };

  const handleClearBet = () => {
    // Logic clear bet
  };

  return (
    <div className="game-page min-h-screen casino-bg flex flex-col">
      {/* Header */}
      <Header onBack={handleBack} />

      {/* Main game area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top section - User profile and round info */}
        <div className="px-6 py-4 flex items-center justify-between">
          {/* User Profile - Left */}
          <UserProfile />

          {/* Round Counter - Center */}
          <div className="flex-1 flex justify-center">
            <RoundCounter />
          </div>

          {/* Timer - Right */}
          <div className="flex items-center">
            <Timer />
          </div>
        </div>

        {/* Main game container */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {/* Dice Arena */}
            <div className="mb-8">
              <DiceArena />
            </div>

            {/* Betting Panel - TÀI/XỈU buttons */}
            <div className="mb-8">
              <BettingPanel 
                selectedChip={selectedChip}
                onBetClick={handleBetClick}
              />
            </div>

            {/* Chip Selector */}
            <div className="mb-6">
              <ChipSelector 
                selectedChip={selectedChip}
                onSelectChip={setSelectedChip}
              />
            </div>

            {/* Action Buttons */}
            <div>
              <ActionButtons 
                selectedChip={selectedChip}
                onClearBet={handleClearBet}
                onAllIn={handleAllIn}
              />
            </div>
          </div>
        </div>

        {/* Bottom info bar */}
        <div 
          className="px-6 py-3 flex items-center justify-center gap-8 text-xs text-gray-400"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderTop: '1px solid rgba(255, 215, 0, 0.2)'
          }}
        >
          <div>🎲 Tài: Tổng ≥ 11</div>
          <div>🎲 Xỉu: Tổng {'<'} 11</div>
          <div>💰 Tỷ lệ: 1:1</div>
          <div>🔥 Xu ảo - Không tiền thật</div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
