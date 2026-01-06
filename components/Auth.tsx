
import React, { useState, useEffect, useMemo } from 'react';
import { Role, User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [regSuccess, setRegSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    className: '',
    password: '',
    confirmPassword: '',
    adminAccount: ''
  });

  // Hiệu ứng hạt bụi bay trong nền
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      bottom: Math.random() * 100 - 20,
      duration: Math.random() * 10 + 10,
      drift: (Math.random() - 0.5) * 100,
      delay: Math.random() * 10
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Xử lý đăng nhập Giáo viên (Admin)
    if (role === Role.TEACHER) {
      if (formData.adminAccount === 'admin' && formData.password === 'admin') {
        onLogin({ id: 'admin-001', name: 'Admin Giáo Viên', role: Role.TEACHER });
      } else {
        alert("Tài khoản hoặc mật khẩu Quản trị chưa chính xác!");
      }
      return;
    }

    const usersJson = localStorage.getItem('khtn_users_v2');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    if (isLogin) {
      // Logic ĐĂNG NHẬP
      const user = users.find(u => 
        u.name.toLowerCase().trim() === formData.name.toLowerCase().trim() && 
        u.className?.toLowerCase().trim() === formData.className.toLowerCase().trim() && 
        u.password === formData.password
      );
      
      if (user) {
        onLogin(user);
      } else {
        alert("Thông tin đăng nhập chưa chính xác. Em hãy kiểm tra lại Tên, Lớp hoặc Mật khẩu nhé!");
      }
    } else {
      // Logic ĐĂNG KÝ
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu nhập lại không khớp, em hãy kiểm tra lại!");
        return;
      }
      if (formData.name.trim().length < 5) {
        alert("Em hãy nhập đầy đủ Họ và tên (tối thiểu 5 ký tự)!");
        return;
      }

      const isNameTaken = users.some(u => 
        u.name.toLowerCase().trim() === formData.name.toLowerCase().trim() && 
        u.className?.toLowerCase().trim() === formData.className.toLowerCase().trim()
      );

      if (isNameTaken) {
        alert("Tài khoản này đã tồn tại! Em hãy quay lại màn hình Đăng nhập để truy cập nhé.");
        setIsLogin(true);
        return;
      }
      
      const newUser: User = { 
        id: Math.random().toString(36).substr(2,9), 
        name: formData.name.trim(), 
        className: formData.className.trim(), 
        password: formData.password, 
        role: Role.STUDENT 
      };
      
      users.push(newUser);
      localStorage.setItem('khtn_users_v2', JSON.stringify(users));
      
      // Hiển thị trạng thái đăng ký thành công
      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setIsLogin(true);
        // Giữ lại tên và lớp để học sinh chỉ cần nhập mật khẩu để đăng nhập
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }, 3000);
    }
  };

  const inputClasses = "w-full bg-slate-950/70 border-2 border-white/5 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-white text-base placeholder:text-slate-800 shadow-inner";
  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-5 mb-2 block";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Particles */}
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
            width: `${p.size}px`, height: `${p.size}px`, left: `${p.left}%`, bottom: `${p.bottom}%`,
            '--duration': `${p.duration}s`, '--drift': `${p.drift}px`, animationDelay: `${p.delay}s`
          } as React.CSSProperties} />
      ))}

      {/* Success Overlay */}
      {regSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Đăng ký thành công!</h2>
            <p className="text-emerald-400 font-bold text-lg animate-pulse">Đang chuyển sang màn hình Đăng nhập...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl relative animate-fadeIn">
        <div className="absolute top-0 -left-20 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-600/15 blur-[100px] rounded-full"></div>
        
        <div className="glass rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.9)] overflow-hidden border border-white/10 flex flex-col lg:flex-row relative z-10">
          
          <div className="lg:w-5/12 bg-gradient-to-br from-[#0a0f1e] to-[#0d1324] p-12 text-white flex flex-col items-center justify-center relative border-r border-white/5">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-[2.8rem] flex items-center justify-center mb-10 mx-auto shadow-[0_20px_50px_rgba(79,70,229,0.4)] border border-white/20 animate-float">
                <i className="fas fa-microscope text-5xl"></i>
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none text-glow">
                SMART<br/><span className="text-indigo-400">KHTN</span>
              </h1>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] mt-5 text-slate-500 opacity-80">Phòng Lab Kỹ thuật số</p>
              
              <div className="mt-16 space-y-4 hidden lg:block">
                 <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-[1.8rem] border border-white/5 backdrop-blur-md">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <i className="fas fa-bolt-lightning text-amber-400 text-sm"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left">Chấm bài AI siêu tốc</span>
                 </div>
                 <div className="pt-10 flex flex-col items-center">
                   <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/50 border border-white/5">
                     <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white">
                       <i className="fas fa-code"></i>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       Châu Văn Trà
                     </span>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12 p-8 md:p-14 bg-slate-950/40 backdrop-blur-3xl">
            <div className="flex bg-slate-950/80 p-1.5 rounded-[1.8rem] border border-white/5 mb-12 shadow-2xl">
              <button 
                type="button"
                onClick={() => setIsLogin(true)} 
                className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase transition-all tracking-widest ${isLogin ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
              >
                Đăng nhập
              </button>
              <button 
                type="button"
                onClick={() => setIsLogin(false)} 
                className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase transition-all tracking-widest ${!isLogin ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
              >
                Đăng ký
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <button 
                  type="button" 
                  onClick={() => setRole(Role.STUDENT)} 
                  className={`py-7 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 relative group ${role === Role.STUDENT ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' : 'border-white/5 bg-slate-950/50 text-slate-700'}`}
                >
                  <i className="fas fa-user-graduate text-3xl"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Học sinh</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole(Role.TEACHER)} 
                  className={`py-7 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 relative group ${role === Role.TEACHER ? 'border-indigo-500/40 bg-indigo-500/5 text-indigo-400' : 'border-white/5 bg-slate-950/50 text-slate-700'}`}
                >
                  <i className="fas fa-user-tie text-3xl"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Giáo viên</span>
                </button>
              </div>

              <div className="space-y-5 pt-4">
                <div className="relative">
                  <label className={labelClasses}>{role === Role.TEACHER ? 'Tài khoản Quản trị' : 'Họ và tên đầy đủ'}</label>
                  <div className="absolute left-4.5 top-[47px] text-slate-700 z-10">
                    <i className="fas fa-user-circle text-lg"></i>
                  </div>
                  <input 
                    type="text" required 
                    value={role === Role.TEACHER ? formData.adminAccount : formData.name} 
                    onChange={e => setFormData({...formData, [role === Role.TEACHER ? 'adminAccount' : 'name']: e.target.value})} 
                    className={inputClasses} 
                    placeholder={role === Role.TEACHER ? "admin" : "Nguyễn Văn A"} 
                  />
                </div>

                {role === Role.STUDENT && (
                  <div className="relative animate-fadeIn">
                    <label className={labelClasses}>Lớp của em</label>
                    <div className="absolute left-4.5 top-[47px] text-slate-700 z-10">
                      <i className="fas fa-graduation-cap text-lg"></i>
                    </div>
                    <input 
                      type="text" required 
                      value={formData.className} 
                      onChange={e => setFormData({...formData, className: e.target.value})} 
                      className={inputClasses} 
                      placeholder="Ví dụ: 6/1, 7A..." 
                    />
                  </div>
                )}

                <div className="relative">
                  <label className={labelClasses}>Mật khẩu</label>
                  <div className="absolute left-4.5 top-[47px] text-slate-700 z-10">
                    <i className="fas fa-lock text-lg"></i>
                  </div>
                  <input 
                    type="password" required 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className={inputClasses} 
                    placeholder="••••••••" 
                  />
                </div>
                
                {!isLogin && role === Role.STUDENT && (
                  <div className="relative animate-fadeIn">
                    <label className={labelClasses}>Xác thực mật khẩu</label>
                    <div className="absolute left-4.5 top-[47px] text-slate-700 z-10">
                      <i className="fas fa-shield-check text-lg"></i>
                    </div>
                    <input 
                      type="password" required 
                      value={formData.confirmPassword} 
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                      className={inputClasses} 
                      placeholder="Nhập lại mật khẩu" 
                    />
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-base shadow-[0_20px_50px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-all mt-8 uppercase tracking-[0.3em] flex items-center justify-center gap-4"
              >
                <span className="text-glow">{isLogin ? 'ĐĂNG NHẬP NGAY' : 'XÁC NHẬN ĐĂNG KÝ'}</span>
                <i className="fas fa-arrow-right-long text-sm animate-pulse"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
