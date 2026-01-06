
import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const isTeacher = user.role === Role.TEACHER;
  const [isLightTheme, setIsLightTheme] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('khtn_theme');
    if (savedTheme === 'light') {
      setIsLightTheme(true);
      document.body.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLightTheme;
    setIsLightTheme(newTheme);
    if (newTheme) {
      document.body.classList.add('light-theme');
      localStorage.setItem('khtn_theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('khtn_theme', 'dark');
    }
  };

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-6xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <i className="fas fa-atom text-xl"></i>
          </div>
          <div className="hidden xs:block">
            <h1 className="font-black text-white text-lg leading-none tracking-tighter">
              SMART <span className="text-indigo-400">KHTN</span>
            </h1>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">Phòng Lab 4.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white/5 text-amber-400 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 shadow-lg active:scale-90"
            title={isLightTheme ? "Chế độ tối" : "Chế độ sáng"}
          >
            <i className={`fas ${isLightTheme ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
          </button>

          <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/10">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm ${
              isTeacher ? 'bg-purple-600' : 'bg-emerald-500'
            }`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col pr-1">
              <span className="text-[10px] font-black text-white tracking-tight truncate max-w-[80px]">
                {user.name.split(' ').pop()?.toUpperCase()}
              </span>
              <span className="text-[7px] font-bold text-slate-400 uppercase">
                {isTeacher ? 'GV' : `Lớp ${user.className}`}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 active:scale-90"
          >
            <i className="fas fa-power-off text-sm"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
