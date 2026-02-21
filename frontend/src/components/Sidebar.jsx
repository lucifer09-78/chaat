import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ friends, groups, activeChat, onChatSelect, onShowFriendRequests, onShowCreateGroup, unreadCounts = {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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

  return (
    <aside className="w-80 flex flex-col glass-panel border-r border-white/5 flex-shrink-0">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 text-white mb-6">
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg shadow-[0_0_15px_rgba(43,108,238,0.5)]">
            <span className="material-symbols-outlined text-[20px]">bubble_chart</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">NebulaChat</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={onShowFriendRequests}
            className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg px-3 py-2 text-xs font-bold transition-colors"
          >
            Requests
          </button>
          <button
            onClick={onShowCreateGroup}
            className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold transition-colors"
          >
            New Group
          </button>
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Friends</h3>
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => onChatSelect(friend, 'private')}
            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${
              activeChat?.id === friend.id
                ? 'glass-card border-primary/30 bg-primary/10'
                : 'hover:bg-white/5 border-transparent hover:border-white/5'
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                {friend.username.charAt(0).toUpperCase()}
              </div>
              {friend.isOnline ? (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#101622] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              ) : (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-500 rounded-full border-2 border-[#101622]"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{friend.username}</h3>
              <p className="text-xs text-slate-400 truncate">
                {friend.isOnline ? 'Online' : friend.lastSeen ? `Last seen ${formatLastSeen(friend.lastSeen)}` : 'Offline'}
              </p>
            </div>
            {unreadCounts[friend.id] > 0 && (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-white">{unreadCounts[friend.id]}</span>
              </div>
            )}
          </div>
        ))}

        {/* Groups List */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-6">Groups</h3>
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => onChatSelect(group, 'group')}
            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${
              activeChat?.id === group.id
                ? 'glass-card border-primary/30 bg-primary/10'
                : 'hover:bg-white/5 border-transparent hover:border-white/5'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{group.name}</h3>
              <p className="text-xs text-slate-400 truncate">Group Chat</p>
            </div>
            {unreadCounts[`group_${group.id}`] > 0 && (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-white">{unreadCounts[`group_${group.id}`]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Profile Bottom */}
      <div className="p-4 border-t border-glass-border">
        <div className="flex items-center gap-3 w-full p-2 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-white leading-none">{user?.username}</p>
            <p className="text-xs text-slate-400 leading-none mt-1">Online</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="text-slate-400 hover:text-white transition-colors"
            title="Profile & Settings"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
