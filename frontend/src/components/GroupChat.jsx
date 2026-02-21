import { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { messageAPI } from '../services/api';
import websocketService from '../services/websocket';

export default function GroupChat({ group, messages, onSendMessage, currentUserId, currentUsername, onBack, onMessageEdit, onMessageDelete }) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutsRef = useRef({});
  const typingSentRef = useRef(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    websocketService.setTypingHandler((event) => {
      if (event.sender === currentUsername) return;
      if (event.typing) {
        setTypingUsers(prev => new Set(prev).add(event.sender));
        clearTimeout(typingTimeoutsRef.current[event.sender]);
        typingTimeoutsRef.current[event.sender] = setTimeout(() => {
          setTypingUsers(prev => { const s = new Set(prev); s.delete(event.sender); return s; });
        }, 3000);
      } else {
        setTypingUsers(prev => { const s = new Set(prev); s.delete(event.sender); return s; });
      }
    });
    return () => websocketService.setTypingHandler(null);
  }, [currentUsername]);

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    if (!typingSentRef.current) {
      typingSentRef.current = true;
      websocketService.sendTyping(currentUsername, null, group.id, true);
    }
    clearTimeout(typingTimeoutsRef.current._self);
    typingTimeoutsRef.current._self = setTimeout(() => {
      typingSentRef.current = false;
      websocketService.sendTyping(currentUsername, null, group.id, false);
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
    websocketService.sendTyping(currentUsername, null, group.id, false);
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

  const typingLabel = [...typingUsers].slice(0, 2).join(', ') + (typingUsers.size > 2 ? ' and others' : '');

  return (
    <main
      className="flex-1 flex flex-col glass-panel rounded-2xl h-full overflow-hidden relative"
      onClick={() => setShowEmojiPicker(false)}
    >
      {/* Header */}
      <header className="h-16 md:h-20 shrink-0 px-4 md:px-6 flex items-center justify-between border-b border-glass-border backdrop-blur-md z-20">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onBack} className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{group.name}</h2>
            <div className="h-4 flex items-center gap-2">
              {typingUsers.size > 0 ? (
                <span className="text-xs text-primary font-medium animate-pulse">{typingLabel} typing...</span>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400 font-medium">Group Chat</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 flex flex-col scroll-smooth">
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
                className={`flex items-end gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}
                onMouseEnter={() => setHoveredMsgId(msg.id ?? index)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                {!isOwn && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 mb-1 border border-glass-border">
                    {msg.sender?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                <div className={`flex flex-col gap-0.5 items-start max-w-[85%] md:max-w-[60%] ${isOwn ? 'items-end' : ''}`}>
                  {!isOwn && (
                    <span className="text-xs font-bold text-slate-300 pl-1">{msg.sender?.username || 'User'}</span>
                  )}

                  {/* Reply preview */}
                  {msg.replyPreview && (
                    <div className="px-3 py-1 rounded-xl text-xs border-l-2 border-primary bg-white/5 text-slate-400 max-w-full truncate mb-0.5">
                      <span className="font-semibold text-primary">{msg.replySenderName}</span>: {msg.replyPreview}
                    </div>
                  )}

                  <div className="flex items-end gap-1.5">
                    {/* Hover actions */}
                    {isHovered && (
                      <div className={`flex items-center gap-1 ${isOwn ? 'order-first' : 'order-last'}`}>
                        <button onClick={() => startReply(msg)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Reply">
                          <span className="material-symbols-outlined text-[14px]">reply</span>
                        </button>
                        {isOwn && (
                          <>
                            <button onClick={() => startEdit(msg)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Edit">
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                            <button onClick={() => handleDelete(msg.id)} className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors" title="Delete">
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${isOwn
                      ? 'bg-primary hover:bg-primary-dark text-white rounded-br-sm shadow-lg shadow-primary/20 transition-all'
                      : 'message-incoming text-slate-200 rounded-bl-sm'}`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium pl-1">
                    {formatMessageTime(msg.timestamp)}
                    {msg.edited && <span className="ml-1 text-[10px] text-slate-600">(edited)</span>}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 md:p-4 pt-2 flex-shrink-0">
        {/* Reply / Edit bar */}
        {(replyTo || editingMsg) && (
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 mb-2 border-l-4 border-primary">
            <div className="truncate text-sm text-slate-300">
              {replyTo && <><span className="text-primary font-semibold">Reply to</span> {replyTo.senderName}: {replyTo.content}</>}
              {editingMsg && <><span className="text-primary font-semibold">Edit:</span> {editingMsg.content}</>}
            </div>
            <button onClick={() => { setReplyTo(null); setEditingMsg(null); setMessageInput(''); }} className="ml-2 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {showEmojiPicker && (
          <div className="absolute bottom-24 left-4 z-50" onClick={e => e.stopPropagation()}>
            <EmojiPicker
              onEmojiClick={(emojiData) => { setMessageInput(prev => prev + emojiData.emoji); inputRef.current?.focus(); }}
              theme="dark"
              height={380}
              width={320}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-input rounded-2xl flex items-end gap-2 p-2 relative shadow-lg">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setShowEmojiPicker(v => !v); }}
            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-yellow-400 transition-colors flex-shrink-0 self-end mb-0.5"
          >
            <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
          </button>
          <div className="flex-1 py-2.5 px-2">
            <input
              ref={inputRef}
              className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 p-0 text-sm"
              placeholder={editingMsg ? 'Edit message...' : 'Type a message...'}
              value={messageInput}
              onChange={handleInputChange}
              onKeyDown={e => e.key === 'Escape' && (setReplyTo(null), setEditingMsg(null), setMessageInput(''))}
            />
          </div>
          <button type="submit" className="ml-1 p-2 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex-shrink-0 self-end">
            <span className="material-symbols-outlined text-[20px] fill-current">send</span>
          </button>
        </form>
      </div>
    </main>
  );
}
