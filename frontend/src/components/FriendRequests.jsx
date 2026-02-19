import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendAPI, userAPI } from '../services/api';

export default function FriendRequests({ onClose, onRequestHandled }) {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const response = await friendAPI.getPendingRequests(user.id);
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await userAPI.searchUsers(searchQuery);
      setSearchResults(response.data.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId) => {
    try {
      await friendAPI.sendRequest(user.id, receiverId);
      alert('Friend request sent!');
      setSearchResults(searchResults.filter(u => u.id !== receiverId));
    } catch (error) {
      console.error('Error sending request:', error);
      alert(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await friendAPI.acceptRequest(requestId);
      loadPendingRequests();
      onRequestHandled();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await friendAPI.rejectRequest(requestId);
      loadPendingRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-4xl rounded-2xl flex flex-col max-h-[90vh] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Friend Requests</h1>
            <p className="text-slate-400 text-sm mt-1">
              You have <span className="text-primary font-medium">{pendingRequests.length} pending requests</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-white/5">
          <label className="block text-xs font-medium text-primary mb-2 uppercase tracking-wider">
            Find New Friends
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-[#1c1f27]/50 border border-glass-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              placeholder="Search by username..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary hover:bg-blue-600 text-white font-bold px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              Search
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                      {result.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{result.username}</span>
                  </div>
                  <button
                    onClick={() => handleSendRequest(result.id)}
                    className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Requests */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Pending Requests ({pendingRequests.length})
          </h3>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">person_add</span>
              <p className="text-slate-500">No pending requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="liquid-card rounded-2xl p-5 flex flex-col gap-4 hover:bg-white/[0.03]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {request.sender?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{request.sender?.username}</h3>
                      <p className="text-xs text-slate-400">Wants to connect</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl shadow-[0_0_15px_rgba(43,108,238,0.4)] transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-2.5 px-4 rounded-xl border border-white/5 transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
