import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { groupAPI } from '../services/api';

export default function CreateGroupModal({ friends, onClose, onGroupCreated }) {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFriend = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedFriends.length === 0) {
      alert('Please enter a group name and select at least one friend');
      return;
    }

    try {
      await groupAPI.createGroup(groupName, user.id, selectedFriends);
      onGroupCreated();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Glass Modal Card */}
        <div className="glass-panel w-full rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70"></div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-2">
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Create New Group</h1>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Content Body */}
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-6">
            {/* Group Name Input */}
            <div className="group/input relative">
              <label className="block text-xs font-medium text-primary mb-1.5 uppercase tracking-wider ml-1">
                Group Name
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full bg-[#1c1f27]/50 border border-glass-border rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                  placeholder="e.g. Project Titan Squad"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
                <div className="absolute right-4 text-slate-500 pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </div>
              </div>
            </div>

            {/* Friend Search & List */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">
                  Add Participants
                </label>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  {selectedFriends.length} Selected
                </span>
              </div>

              {/* Search Box */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="w-full bg-[#1c1f27]/30 border border-glass-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:bg-[#1c1f27]/50 focus:border-primary/30 transition-all"
                  placeholder="Search friends..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Scrollable List */}
              <div className="custom-scrollbar max-h-[240px] overflow-y-auto pr-1 -mr-2 space-y-1 mt-1">
                {filteredFriends.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">No friends found</p>
                ) : (
                  filteredFriends.map((friend) => (
                    <label
                      key={friend.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item border border-transparent hover:border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 p-[1px]">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold border-2 border-[#1c1f27]">
                              {friend.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1c1f27]"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white group-hover/item:text-primary-light transition-colors">
                            {friend.username}
                          </span>
                          <span className="text-xs text-slate-500">@{friend.username.toLowerCase()}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedFriends.includes(friend.id)}
                        onChange={() => toggleFriend(friend.id)}
                        className="custom-checkbox h-5 w-5 rounded border-slate-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                      />
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-5 h-12 rounded-xl liquid-btn bg-liquid-gradient text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
