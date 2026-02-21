import { useState, useEffect, useRef } from 'react';

const MessageStatusIcon = ({ status }) => {
  if (status === 'read') {
    // Blue double tick
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
        <path d="M11.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95L3.53 4.072a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#53bdeb" />
        <path d="M15.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95-1.531-1.531a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#53bdeb" />
      </svg>
    );
  } else if (status === 'delivered') {
    // Gray double tick
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
        <path d="M11.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95L3.53 4.072a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#8696a0" />
        <path d="M15.071.653a.75.75 0 0 0-1.06 0l-4.95 4.95-1.531-1.531a.75.75 0 0 0-1.06 1.06l2.06 2.061a.75.75 0 0 0 1.06 0l5.48-5.48a.75.75 0 0 0 0-1.06z" fill="#8696a0" />
      </svg>
    );
  } else {
    // Gray single tick (sent)
    return (
      <svg width="12" height="11" viewBox="0 0 12 11" fill="none" className="inline-block ml-1">
        <path d="M11.071.653a.75.75 0 0 0-1.06 0l-5.48 5.48-2.06-2.061a.75.75 0 0 0-1.06 1.06l2.59 2.591a.75.75 0 0 0 1.06 0l6.01-6.01a.75.75 0 0 0 0-1.06z" fill="#8696a0" />
      </svg>
    );
  }
};

export default function PrivateChat({ friend, messages, onSendMessage, currentUserId, onBack }) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const formatLastSeen = (lastSeenStr) => {
    if (!lastSeenStr) return 'long ago';

    const lastSeen = new Date(lastSeenStr);
    const now = new Date();
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeen.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    // Backend returns UTC timestamps without 'Z' - force UTC parsing
    const ts = timestamp.endsWith('Z') || timestamp.includes('+') ? timestamp : timestamp + 'Z';
    const date = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);

    // If today, show time only
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // If yesterday
    if (diffDays === 1) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // If within a week, show day name
    if (diffDays < 7) {
      return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Otherwise show full date
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="flex-1 flex flex-col relative min-w-0 h-full">
      {/* Chat Header */}
      <header className="h-16 md:h-20 glass-panel border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          <button
            onClick={onBack}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {friend.username.charAt(0).toUpperCase()}
            </div>
            {friend.isOnline ? (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#101622] animate-pulse"></div>
            ) : (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-500 rounded-full border-2 border-[#101622]"></div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{friend.username}</h2>
            <div className="flex items-center gap-1.5">
              {friend.isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 relative">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender?.id === currentUserId;
            return (
              <div
                key={index}
                className={`flex gap-2 md:gap-4 max-w-[85%] md:max-w-[80%] ${isOwn ? 'ml-auto justify-end' : ''}`}
              >
                {!isOwn && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm self-end mb-1">
                    {msg.sender?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${isOwn
                      ? 'bg-primary/90 text-white rounded-br-none shadow-[0_4px_20px_rgba(43,108,238,0.3)]'
                      : 'glass-card text-slate-200 rounded-bl-none'
                      }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-500 ml-2 flex items-center gap-1">
                    {formatMessageTime(msg.timestamp)}
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
        <form onSubmit={handleSubmit} className="glass-input rounded-full p-2 pl-6 flex items-center gap-4 shadow-lg">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 font-medium"
            placeholder="Type a message..."
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(43,108,238,0.6)] hover:bg-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
          </button>
        </form>
      </div>
    </main>
  );
}
