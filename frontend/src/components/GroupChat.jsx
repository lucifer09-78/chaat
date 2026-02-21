import { useState, useEffect, useRef } from 'react';

export default function GroupChat({ group, messages, onSendMessage, currentUserId }) {
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

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
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
    <main className="flex-1 flex flex-col glass-panel rounded-2xl h-full overflow-hidden relative">
      {/* Chat Header */}
      <header className="h-20 shrink-0 px-6 flex items-center justify-between border-b border-glass-border backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{group.name}</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 status-dot"></span>
              <span className="text-xs text-slate-400 font-medium">Group Chat</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse scroll-smooth">
        <div ref={messagesEndRef} />
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          [...messages].reverse().map((msg, index) => {
            const isOwn = msg.sender?.id === currentUserId;
            return (
              <div
                key={index}
                className={`flex items-end gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                {!isOwn && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 mb-1 border border-glass-border">
                    {msg.sender?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className={`flex flex-col gap-1 items-start max-w-[85%] md:max-w-[60%] ${isOwn ? 'items-end' : ''}`}>
                  {!isOwn && (
                    <div className="flex items-center gap-2 pl-1">
                      <span className="text-xs font-bold text-slate-300">{msg.sender?.username || 'User'}</span>
                    </div>
                  )}
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-primary hover:bg-primary-dark text-white rounded-br-sm shadow-lg shadow-primary/20 transition-all'
                        : 'message-incoming text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 pt-2">
        <form onSubmit={handleSubmit} className="glass-input rounded-2xl flex items-end gap-2 p-2 relative shadow-lg">
          <div className="flex-1 py-2.5 px-2">
            <input
              className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 p-0 text-sm"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 pb-1">
            <button
              type="submit"
              className="ml-1 p-2 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px] fill-current">send</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
