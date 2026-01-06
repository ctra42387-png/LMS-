
import React, { useState, useMemo, useEffect } from 'react';
import { Assignment, Submission, GradingResult, User, Question, QuestionResult } from '../types';
import { gradeStudentWork } from '../services/geminiService';

interface StudentDashboardProps {
  user: User;
  assignments: Assignment[];
  submissions: Submission[];
  onAddSubmission: (submission: Submission) => void;
  onUpdateSubmission: (submission: Submission) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, assignments, submissions, onAddSubmission, onUpdateSubmission }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [showResult, setShowResult] = useState<GradingResult | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [onlineAnswers, setOnlineAnswers] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string, result: GradingResult } | null>(null);
  
  // State for showing specific question explanation
  const [selectedQuestionDetail, setSelectedQuestionDetail] = useState<string | null>(null);

  // Tự động xác định khối lớp từ className của học sinh (Ví dụ: "6/1" -> "6")
  const studentGrade = useMemo(() => {
    if (user.className) {
      const match = user.className.match(/[6789]/);
      return match ? (match[0] as '6' | '7' | '8' | '9') : '6';
    }
    return '6';
  }, [user.className]);

  // CHỈ lọc bài tập thuộc khối lớp của học sinh
  const filteredAssignments = useMemo(() => 
    assignments.filter(a => a.grade === studentGrade), 
    [assignments, studentGrade]
  );

  // Auto-hide notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getGradeTheme = (grade: string) => {
    switch(grade) {
      case '6': return { color: 'emerald', icon: 'fa-leaf' };
      case '7': return { color: 'amber', icon: 'fa-bolt' };
      case '8': return { color: 'indigo', icon: 'fa-vial' };
      case '9': return { color: 'blue', icon: 'fa-user-astronaut' };
      default: return { color: 'slate', icon: 'fa-book' };
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Biết': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Hiểu': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Vận dụng': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Vận dụng cao': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const handleOptionSelect = (qId: string, option: string) => {
    setOnlineAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleTextChange = (qId: string, text: string) => {
    setOnlineAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const currentSubmission = useMemo(() => {
    if (!selectedAssignment) return null;
    return submissions.find(s => s.assignmentId === selectedAssignment.id && s.studentId === user.id);
  }, [selectedAssignment, submissions, user.id]);

  const handleConfirmSubmission = async () => {
    if (!selectedAssignment || currentSubmission) return;
    const base64Image = previewImage;
    setPreviewImage(null);
    setIsUploading(true);
    setLoadingStep('KHỞI ĐỘNG AI...');

    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      assignmentId: selectedAssignment.id,
      studentId: user.id,
      studentName: user.name,
      imageUrl: base64Image || '',
      status: 'pending',
      onlineAnswers,
      timestamp: Date.now()
    };
    onAddSubmission(newSubmission);

    try {
      setTimeout(() => setLoadingStep('PHÂN TÍCH BÀI LÀM...'), 1200);
      const result = await gradeStudentWork(base64Image, selectedAssignment, onlineAnswers);
      onUpdateSubmission({ ...newSubmission, status: 'graded', result });
      
      setNotification({
        message: `Nhiệm vụ "${selectedAssignment.title}" đã được chấm điểm!`,
        result: result
      });
      
    } catch (err) {
      onUpdateSubmission({ ...newSubmission, status: 'error' });
      alert("AI đang bảo trì hệ thống, em hãy thử lại sau nhé!");
    } finally {
      setIsUploading(false);
      setLoadingStep('');
    }
  };

  const activeQuestionDetail = useMemo(() => {
    if (!selectedQuestionDetail || !showResult) return null;
    const res = showResult.questionResults.find(r => r.questionId === selectedQuestionDetail);
    const q = selectedAssignment?.questions?.find(item => item.id === selectedQuestionDetail);
    return { res, q };
  }, [selectedQuestionDetail, showResult, selectedAssignment]);

  const getMedalInfo = (score: number) => {
    if (score >= 9) return { 
      type: 'DIAMOND', label: 'Hạng Kim Cương', icon: 'fa-gem', 
      color: 'from-cyan-400 via-white to-blue-500', 
      glow: 'shadow-[0_0_50px_rgba(34,211,238,0.5)]',
      msg: 'Em là một thiên tài KHTN thực thụ!'
    };
    if (score >= 8) return { 
      type: 'GOLD', label: 'Hạng Vàng', icon: 'fa-award', 
      color: 'from-amber-300 via-yellow-500 to-orange-500', 
      glow: 'shadow-[0_0_50px_rgba(245,158,11,0.5)]',
      msg: 'Kiến thức của em rất vững chắc!'
    };
    if (score >= 6.5) return { 
      type: 'SILVER', label: 'Hạng Bạc', icon: 'fa-medal', 
      color: 'from-slate-300 via-slate-100 to-slate-400', 
      glow: 'shadow-[0_0_30px_rgba(203,213,225,0.4)]',
      msg: 'Một nỗ lực rất đáng khen ngợi!'
    };
    return { 
      type: 'BRONZE', label: 'Hạng Đồng', icon: 'fa-shield-halved', 
      color: 'from-orange-700 via-orange-500 to-amber-900', 
      glow: 'shadow-[0_0_20px_rgba(154,52,18,0.3)]',
      msg: 'Cố gắng lên, em sẽ làm tốt hơn ở lần sau!'
    };
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto animate-fadeIn relative">
      
      {notification && (
        <div 
          onClick={() => { setShowResult(notification.result); setNotification(null); }}
          className="fixed bottom-10 right-4 md:right-10 z-[300] max-w-sm w-full animate-slideUp cursor-pointer group"
        >
          <div className="glass p-5 rounded-[2rem] border-2 border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 hover:border-indigo-500/60 transition-all bg-slate-900/90 backdrop-blur-3xl">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform">
               <i className="fas fa-bell text-xl"></i>
            </div>
            <div className="flex-grow">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Tin mới từ AI</p>
               <p className="text-xs font-bold text-white leading-tight">{notification.message}</p>
               <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tighter group-hover:text-slate-300">Nhấn để xem kết quả ngay</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setNotification(null); }} className="text-slate-700 hover:text-white transition-colors">
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="glass rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-[12rem] group-hover:scale-110 transition-transform pointer-events-none"><i className="fas fa-atom"></i></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight text-glow">Chào {user.name.split(' ').pop()}! 👋</h2>
            <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest">Học sinh Lớp {user.className} • Khối {studentGrade}</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-950/50 px-6 py-4 rounded-2xl border border-white/5">
             <div className={`w-10 h-10 rounded-xl bg-${getGradeTheme(studentGrade).color}-500/20 flex items-center justify-center text-${getGradeTheme(studentGrade).color}-400`}>
                <i className={`fas ${getGradeTheme(studentGrade).icon} text-xl`}></i>
             </div>
             <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Khu vực dành riêng Khối {studentGrade}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Nhiệm vụ Khối {studentGrade}</h3>
            <span className="bg-white/5 px-3 py-1 rounded-full text-[8px] font-black text-indigo-400">{filteredAssignments.length} BÀI</span>
          </div>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {filteredAssignments.length === 0 ? (
              <div className="glass rounded-[2rem] p-16 text-center border-dashed border-white/10 opacity-30">
                <i className="fas fa-ghost text-4xl mb-4"></i>
                <p className="text-xs font-black uppercase tracking-widest">Chưa có nhiệm vụ cho Khối {studentGrade}</p>
              </div>
            ) : (
              filteredAssignments.map(assign => {
                const latestSub = submissions.find(s => s.assignmentId === assign.id && s.studentId === user.id);
                const theme = getGradeTheme(assign.grade);
                const isSelected = selectedAssignment?.id === assign.id;

                let statusBadge = (
                  <span className="px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter bg-slate-500/10 text-slate-500 border border-white/5">MỚI</span>
                );

                if (latestSub?.status === 'graded') {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ĐÃ CHẤM</span>
                  );
                } else if (latestSub?.status === 'pending') {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <i className="fas fa-spinner animate-spin"></i> ĐANG CHẤM
                    </span>
                  );
                } else if (latestSub?.status === 'error') {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-tighter bg-rose-500/10 text-rose-400 border border-rose-500/20">LỖI CHẤM</span>
                  );
                }

                return (
                  <div 
                    key={assign.id}
                    onClick={() => { setSelectedAssignment(assign); setOnlineAnswers({}); }}
                    className={`glass rounded-[2.2rem] p-6 transition-all duration-300 cursor-pointer border-2 group relative overflow-hidden ${
                      isSelected ? `border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_40px_rgba(79,70,229,0.1)]` : `border-white/5 hover:border-white/10 hover:bg-white/5`
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex-grow min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-3">
                           <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg bg-${theme.color}-500/10 text-${theme.color}-400 border border-${theme.color}-500/20`}>
                             KHTN {assign.grade}
                           </span>
                           {statusBadge}
                        </div>
                        <h4 className={`text-base font-bold truncate transition-colors leading-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>{assign.title}</h4>
                        <p className="text-[9px] font-bold text-slate-600 uppercase mt-2 tracking-widest">{assign.type}</p>
                      </div>
                      
                      <div className="shrink-0 flex items-center gap-3 h-full">
                        {latestSub?.status === 'graded' ? (
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-2xl font-black text-indigo-400 text-glow leading-none">{latestSub.result?.score}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowResult(latestSub.result!);
                                setSelectedQuestionDetail(null);
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-[var(--accent-pink)] text-white rounded-xl text-[7px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                            >
                              KẾT QUẢ
                            </button>
                          </div>
                        ) : latestSub?.status === 'pending' ? (
                          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                        ) : latestSub?.status === 'error' ? (
                          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                            <i className="fas fa-exclamation-triangle text-sm"></i>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-slate-700 group-hover:text-indigo-400 transition-colors border border-white/5">
                            <i className="fas fa-chevron-right text-xs"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass rounded-[3rem] p-8 md:p-12 border-white/5 h-full min-h-[500px] flex flex-col relative overflow-hidden">
            {!selectedAssignment ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <i className="fas fa-satellite-dish text-5xl"></i>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.4em]">Chọn nhiệm vụ Khối {studentGrade} để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn h-full flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_15px_30px_rgba(79,70,229,0.3)] shrink-0">
                         <i className={`fas ${getGradeTheme(selectedAssignment.grade).icon} text-2xl`}></i>
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-2xl font-black text-white leading-tight tracking-tight">{selectedAssignment.title}</h4>
                         <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                           {currentSubmission?.status === 'graded' ? 'Đã hoàn thành' : currentSubmission?.status === 'pending' ? 'Đang chờ AI chấm...' : currentSubmission?.status === 'error' ? 'Lỗi hệ thống' : `Chế độ học tập Khối ${studentGrade}`}
                         </p>
                      </div>
                   </div>
                   {!currentSubmission && (
                     <button 
                      onClick={handleConfirmSubmission}
                      disabled={isUploading}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50"
                     >
                       Nộp bài trực tiếp
                     </button>
                   )}
                </div>

                <div className="flex-grow space-y-8 overflow-y-auto custom-scrollbar pr-4">
                  {currentSubmission?.status === 'graded' ? (
                    <div className="space-y-10 animate-slideUp">
                       <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-900/40">
                             <i className="fas fa-check-double text-3xl"></i>
                          </div>
                          <h4 className="text-2xl font-black text-white uppercase tracking-tight">Hoàn thành bài làm!</h4>
                          <button 
                            onClick={() => { setShowResult(currentSubmission.result!); setSelectedQuestionDetail(null); }}
                            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                          >
                            XEM LẠI KẾT QUẢ
                          </button>
                       </div>

                       <div className="grid grid-cols-3 gap-6">
                          <div className="glass p-8 rounded-[2rem] text-center border-white/5">
                             <span className="block text-4xl font-black text-indigo-400 text-glow">{currentSubmission.result?.score}</span>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 block">ĐIỂM</span>
                          </div>
                          <div className="glass p-8 rounded-[2rem] text-center border-white/5">
                             <span className="block text-xl font-black text-emerald-400 uppercase leading-none">{currentSubmission.result?.level}</span>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 block">LOẠI</span>
                          </div>
                          <div className="glass p-8 rounded-[2rem] text-center border-white/5">
                             <span className="block text-xl font-black text-white uppercase leading-none">{currentSubmission.result?.teacherReport.accuracyRate}</span>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 block">ĐÚNG</span>
                          </div>
                       </div>
                    </div>
                  ) : currentSubmission?.status === 'pending' ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-12 space-y-6">
                       <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                       <h4 className="text-xl font-black text-white uppercase tracking-tighter">AI đang chấm bài...</h4>
                       <p className="text-slate-500 font-bold italic text-sm">{loadingStep || 'Xin vui lòng chờ giây lát'}</p>
                    </div>
                  ) : currentSubmission?.status === 'error' ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-12 space-y-6">
                       <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/20">
                          <i className="fas fa-triangle-exclamation text-3xl"></i>
                       </div>
                       <h4 className="text-xl font-black text-white uppercase tracking-tighter">Rất tiếc, đã có lỗi xảy ra</h4>
                       <p className="text-slate-400 font-bold max-w-md">Quá trình chấm bài bằng AI gặp sự cố. Em hãy thử tải lại trang hoặc nộp lại bài sau ít phút nhé.</p>
                       <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest"
                       >
                         TẢI LẠI TRANG
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {selectedAssignment.questions && selectedAssignment.questions.length > 0 && (
                        <div className="space-y-10">
                           <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3">
                             <i className="fas fa-clipboard-list"></i> Nội dung nhiệm vụ
                           </h5>
                           <div className="grid gap-8">
                             {selectedAssignment.questions.map((q, idx) => (
                               <div key={q.id} className="bg-slate-950/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden hover:bg-slate-900/40 transition-all duration-300">
                                  <div className="flex items-start justify-between gap-4">
                                     <div className="flex items-start gap-4">
                                        <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black shrink-0 text-sm shadow-lg">{idx+1}</span>
                                        <p className="text-lg font-bold text-slate-200 leading-relaxed pt-1">{q.text}</p>
                                     </div>
                                     <span className={`shrink-0 px-2 py-1 rounded text-[7px] font-black uppercase border ${getLevelColor(q.level)}`}>
                                       {q.level}
                                     </span>
                                  </div>
                                  
                                  {q.type === 'mcq' && q.options && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-14">
                                       {q.options.map((opt) => {
                                         const isSelected = onlineAnswers[q.id] === opt;
                                         return (
                                           <button
                                             key={opt}
                                             onClick={() => handleOptionSelect(q.id, opt)}
                                             className={`text-left p-5 rounded-[1.8rem] border-2 transition-all duration-300 font-bold text-base relative group ${
                                               isSelected 
                                                 ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                                                 : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:bg-white/10'
                                             }`}
                                           >
                                             <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-indigo-400 bg-indigo-400' : 'border-slate-800'}`}>
                                               {isSelected && <i className="fas fa-check text-[10px] text-white"></i>}
                                             </div>
                                             <span className="pr-8">{opt}</span>
                                           </button>
                                         );
                                       })}
                                    </div>
                                  )}
                                  
                                  {q.type === 'essay' && (
                                    <div className="pl-14 space-y-4">
                                       <textarea 
                                        className="w-full bg-slate-900/50 border-2 border-white/5 rounded-[2rem] p-6 outline-none focus:border-indigo-500 text-white font-bold text-base min-h-[150px]"
                                        placeholder="Nhập câu trả lời của em..."
                                        value={onlineAnswers[q.id] || ''}
                                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                                       />
                                    </div>
                                  )}
                               </div>
                             ))}
                           </div>
                        </div>
                      )}

                      <div className="pt-10 border-t border-white/5 space-y-6">
                        <h5 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-3">
                          <i className="fas fa-camera"></i> Ảnh chụp bài làm (tùy chọn)
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <label className="relative block group cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all">
                            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                            <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                              <i className="fas fa-camera text-2xl text-slate-700 mb-4"></i>
                              <h5 className="text-sm font-black text-white uppercase">Chụp ảnh bài làm</h5>
                            </div>
                          </label>
                          {previewImage && (
                            <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-indigo-500/30 animate-scaleUp">
                              <img src={previewImage} className="w-full h-full object-cover" />
                              <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl"><i className="fas fa-trash"></i></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showResult && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-3xl z-[200] flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0a0f1e] w-full max-w-5xl rounded-[3.5rem] shadow-[0_0_100px_rgba(79,70,229,0.2)] animate-scaleUp overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
            <div className={`bg-gradient-to-r ${getMedalInfo(showResult.score).color} p-10 md:p-14 text-white relative`}>
               <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                 <div className="space-y-4 text-center md:text-left flex-grow">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] bg-black/30 px-5 py-2 rounded-full border border-white/10">{showResult.level}</span>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-glow">{showResult.assignmentInfo.topic}</h3>
                    <p className="text-sm font-bold text-white/80 italic">{getMedalInfo(showResult.score).msg}</p>
                 </div>
                 <div className={`flex flex-col items-center bg-black/20 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl ${getMedalInfo(showResult.score).glow}`}>
                    <span className="text-7xl font-black tracking-tighter text-glow leading-none">{showResult.score}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mt-2">ĐIỂM TỔNG</span>
                 </div>
               </div>
            </div>

            <div className="p-8 md:p-14 pt-10 overflow-y-auto space-y-10 custom-scrollbar flex-grow bg-slate-950/30">
               <div className="space-y-6">
                  <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Phân tích chi tiết</h5>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {showResult.questionResults.map((qr, idx) => (
                      <div 
                        key={qr.questionId} 
                        onClick={() => setSelectedQuestionDetail(selectedQuestionDetail === qr.questionId ? null : qr.questionId)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:scale-110 ${
                          qr.status === 'correct' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                        } ${selectedQuestionDetail === qr.questionId ? 'ring-2 ring-indigo-500' : ''}`}
                      >
                         <span className="text-[9px] font-black opacity-50">{idx + 1}</span>
                         <i className={`fas ${qr.status === 'correct' ? 'fa-check' : 'fa-xmark'}`}></i>
                      </div>
                    ))}
                  </div>
               </div>

               {activeQuestionDetail && (
                 <div className="animate-scaleUp bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-[2.5rem] relative">
                    <h6 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Giải thích từ AI</h6>
                    <p className="text-base font-bold text-white mb-4">{activeQuestionDetail.q?.text}</p>
                    <p className="text-sm text-slate-300 font-bold italic">“{activeQuestionDetail.res?.shortExplanation}”</p>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2.5rem]">
                     <h5 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-6">Ưu điểm</h5>
                     <div className="space-y-4">
                       {showResult.studentFeedback.pros.map((p, i) => (
                         <div key={i} className="flex items-start gap-4">
                           <i className="fas fa-check text-emerald-500 mt-1"></i>
                           <p className="text-sm text-emerald-100/90 font-bold">{p}</p>
                         </div>
                       ))}
                     </div>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 p-8 rounded-[2.5rem]">
                     <h5 className="text-[11px] font-black text-amber-400 uppercase tracking-[0.3em] mb-6">Cần chú ý</h5>
                     <div className="space-y-4">
                       {showResult.studentFeedback.cons.map((c, i) => (
                         <div key={i} className="flex items-start gap-4">
                           <i className="fas fa-arrow-right text-amber-500 mt-1"></i>
                           <p className="text-sm text-amber-100/90 font-bold">{c}</p>
                         </div>
                       ))}
                     </div>
                  </div>
               </div>

               <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2.5rem]">
                  <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Lời khuyên AI</h5>
                  <p className="text-lg text-slate-200 font-black italic">“{showResult.studentFeedback.suggestions}”</p>
               </div>

               <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button onClick={() => setShowResult(null)} className="flex-grow py-6 bg-white text-slate-950 rounded-2xl font-black text-base uppercase tracking-widest transition-all hover:bg-slate-100">
                    ĐÓNG
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
