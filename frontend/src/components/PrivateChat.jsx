import { useState, useEffect, useRef, useCallback } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { messageAPI } from '../services/api';
import websocketService from '../services/websocket';

const MessageStatusIcon = ({ status }) => {
  if (status === 'read') {
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
        <path d="M11.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95L3.53 4.072a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#53bdeb" />
        <path d="M15.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95-1.531-1.531a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#53bdeb" />
      </svg>
    );
  } else if (status === 'delivered') {
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
        <path d="M11.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95L3.53 4.072a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#8696a0" />
        <path d="M15.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95-1.531-1.531a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#8696a0" />
      </svg>
    );
  }
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" className="inline-block ml-1">
      <path d="M11.071.653a.75.75 0 0 0-1.06 0l-5.48 5.48-2.06-2.061a.75.75 0 0 0-1.06 1.06l2.59 2.591a.75.75 0 0 0 1.06 0l6.01-6.01a.75.75 0 0 0 0-1.06z" fill="#8696a0" />
    </svg>
  );
};

export default function PrivateChat({ friend, messages, onSendMessage, currentUserId, currentUsername, onBack, onMessageEdit, onMessageDelete }) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);      // { id, content, senderName }
  const [editingMsg, setEditingMsg] = useState(null); // { id, content }
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [friendTyping, setFriendTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const typingSentRef = useRef(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Register typing handler
  useEffect(() => {
    websocketService.setTypingHandler((event) => {
      if (event.sender === friend.username) {
        setFriendTyping(event.typing);
        if (event.typing) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setFriendTyping(false), 3000);
        }
      }
    });
    return () => websocketService.setTypingHandler(null);
  }, [friend.username]);

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    // Send typing indicator
    if (!typingSentRef.current) {
      typingSentRef.current = true;
      websocketService.sendTyping(currentUsername, friend.username, null, true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingSentRef.current = false;
      websocketService.sendTyping(currentUsername, friend.username, null, false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    if (editingMsg) {
      messageAPI.editMessage(editingMsg.id, messageInput.trim())
        .then(res => { if (onMessageEdit) onMessageEdit(res.data); })
        .catch(err => console.error('Edit failed', err));
      setEditingMsg(null);
    } else {
      onSendMessage(messageInput.trim(), replyTo);
      setReplyTo(null);
    }
    setMessageInput('');
    websocketService.sendTyping(currentUsername, friend.username, null, false);
    typingSentRef.current = false;
    setShowEmojiPicker(false);
  };

  const handleDelete = async (msgId) => {
    try {
      await messageAPI.deleteMessage(msgId);
      if (onMessageDelete) onMessageDelete(msgId);
    } catch (err) { console.error('Delete failed', err); }
  };

  const startEdit = (msg) => {
    setEditingMsg({ id: msg.id, content: msg.content });
    setMessageInput(msg.content);
    setReplyTo(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const startReply = (msg) => {
    setReplyTo({ id: msg.id, content: msg.content, senderName: msg.sender?.username });
    setEditingMsg(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const formatLastSeen = (lastSeenStr) => {
    if (!lastSeenStr) return 'long ago';
    const ts = lastSeenStr.endsWith('Z') || lastSeenStr.includes('+') ? lastSeenStr : lastSeenStr + 'Z';
    const lastSeen = new Date(ts);
    const now = new Date();
    const diffMins = Math.floor((now - lastSeen) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeen.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const ts = timestamp.endsWith('Z') || timestamp.includes('+') ? timestamp : timestamp + 'Z';
    const date = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays < 7) return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="flex-1 flex flex-col relative min-w-0 h-full" onClick={() => setShowEmojiPicker(false)}>
      {/* Chat Header */}
      <header className="h-16 md:h-20 glass-panel border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {friend.username.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#101622] ${friend.isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{friend.username}</h2>
            <div className="flex items-center gap-1.5 h-4">
              {friendTyping ? (
                <span className="text-xs text-primary font-medium animate-pulse">typing...</span>
              ) : friend.isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-primary font-medium tracking-wide uppercase">Online</span>
                </>
              ) : (
                <span className="text-xs text-slate-400">
                  {friend.lastSeen ? `Last seen ${formatLastSeen(friend.lastSeen)}` : 'Offline'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 relative">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender?.id === currentUserId;
            const isHovered = hoveredMsgId === (msg.id ?? index);
            return (
              <div
                key={msg.id ?? index}
                className={`flex gap-2 md:gap-3 max-w-[85%] md:max-w-[75%] group ${isOwn ? 'ml-auto justify-end' : ''}`}
                onMouseEnter={() => setHoveredMsgId(msg.id ?? index)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                {!isOwn && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm self-end mb-5 flex-shrink-0">
                    {msg.sender?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                <div className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : ''}`}>
                  {/* Reply preview inside bubble */}
                  {msg.replyPreview && (
                    <div className={`px-3 py-1.5 rounded-xl text-xs mb-0.5 border-l-2 border-primary bg-white/5 text-slate-400 max-w-full truncate`}>
                      <span className="font-semibold text-primary">{msg.replySenderName}</span>: {msg.replyPreview}
                    </div>
                  )}

                  <div className="flex items-end gap-1">
                    {/* Action buttons (reply + edit/delete for own) — appear on hover */}
                    {isHovered && (
                      <div className={`flex items-center gap-1 mb-5 ${isOwn ? 'order-first' : 'order-last'}`}>
                        <button
                          onClick={() => startReply(msg)}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          title="Reply"
                        >
                          <span className="material-symbols-outlined text-[14px]">reply</span>
                        </button>
                        {isOwn && (
                          <>
                            <button
                              onClick={() => startEdit(msg)}
                              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <div className={`p-3 md:p-4 rounded-2xl text-sm leading-relaxed ${isOwn
                      ? 'bg-primary/90 text-white rounded-br-none shadow-[0_4px_20px_rgba(43,108,238,0.3)]'
                      : 'glass-card text-slate-200 rounded-bl-none'}`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 flex items-center gap-1 px-1">
                    {formatMessageTime(msg.timestamp)}
                    {msg.edited && <span className="text-[9px] text-slate-600">(edited)</span>}
                    {isOwn && <MessageStatusIcon status={msg.status || 'sent'} />}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-6 pt-2 flex-shrink-0">
        {/* Reply / Edit bar */}
        {(replyTo || editingMsg) && (
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 mb-2 border-l-4 border-primary">
            <div className="truncate text-sm text-slate-300">
              {replyTo && <><span className="text-primary font-semibold">Reply to</span> {replyTo.senderName}: {replyTo.content}</>}
              {editingMsg && <><span className="text-primary font-semibold">Edit message:</span> {editingMsg.content}</>}
            </div>
            <button
              onClick={() => { setReplyTo(null); setEditingMsg(null); setMessageInput(''); }}
              className="ml-2 text-slate-400 hover:text-white flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-24 left-4 z-50" onClick={e => e.stopPropagation()}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setMessageInput(prev => prev + emojiData.emoji);
                inputRef.current?.focus();
              }}
              theme="dark"
              height={380}
              width={320}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-input rounded-full p-2 pl-4 flex items-center gap-2 shadow-lg">
          {/* Emoji button */}
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setShowEmojiPicker(v => !v); }}
            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-yellow-400 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
          </button>

          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 font-medium min-w-0"
            placeholder={editingMsg ? 'Edit message...' : 'Type a message...'}
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Escape' && (setReplyTo(null), setEditingMsg(null), setMessageInput(''))}
          />

          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(43,108,238,0.6)] hover:bg-blue-600 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
          </button>
        </form>
      </div>
    </main>
  );
}
