import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await userAPI.login(username, password);
        login(response.data);
        navigate('/chat');
      } else {
        await userAPI.register(username, password);
        const loginResponse = await userAPI.login(username, password);
        login(loginResponse.data);
        navigate('/chat');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Morphing Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/30 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob-delayed"></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob-reverse"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Glass Card */}
        <div className="glass-card w-full max-w-[440px] rounded-2xl p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          {/* Header Section */}
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <div className="relative w-16 h-16 mb-2 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">stream</span>
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10 animate-pulse-slow"></div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Nexus Chat</h1>
            <p className="text-slate-400 text-sm font-medium">Secure access to the neural stream</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            {/* Username Field */}
            <div className="flex flex-col gap-2 group/input">
              <label className="text-slate-300 text-xs font-bold uppercase tracking-wider pl-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within/input:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 outline-none focus:ring-0 text-sm font-medium"
                  placeholder="Enter your ID"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2 group/input">
              <div className="flex justify-between items-center px-1">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within/input:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-slate-500 outline-none focus:ring-0 text-sm font-medium"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-white cursor-pointer transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="liquid-button relative mt-4 w-full h-12 rounded-xl text-white font-bold text-base tracking-wide shadow-[0_0_20px_rgba(43,108,238,0.3)] hover:shadow-[0_0_30px_rgba(43,108,238,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Processing...' : isLogin ? 'Get Started' : 'Create Account'}
                <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-2">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                className="text-white hover:text-primary transition-colors font-semibold ml-1"
                onClick={() => setIsLogin(!isLogin)}
                type="button"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute bottom-10 right-10 flex gap-2 opacity-50">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
