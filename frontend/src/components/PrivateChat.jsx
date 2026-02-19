import { useState, useEffect, useRef } from 'react';

export default function PrivateChat({ friend, messages, onSendMessage, currentUserId }) {
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

  return (
    <main className="flex-1 flex flex-col relative min-w-0">
      {/* Chat Header */}
      <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {friend.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#101622]"></div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{friend.username}</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-primary font-medium tracking-wide uppercase">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 relative">
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
                className={`flex gap-4 max-w-[80%] ${isOwn ? 'ml-auto justify-end' : ''}`}
              >
                {!isOwn && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm self-end mb-1">
                    {msg.sender?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-primary/90 text-white rounded-br-none shadow-[0_4px_20px_rgba(43,108,238,0.3)]'
                        : 'glass-card text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-500 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 pt-2">
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
