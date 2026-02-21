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
  const [chatType, setChatType] = useState(null); // 'private' or 'group'
  const [messages, setMessages] = useState({});
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const wsInitialized = useRef(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  useEffect(() => {
    if (user && !wsInitialized.current) {
      loadFriends();
      loadGroups();
      initializeWebSocket();
      wsInitialized.current = true;

      // Send heartbeat every 2 minutes to update presence
      const heartbeatInterval = setInterval(() => {
        userAPI.updatePresence(user.id).catch(err => {
          console.error('Failed to update presence:', err);
        });
      }, 120000); // 2 minutes

      // Refresh friends list every 30 seconds to update online status
      const refreshInterval = setInterval(() => {
        loadFriends();
      }, 30000); // 30 seconds

      // Cleanup
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

  const initializeWebSocket = () => {
    websocketService.connect(user.username, handleMessageReceived);
  };

  const handleMessageReceived = (message, type) => {
    console.log('📨 Message received:', { message, type });
    
    let chatKey;
    let senderName;
    
    if (type === 'private') {
      // For private messages, use the other person's ID
      const peerId = message.sender?.id === user.id ? message.receiver?.id : message.sender?.id;
      chatKey = `private_${peerId}`;
      senderName = message.sender?.username;
      
      // Update unread count if message is from someone else
      if (message.sender?.id !== user.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [peerId]: (prev[peerId] || 0) + 1
        }));
      }
    } else {
      // For group messages, use the group ID
      chatKey = `group_${message.groupId}`;
      senderName = message.sender?.username;
      
      // Update unread count for group
      if (message.sender?.id !== user.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [`group_${message.groupId}`]: (prev[`group_${message.groupId}`] || 0) + 1
        }));
      }
    }
    
    console.log('💾 Storing message in key:', chatKey);
    
    setMessages(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), message]
    }));

    // Mark as delivered immediately
    if (message.id && message.sender?.id !== user.id) {
      messageAPI.markAsDelivered(message.id).catch(err => {
        console.error('Failed to mark as delivered:', err);
      });
    }

    // Show notification if message is from someone else and window is not focused
    if (message.sender?.id !== user.id && (!document.hasFocus() || activeChat?.id !== (type === 'private' ? message.sender?.id : message.groupId))) {
      showNotification(senderName, message.content, type);
    }
  };

  const showNotification = (senderName, content, type) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`New message from ${senderName}`, {
        body: content.length > 50 ? content.substring(0, 50) + '...' : content,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: `message-${senderName}`,
        requireInteraction: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    }
  };

  const handleChatSelect = async (chat, type) => {
    console.log('💬 Chat selected:', { chat, type });
    setActiveChat(chat);
    setChatType(type);
    
    const chatKey = type === 'private' ? `private_${chat.id}` : `group_${chat.id}`;
    console.log('🔑 Chat key:', chatKey);
    
    // Clear unread count for this chat
    if (type === 'private') {
      setUnreadCounts(prev => ({ ...prev, [chat.id]: 0 }));
      // Mark all messages from this friend as read
      await messageAPI.markAllAsRead(user.id, chat.id).catch(err => {
        console.error('Failed to mark messages as read:', err);
      });
    } else {
      setUnreadCounts(prev => ({ ...prev, [`group_${chat.id}`]: 0 }));
    }
    
    // Load message history from backend if not already loaded
    if (!messages[chatKey]) {
      try {
        console.log('📥 Loading message history from backend...');
        if (type === 'private') {
          const response = await messageAPI.getHistory(user.id, chat.id);
          console.log('✅ Loaded', response.data.length, 'private messages');
          setMessages(prev => ({
            ...prev,
            [chatKey]: response.data
          }));
        } else if (type === 'group') {
          const response = await messageAPI.getGroupHistory(chat.id);
          console.log('✅ Loaded', response.data.length, 'group messages');
          setMessages(prev => ({
            ...prev,
            [chatKey]: response.data
          }));
          // Subscribe to group for new messages
          console.log('📡 Subscribing to group:', chat.id);
          websocketService.subscribeToGroup(chat.id, handleMessageReceived);
        }
      } catch (error) {
        console.error('❌ Error loading message history:', error);
      }
    } else {
      console.log('📦 Using cached messages:', messages[chatKey].length, 'messages');
      // Still subscribe to group if it's a group chat
      if (type === 'group') {
        console.log('📡 Subscribing to group:', chat.id);
        websocketService.subscribeToGroup(chat.id, handleMessageReceived);
      }
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
          unreadCounts={unreadCounts}
        />

        {/* Main Chat Area */}
        {activeChat ? (
          chatType === 'private' ? (
            <PrivateChat
              friend={activeChat}
              messages={messages[`private_${activeChat.id}`] || []}
              onSendMessage={handleSendMessage}
              currentUserId={user.id}
            />
          ) : (
            <GroupChat
              group={activeChat}
              messages={messages[`group_${activeChat.id}`] || []}
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
