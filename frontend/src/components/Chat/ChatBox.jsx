import React, { useState, useEffect, useRef } from 'react';
import { sendChat, onChatMessage, onChatError } from '../../services/socket';
import { CHAT_ROOMS } from '../../utils/constants';
import { MessageCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(CHAT_ROOMS.TABLE);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen to chat messages
  useEffect(() => {
    const unsubscribe = onChatMessage((data) => {
      setMessages(prev => [...prev, data]);
    });

    const unsubscribeError = onChatError((data) => {
      setError(data.error);
      setTimeout(() => setError(''), 3000);
    });

    return () => {
      unsubscribe();
      unsubscribeError();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    if (inputText.length > 200) {
      setError('Tin nhắn quá dài (tối đa 200 ký tự)');
      return;
    }

    sendChat(inputText, activeRoom);
    setInputText('');
  };

  const switchRoom = (room) => {
    setActiveRoom(room);
  };

  if (!isOpen) {
    // Floating chat button
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          boxShadow: '0 4px 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MessageCircle size={32} color="#000" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl overflow-hidden"
      style={{
        height: '500px',
        background: 'linear-gradient(135deg, rgba(26, 0, 0, 0.98) 0%, rgba(51, 0, 0, 0.95) 100%)',
        border: '2px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(139, 0, 0, 0.1) 100%)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
        }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-yellow-400" />
          <span className="font-bold text-white">Chat</span>
        </div>
        
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white hover:bg-opacity-10 p-1 rounded transition"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Room tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => switchRoom(CHAT_ROOMS.TABLE)}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeRoom === CHAT_ROOMS.TABLE
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Bàn cược
        </button>
        <button
          onClick={() => switchRoom(CHAT_ROOMS.GLOBAL)}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeRoom === CHAT_ROOMS.GLOBAL
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Toàn server
        </button>
      </div>

      {/* Messages area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ height: 'calc(100% - 180px)' }}
      >
        {messages
          .filter(msg => msg.room === activeRoom)
          .map((msg, idx) => (
            <ChatMessage key={`${msg.timestamp}-${idx}`} message={msg} />
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-600 bg-opacity-20 border-t border-red-500">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập tin nhắn..."
            maxLength={200}
            className="flex-1 px-4 py-2 rounded-lg text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-yellow-500"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 rounded-lg disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000'
            }}
          >
            <Send size={20} />
          </motion.button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {inputText.length}/200
        </div>
      </form>
    </motion.div>
  );
};

export default ChatBox;
