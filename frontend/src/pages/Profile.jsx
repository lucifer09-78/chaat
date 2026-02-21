import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await userAPI.updateUser(
        user.id,
        username !== user.username ? username : null,
        password || null
      );
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userAPI.deleteUser(user.id);
      logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob bg-primary w-[500px] h-[500px] top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="liquid-blob bg-purple-600 w-[400px] h-[400px] bottom-[-50px] right-[-50px] opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Chat
          </button>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-[0_0_30px_rgba(43,108,238,0.5)]">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p className="text-slate-400 text-sm">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full glass-input p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">edit</span>
                  <span>Edit Profile</span>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full glass-input p-4 rounded-xl flex items-center justify-between hover:bg-red-500/20 transition-colors text-red-400"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">delete</span>
                  <span>Delete Account</span>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>

              <button
                onClick={logout}
                className="w-full glass-input p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">logout</span>
                  <span>Logout</span>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Enter new username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password (optional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Leave blank to keep current"
                />
              </div>

              {password && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full glass-input p-3 rounded-xl bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setUsername(user?.username || '');
                    setPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="flex-1 glass-input p-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary p-3 rounded-xl hover:bg-blue-600 transition-colors font-medium shadow-[0_0_20px_rgba(43,108,238,0.5)]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card p-6 rounded-2xl max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Delete Account?</h3>
              <p className="text-slate-300 mb-6">
                This action cannot be undone. All your messages, friends, and groups will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 glass-input p-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-500 p-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
