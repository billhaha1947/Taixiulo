import React, { useState } from 'react';
import { CHIP_VALUES } from '../../utils/constants';
import { motion } from 'framer-motion';

const ChipSelector = ({ selectedChip, onSelectChip }) => {
  const [hoveredChip, setHoveredChip] = useState(null);

  const ChipButton = ({ value, label, isSelected }) => {
    const isHovered = hoveredChip === value;

    return (
      <motion.button
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectChip(value)}
        onMouseEnter={() => setHoveredChip(value)}
        onMouseLeave={() => setHoveredChip(null)}
        className="chip-button relative"
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: isSelected 
            ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
            : 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
          border: isSelected 
            ? '3px solid #FFD700'
            : '3px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isSelected 
            ? '0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.3)'
            : isHovered
              ? '0 0 15px rgba(255, 215, 0, 0.5)'
              : '0 4px 10px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Shine effect */}
        {(isSelected || isHovered) && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
              animation: 'shine 2s infinite'
            }}
          />
        )}

        {/* Chip value text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <div 
            className={`text-lg font-black ${
              isSelected ? 'text-gray-900' : 'text-yellow-400'
            }`}
            style={{
              textShadow: isSelected ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            {label}
          </div>
        </div>

        {/* Inner ring decoration */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            border: '1px dashed rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none'
          }}
        />
      </motion.button>
    );
  };

  return (
    <div className="chip-selector py-6">
      {/* Label */}
      <div className="text-center mb-4">
        <div className="text-sm font-medium text-gray-400">
          Chọn mệnh giá chip
        </div>
      </div>

      {/* Chips grid */}
      <div className="flex items-center justify-center gap-4 flex-wrap px-8">
        {CHIP_VALUES.map(chip => (
          <ChipButton
            key={chip.value}
            value={chip.value}
            label={chip.label}
            isSelected={selectedChip === chip.value}
          />
        ))}
      </div>

      {/* Selected chip display */}
      {selectedChip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <div className="inline-block px-6 py-2 rounded-lg"
            style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}
          >
            <span className="text-gray-400 text-sm">Đã chọn: </span>
            <span className="text-yellow-400 font-bold">
              {CHIP_VALUES.find(c => c.value === selectedChip)?.label}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChipSelector;
