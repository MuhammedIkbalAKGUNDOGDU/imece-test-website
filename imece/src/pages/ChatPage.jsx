import React, { useState } from 'react';
import Chats from '../components/chatApp/Chats';
import SelectedChat from '../components/chatApp/SelectedChat';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

  // Ekran boyutu değişikliğini dinle
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobil görünümde chat seçildiğinde
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="fixed inset-0 flex w-full h-full bg-white overflow-hidden">
      {/* Sol Sidebar - Mobilde sadece chat seçili değilken görünür */}
      <div className={`${
        isMobileView ? 'w-full' : 'w-1/4'
      } border-r border-gray-200 overflow-hidden ${
        isMobileView && selectedChat ? 'hidden' : 'block'
      }`}>
        <Chats onChatSelect={handleChatSelect} />
      </div>
      
      {/* Ana Sohbet Alanı - Mobilde sadece chat seçiliyken görünür */}
      <div className={`${
        isMobileView ? 'w-full' : 'w-3/4'
      } overflow-hidden ${
        isMobileView && !selectedChat ? 'hidden' : 'block'
      }`}>
        <SelectedChat 
          chat={selectedChat}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default ChatPage;
