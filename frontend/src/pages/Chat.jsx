import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendAPI, groupAPI } from '../services/api';
import websocketService from '../services/websocket';
import PrivateChat from '../components/PrivateChat';
import GroupChat from '../components/GroupChat';
import Sidebar from '../components/Sidebar';
import FriendRequests from '../components/FriendRequests';
import CreateGroupModal from '../components/CreateGroupModal';

export default function Chat() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatType, setChatType] = useState(null); // 'private' or 'group'
  const [messages, setMessages] = useState({});
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const wsInitialized = useRef(false);

  useEffect(() => {
    if (user && !wsInitialized.current) {
      loadFriends();
      loadGroups();
      initializeWebSocket();
      wsInitialized.current = true;
    }

    // Don't disconnect on unmount - keep connection alive
    // return () => {
    //   if (wsInitialized.current) {
    //     websocketService.disconnect();
    //     wsInitialized.current = false;
    //   }
    // };
  }, [user]);

  const loadFriends = async () => {
    try {
      const response = await friendAPI.getFriends(user.id);
      setFriends(response.data);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getUserGroups(user.id);
      setGroups(response.data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const initializeWebSocket = () => {
    websocketService.connect(user.username, handleMessageReceived);
  };

  const handleMessageReceived = (message, type) => {
    const chatId = type === 'private' 
      ? (message.sender?.id === user.id ? message.receiver?.id : message.sender?.id)
      : message.groupId;
    
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message]
    }));
  };

  const handleChatSelect = (chat, type) => {
    setActiveChat(chat);
    setChatType(type);
    
    if (type === 'group' && !messages[chat.id]) {
      websocketService.subscribeToGroup(chat.id, handleMessageReceived);
    }
  };

  const handleSendMessage = (content) => {
    if (chatType === 'private') {
      websocketService.sendPrivateMessage(user.username, activeChat.username, content);
    } else if (chatType === 'group') {
      websocketService.sendGroupMessage(user.username, activeChat.id, content);
    }
  };

  const handleGroupCreated = () => {
    loadGroups();
    setShowCreateGroup(false);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display h-screen overflow-hidden selection:bg-primary selection:text-white">
      {/* Ambient Liquid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob bg-primary w-[500px] h-[500px] top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="liquid-blob bg-purple-600 w-[400px] h-[400px] bottom-[-50px] right-[-50px] opacity-40"></div>
        <div className="liquid-blob bg-cyan-600 w-[300px] h-[300px] top-[40%] left-[30%] opacity-30"></div>
      </div>

      <div className="relative z-10 flex h-full w-full">
        {/* Left Sidebar: Contacts */}
        <Sidebar
          friends={friends}
          groups={groups}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onShowFriendRequests={() => setShowFriendRequests(true)}
          onShowCreateGroup={() => setShowCreateGroup(true)}
        />

        {/* Main Chat Area */}
        {activeChat ? (
          chatType === 'private' ? (
            <PrivateChat
              friend={activeChat}
              messages={messages[activeChat.id] || []}
              onSendMessage={handleSendMessage}
              currentUserId={user.id}
            />
          ) : (
            <GroupChat
              group={activeChat}
              messages={messages[activeChat.id] || []}
              onSendMessage={handleSendMessage}
              currentUserId={user.id}
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center glass-panel">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">chat</span>
              <p className="text-slate-400 text-lg">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Friend Requests Modal */}
      {showFriendRequests && (
        <FriendRequests
          onClose={() => setShowFriendRequests(false)}
          onRequestHandled={loadFriends}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          friends={friends}
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}
