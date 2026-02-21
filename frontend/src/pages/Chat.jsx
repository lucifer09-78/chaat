import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendAPI, groupAPI, messageAPI, userAPI } from '../services/api';
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
  const [chatType, setChatType] = useState(null);
  const [messages, setMessages] = useState({});
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showChatPanel, setShowChatPanel] = useState(false); // mobile toggle
  const wsInitialized = useRef(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (user && !wsInitialized.current) {
      loadFriends();
      loadGroups();
      websocketService.connect(user.username, handleMessageReceived);
      wsInitialized.current = true;

      const heartbeatInterval = setInterval(() => {
        userAPI.updatePresence(user.id).catch(() => { });
      }, 60000);  // 1 minute

      const refreshInterval = setInterval(() => {
        loadFriends();
      }, 15000); // 15 seconds

      return () => {
        clearInterval(heartbeatInterval);
        clearInterval(refreshInterval);
      };
    }
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

  const handleMessageReceived = (message, type) => {
    let chatKey;
    if (type === 'private') {
      const peerId = message.sender?.id === user.id ? message.receiver?.id : message.sender?.id;
      chatKey = `private_${peerId}`;
      if (message.sender?.id !== user.id) {
        setUnreadCounts(prev => ({ ...prev, [peerId]: (prev[peerId] || 0) + 1 }));
      }
    } else {
      chatKey = `group_${message.groupId}`;
      if (message.sender?.id !== user.id) {
        setUnreadCounts(prev => ({ ...prev, [`group_${message.groupId}`]: (prev[`group_${message.groupId}`] || 0) + 1 }));
      }
    }

    setMessages(prev => ({ ...prev, [chatKey]: [...(prev[chatKey] || []), message] }));

    if (message.id && message.sender?.id !== user.id) {
      messageAPI.markAsDelivered(message.id).catch(() => { });
    }

    if (message.sender?.id !== user.id && 'Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`New message from ${message.sender?.username}`, {
        body: message.content?.length > 50 ? message.content.substring(0, 50) + '...' : message.content,
        icon: '/vite.svg',
        tag: `message-${message.sender?.username}`,
      });
      setTimeout(() => notification.close(), 5000);
    }
  };

  const handleChatSelect = async (chat, type) => {
    setActiveChat(chat);
    setChatType(type);
    setShowChatPanel(true); // on mobile: switch to chat view

    const chatKey = type === 'private' ? `private_${chat.id}` : `group_${chat.id}`;

    if (type === 'private') {
      setUnreadCounts(prev => ({ ...prev, [chat.id]: 0 }));
      messageAPI.markAllAsRead(user.id, chat.id).catch(() => { });
    } else {
      setUnreadCounts(prev => ({ ...prev, [`group_${chat.id}`]: 0 }));
    }

    if (!messages[chatKey]) {
      try {
        if (type === 'private') {
          const response = await messageAPI.getHistory(user.id, chat.id);
          setMessages(prev => ({ ...prev, [chatKey]: response.data }));
        } else {
          const response = await messageAPI.getGroupHistory(chat.id);
          setMessages(prev => ({ ...prev, [chatKey]: response.data }));
          websocketService.subscribeToGroup(chat.id, handleMessageReceived);
        }
      } catch (error) {
        console.error('Error loading message history:', error);
      }
    } else if (type === 'group') {
      websocketService.subscribeToGroup(chat.id, handleMessageReceived);
    }
  };

  const handleSendMessage = (content, replyTo) => {
    if (chatType === 'private') {
      websocketService.sendPrivateMessage(user.username, activeChat.username, content, replyTo);
    } else if (chatType === 'group') {
      websocketService.sendGroupMessage(user.username, activeChat.id, content, replyTo);
    }
  };

  const handleMessageEdit = (updatedMsg) => {
    // Update the message in local state by id
    setMessages(prev => {
      const updated = {};
      for (const key of Object.keys(prev)) {
        updated[key] = prev[key].map(m => m.id === updatedMsg.id ? updatedMsg : m);
      }
      return updated;
    });
  };

  const handleMessageDelete = (msgId) => {
    setMessages(prev => {
      const updated = {};
      for (const key of Object.keys(prev)) {
        updated[key] = prev[key].filter(m => m.id !== msgId);
      }
      return updated;
    });
  };

  const handleBackToSidebar = () => setShowChatPanel(false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display h-[100dvh] overflow-hidden selection:bg-primary selection:text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob bg-primary w-[500px] h-[500px] top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="liquid-blob bg-purple-600 w-[400px] h-[400px] bottom-[-50px] right-[-50px] opacity-40"></div>
        <div className="liquid-blob bg-cyan-600 w-[300px] h-[300px] top-[40%] left-[30%] opacity-30"></div>
      </div>

      <div className="relative z-10 flex h-full w-full">
        {/* Sidebar — full screen on mobile, fixed 320px on desktop */}
        <div className={`${showChatPanel ? 'hidden' : 'flex'} md:flex w-full md:w-80 flex-shrink-0`}>
          <Sidebar
            friends={friends}
            groups={groups}
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
            onShowFriendRequests={() => setShowFriendRequests(true)}
            onShowCreateGroup={() => setShowCreateGroup(true)}
            unreadCounts={unreadCounts}
          />
        </div>

        {/* Chat Panel — full screen on mobile (hidden when sidebar showing), flex-1 on desktop */}
        <div className={`${showChatPanel ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0`}>
          {activeChat ? (
            chatType === 'private' ? (
              <PrivateChat
                friend={activeChat}
                messages={messages[`private_${activeChat.id}`] || []}
                onSendMessage={handleSendMessage}
                currentUserId={user.id}
                currentUsername={user.username}
                onBack={handleBackToSidebar}
                onMessageEdit={handleMessageEdit}
                onMessageDelete={handleMessageDelete}
              />
            ) : (
              <GroupChat
                group={activeChat}
                messages={messages[`group_${activeChat.id}`] || []}
                onSendMessage={handleSendMessage}
                currentUserId={user.id}
                currentUsername={user.username}
                onBack={handleBackToSidebar}
                onMessageEdit={handleMessageEdit}
                onMessageDelete={handleMessageDelete}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center glass-panel">
              <div className="text-center px-4">
                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">chat</span>
                <p className="text-slate-400 text-lg">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showFriendRequests && (
        <FriendRequests onClose={() => setShowFriendRequests(false)} onRequestHandled={loadFriends} />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          friends={friends}
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={() => { loadGroups(); setShowCreateGroup(false); }}
        />
      )}
    </div>
  );
}
