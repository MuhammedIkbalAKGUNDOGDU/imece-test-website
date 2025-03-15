import React, { useState } from 'react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { BsCheckAll } from 'react-icons/bs';
import { chats } from '../../data/messages';

const Chats = ({ onChatSelect }) => {
  const [activeTab, setActiveTab] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentList = activeTab === 'people' ? chats.people : chats.groups;
  
  const filteredChats = currentList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Back to Profile */}
      <div className="flex items-center p-4 border-b border-gray-200 text-[#1EFF26] hover:text-gray-600">
        <button className="mr-2 ">
          <FaArrowLeft size={20} />
        </button>
        <a href="#" className="underline text-left text-xl">
          Profile geri dön
        </a>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center bg-gray-100 p-2 rounded-lg">
          <FaSearch className="text-gray-500 ml-2 min-w-[20px]" />
          <input 
            type="text" 
            placeholder="Ara" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 bg-transparent outline-none w-full text-left" 
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 border-b border-gray-200 space-x-2">
        <button 
          onClick={() => setActiveTab('people')}
          className={`flex-1 p-2 rounded-lg transition-all ${
            activeTab === 'people' 
              ? 'bg-[#1EFF26] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Kişiler
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`flex-1 p-2 rounded-lg transition-all ${
            activeTab === 'groups' 
              ? 'bg-[#1EFF26] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Gruplar
        </button>
      </div>

      {/* Chat List */}
      <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        {filteredChats.map((chat) => (
          <div 
            key={chat.id} 
            className="flex mt-2 items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            onClick={() => onChatSelect(chat)}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
              {chat.profileImage ? (
                <img src={chat.profileImage} alt={chat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-left">{chat.name}</div>
              <div className="text-gray-500 text-sm truncate text-left">
                {chat.message}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <BsCheckAll className={chat.hasRead ? "text-blue-500" : "text-gray-400"} size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;