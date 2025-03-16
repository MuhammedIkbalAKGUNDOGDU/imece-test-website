import React, { useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import { FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { BsCheckAll } from 'react-icons/bs';

const SelectedChat = ({ chat, onBack }) => {
  // ESC tuşu için event listener
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && chat) {
        onBack?.();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [chat, onBack]);

  if (!chat) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        {onBack && (
          <button 
            onClick={onBack}
            className="mr-3 text-gray-600 hover:text-gray-800 lg:hidden"
          >
            <FaArrowLeft size={20} />
          </button>
        )}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0">        </div>
        <div className="ml-4 flex-1 min-w-0">
          <div className="font-bold text-gray-900 truncate">{chat.name}</div>
          {chat.description && (
            <div className="text-gray-500 text-sm truncate">{chat.description}</div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1   p-4 overflow-y-auto bg-gray-100">
        <div className="space-y-4  w-full">
          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
                {message.sender === 'other' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full mx-2 overflow-hidden">
                    {chat.profileImage && (
                      <img src={chat.profileImage} alt={chat.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender === 'me' 
                    ? 'bg-[#1EFF26] text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  {/* Gönderen kişi adı - sadece grup sohbetlerinde ve diğer kişilerin mesajlarında göster */}
                  {message.sender === 'other' && message.name && (
                    <div className="font-semibold text-left mb-1">
                      {message.name}
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-400">
                      {message.time}
                    </span>
                    {message.sender === 'me' && (
                      <BsCheckAll 
                        className={message.read ? "text-blue-500" : "text-gray-400"} 
                        size={16}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-4 border-t border-gray-200 bg-white gap-3 ">
        <div className="flex-1 flex items-center bg-white rounded-lg shadow-2xl shadow-gray-300 border border-gray-300">
          <input 
            type="text" 
            placeholder="Mesaj yazın" 
            className="flex-1 p-2.5 rounded-lg outline-none" 
          />
          <div className="h-[28px] border-l border-gray-300"></div>
          <button className="p-2.5 text-gray-600 hover:text-green-600 transition-colors">
            <FaPaperPlane size={20} />
          </button>
        </div>

        <div className="flex items-center shadow-gray-500 shadow-2xl rounded-lg border border-gray-300">
          <div className="flex items-center">
            <button className="p-2.5 text-gray-500 hover:text-gray-700">
              <FaSmile size={20} />
            </button>
            <div className="h-[28px] mx-1 border-l border-gray-300"></div>
            <button className="p-2.5 text-gray-500 hover:text-gray-700">
              <FaPaperclip size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedChat;
