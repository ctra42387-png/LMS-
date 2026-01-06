
import React, { useState, useEffect, useMemo } from 'react';
import { Assignment, Submission, AssignmentType, Question, User, Role, Folder } from '../types';
import { generateAssignmentContent } from '../services/geminiService';
import { KHTN_CURRICULUM } from '../constants/curriculum';

interface TeacherDashboardProps {
  assignments: Assignment[];
  submissions: Submission[];
  folders: Folder[];
  onAddAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onAddFolder: (folder: Folder) => void;
  onRefresh: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  assignments, 
  submissions, 
  folders,
  onAddAssignment,
  onDeleteAssignment,
  onAddFolder,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'students'>('assignments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCurriculumSelector, setShowCurriculumSelector] = useState(false);
  const [activeGradeTab, setActiveGradeTab] = useState<'6' | '7' | '8' | '9'>('6');
  const [registeredStudents, setRegisteredStudents] = useState<User[]>([]);
  
  // Quản lý thư mục
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    const usersJson = localStorage.getItem('khtn_users_v2');
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      setRegisteredStudents(users.filter(u => u.role === Role.STUDENT));
    }
  }, [activeTab]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '6' as '6' | '7' | '8' | '9',
    type: AssignmentType.HYBRID, 
    rubric: '',
    mcqCount: 10,
    essayCount: 2,
    questions: [] as Question[],
    folderId: ''
  });

  const handleSelectLesson = (lessonTitle: string, grade: string) => {
    setFormData(prev => ({ ...prev, title: lessonTitle, grade: grade as any }));
    setShowCurriculumSelector(false);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName.trim(),
      grade: activeGradeTab
    };
    onAddFolder(newFolder);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Thầy cô có chắc chắn muốn xóa học sinh này khỏi hệ thống? Học sinh sẽ không thể đăng nhập được nữa.')) {
      const usersJson = localStorage.getItem('khtn_users_v2');
      if (usersJson) {
        const users: User[] = JSON.parse(usersJson);
        const updatedUsers = users.filter(u => u.id !== studentId);
        localStorage.setItem('khtn_users_v2', JSON.stringify(updatedUsers));
        setRegisteredStudents(updatedUsers.filter(u => u.role === Role.STUDENT));
      }
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title) { alert("Thầy cô hãy chọn một bài học trong thư viện trước nhé!"); return; }
    setIsGenerating(true);
    try {
      const content = await generateAssignmentContent(
        formData.title, formData.grade, formData.type, formData.mcqCount, formData.essayCount
      );
      setFormData(prev => ({ ...prev, description: content.description, rubric: content.rubric, questions: content.questions }));
    } catch (err) {
      alert("AI đang bận, thầy cô thử lại sau vài giây nhé!");
    } finally { setIsGenerating(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.rubric) {
      alert("Vui lòng nhập đủ thông tin bài tập!"); return;
    }

    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      grade: formData.grade,
      subject: 'KHTN',
      type: formData.type,
      rubric: formData.rubric,
      questions: formData.questions,
      createdAt: Date.now(),
      folderId: formData.folderId || undefined
    };
    onAddAssignment(newAssignment);
    setIsModalOpen(false);
    setFormData({ title: '', description: '', grade: '6', type: AssignmentType.HYBRID, rubric: '', mcqCount: 10, essayCount: 2, questions: [], folderId: '' });
  };

  const filteredAssignments = useMemo(() => {
    let list = assignments;
    if (selectedFolderId !== 'all') {
      list = list.filter(a => a.folderId === selectedFolderId);
    }
    return list;
  }, [assignments, selectedFolderId]);

  const filteredSubmissions = submissions.filter(s => s.assignmentId === selectedAssignmentId);
  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId);

  const formatDateTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] shadow-[0_15px_30px_rgba(79,70,229,0.3)] flex items-center justify-center text-white border border-white/10">
              <i className={`fas ${activeTab === 'assignments' ? 'fa-microscope' : 'fa-users'} text-3xl`}></i>
           </div>
           <div>
              <h2 className="text-3xl font-black text-white tracking-tight text-glow">
                {activeTab === 'assignments' ? 'Trạm Quản lý Nhiệm vụ' : 'Học sinh & Lớp học'}
              </h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Hệ thống giáo dục KHTN</p>
           </div>
        </div>
        
        <div className="flex gap-4 p-2 glass rounded-[2.2rem] border-white/5">
          <button 
            onClick={() => { setActiveTab('assignments'); setSelectedAssignmentId(null); }}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'assignments' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Bài tập
          </button>
          <button 
            onClick={() => { setActiveTab('students'); setSelectedAssignmentId(null); }}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Học sinh ({registeredStudents.length})
          </button>
        </div>
      </div>

      {activeTab === 'assignments' ? (
        <>
          {/* Toolbar Quản lý Bài tập */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full lg:w-auto custom-scrollbar">
              <button 
                onClick={() => setSelectedFolderId('all')}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-2 ${selectedFolderId === 'all' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-indigo-500/30'}`}
              >
                TẤT CẢ
              </button>
              {folders.map(folder => (
                <button 
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-2 ${selectedFolderId === folder.id ? 'bg-[var(--accent-pink)] border-[var(--accent-pink)] text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-pink-500/30'}`}
                >
                  <i className="fas fa-folder mr-2"></i> {folder.name}
                </button>
              ))}
              <button 
                onClick={() => setIsCreatingFolder(true)}
                className="w-12 h-12 rounded-xl bg-white/5 text-indigo-400 flex items-center justify-center border-2 border-dashed border-white/10 hover:border-indigo-500 hover:text-white transition-all shrink-0"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button 
                onClick={handleRefreshData} 
                disabled={isRefreshing} 
                className="bg-white/5 text-indigo-400 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 hover:bg-[var(--accent-pink)] hover:text-white transition-all flex items-center gap-3 active:scale-95 shadow-lg shadow-indigo-500/5"
              >
                <i className={`fas fa-rotate ${isRefreshing ? 'animate-spin' : ''}`}></i>
                LÀM MỚI BÀI TẬP
              </button>
              {!selectedAssignmentId ? (
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="bg-indigo-600 hover:bg-[var(--accent-pink)] text-white px-8 py-4 rounded-2xl font-black flex items-center shadow-lg text-[10px] uppercase tracking-widest gap-3 transition-all"
                >
                  <i className="fas fa-plus-circle"></i> THIẾT KẾ MỚI
                </button>
              ) : (
                <button onClick={() => setSelectedAssignmentId(null)} className="bg-white/5 text-slate-300 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 transition-all hover:bg-white/10"><i className="fas fa-chevron-left mr-2"></i> DANH SÁCH</button>
              )}
            </div>
          </div>

          {!selectedAssignmentId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map(assign => (
                <div key={assign.id} className="glass p-8 rounded-[2.5rem] border-2 border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group relative overflow-hidden" onClick={() => setSelectedAssignmentId(assign.id)}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-2">
                       <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 text-indigo-400 border border-white/5">Lớp {assign.grade}</span>
                       {assign.folderId && (
                         <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-pink-500/10 text-pink-400 border border-pink-500/20">
                            <i className="fas fa-folder mr-1"></i> {folders.find(f => f.id === assign.folderId)?.name}
                         </span>
                       )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteAssignment(assign.id); }} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all bg-white/5"><i className="fas fa-trash-alt text-xs"></i></button>
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 line-clamp-2">{assign.title}</h3>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black text-indigo-400">{submissions.filter(s => s.assignmentId === assign.id).length} bài nộp</span>
                    <i className="fas fa-arrow-right text-slate-700 group-hover:text-indigo-400 transition-all group-hover:translate-x-1"></i>
                  </div>
                </div>
              ))}
              {filteredAssignments.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-30 grayscale italic text-slate-400 font-bold border-2 border-dashed border-white/5 rounded-[3rem]">
                   Chưa có bài tập nào trong nhóm này.
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fadeIn space-y-8">
              <div className="glass p-10 md:p-14 rounded-[3.5rem] border border-white/10">
                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5">
                   <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl"><i className="fas fa-file-invoice text-2xl"></i></div>
                   <div>
                      <h3 className="text-3xl font-black text-white tracking-tight">{selectedAssignment?.title}</h3>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Lớp {selectedAssignment?.grade} {selectedAssignment?.folderId && ` • Thư mục: ${folders.find(f => f.id === selectedAssignment.folderId)?.name}`}</p>
                   </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-12">
                   <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 whitespace-pre-wrap text-[15px] text-slate-300 leading-relaxed font-bold shadow-inner max-h-[400px] overflow-y-auto custom-scrollbar">
                     {selectedAssignment?.description}
                   </div>
                   <div className="p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 whitespace-pre-wrap text-[15px] text-indigo-200/80 italic font-bold shadow-inner max-h-[400px] overflow-y-auto custom-scrollbar">
                     {selectedAssignment?.rubric}
                   </div>
                </div>
              </div>
              
              <div className="glass rounded-[3rem] border border-white/10 overflow-hidden">
                 <div className="p-8 border-b border-white/5 bg-slate-950/20">
                    <h4 className="font-black text-white text-lg uppercase tracking-widest">Bài nộp của học sinh</h4>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-slate-950/40 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <tr>
                             <th className="px-12 py-6 text-left">Học sinh</th>
                             <th className="px-12 py-6 text-center">Thời gian</th>
                             <th className="px-12 py-6 text-center">Điểm AI</th>
                             <th className="px-12 py-6 text-right">Chi tiết</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {filteredSubmissions.map(sub => (
                            <tr key={sub.id} className="hover:bg-white/5">
                               <td className="px-12 py-6 font-black text-slate-300 uppercase tracking-tight">{sub.studentName}</td>
                               <td className="px-12 py-6 text-center text-slate-500 text-xs">{formatDateTime(sub.timestamp)}</td>
                               <td className="px-12 py-6 text-center font-black text-2xl text-indigo-400 text-glow">{sub.result?.score ?? '-'}</td>
                               <td className="px-12 py-6 text-right">
                                  <button onClick={() => setSelectedSubmission(sub)} className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 text-indigo-400 transition-all hover:bg-[var(--accent-pink)] hover:text-white">
                                    <i className="fas fa-eye"></i>
                                  </button>
                               </td>
                            </tr>
                          ))}
                          {filteredSubmissions.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-12 text-center text-slate-600 font-bold italic uppercase tracking-widest text-xs">Chưa có học sinh nào nộp bài</td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="animate-fadeIn glass rounded-[3.5rem] border border-white/10 overflow-hidden p-8 md:p-14">
           <h4 className="font-black text-white text-xl uppercase tracking-widest mb-10">Danh sách học sinh đã kích hoạt</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredStudents.map(student => (
                <div key={student.id} className="bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-5 hover:border-indigo-500/30 transition-all group">
                   <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {student.name.charAt(0).toUpperCase()}
                   </div>
                   <div className="flex-grow">
                      <h5 className="text-base font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{student.name}</h5>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Lớp: {student.className || 'Chưa cập nhật'}</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all border border-white/10"
                        title="Xóa học sinh"
                      >
                         <i className="fas fa-trash-can text-sm"></i>
                      </button>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                         <i className="fas fa-check-circle text-sm"></i>
                      </div>
                   </div>
                </div>
              ))}
              {registeredStudents.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-30 grayscale italic text-slate-400 font-bold border-2 border-dashed border-white/5 rounded-[3rem]">
                   Chưa có học sinh nào đăng ký.
                </div>
              )}
           </div>
        </div>
      )}

      {/* Modal: Tạo thư mục mới */}
      {isCreatingFolder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[250] flex items-center justify-center p-4">
          <div className="glass p-10 rounded-[2.5rem] w-full max-w-md border border-white/10">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Tạo thư mục mới</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={newFolderName} 
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Tên thư mục (VD: Chương 1, Kiểm tra...)" 
                className="w-full bg-slate-950 border-2 border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500"
              />
              <div className="flex gap-3">
                <button onClick={() => setIsCreatingFolder(false)} className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Hủy</button>
                <button onClick={handleCreateFolder} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Thiết kế nhiệm vụ mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
          <div className="glass rounded-[3.5rem] w-full max-w-6xl max-h-[92vh] overflow-hidden border border-white/10 flex flex-col">
            <div className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center bg-slate-950/30">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl animate-float"><i className="fas fa-feather-pointed text-3xl"></i></div>
                <h3 className="text-3xl font-black text-white tracking-tight">Thiết kế Nhiệm vụ mới</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-full bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-slate-500 border border-white/5 transition-all"><i className="fas fa-times text-xl"></i></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12 overflow-y-auto custom-scrollbar flex-grow bg-[#080c1d]/50">
              <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 block">1. Tên bài học / Chủ đề</label>
                  <div className="flex gap-4">
                    <input type="text" required className="flex-grow bg-slate-950/50 border-2 border-white/5 rounded-[2rem] px-8 py-5 outline-none focus:border-indigo-500 text-lg text-white font-bold" placeholder="VD: Oxygen. Không khí" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <button 
                      type="button" 
                      onClick={() => setShowCurriculumSelector(true)} 
                      className="w-20 bg-indigo-600/10 text-indigo-400 rounded-[2rem] flex items-center justify-center border border-indigo-500/20 active:scale-95 transition-all hover:bg-[var(--accent-pink)] hover:text-white"
                    >
                      <i className="fas fa-layer-group text-2xl"></i>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 block">2. Nhóm thư mục</label>
                  <select 
                    className="w-full bg-slate-950 border-2 border-white/5 rounded-[2rem] px-8 py-5 outline-none focus:border-indigo-500 font-black text-white" 
                    value={formData.folderId} 
                    onChange={e => setFormData({...formData, folderId: e.target.value})}
                  >
                    <option value="">Không có thư mục</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 block">3. Khối lớp</label>
                    <select className="w-full mt-2 bg-slate-950 border-2 border-white/5 rounded-[2rem] px-8 py-5 outline-none focus:border-indigo-500 font-black text-white" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value as any})}>
                      <option value="6">Lớp 6</option><option value="7">Lớp 7</option><option value="8">Lớp 8</option><option value="9">Lớp 9</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 block">4. Trạng thái</label>
                    <div className="bg-emerald-500/5 text-emerald-400 p-5 rounded-[2rem] font-black text-[11px] flex items-center justify-center border border-emerald-500/10 mt-2 uppercase">HỆ THỐNG SẴN SÀNG TIẾP NHẬN</div>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/80 to-indigo-950/80 p-12 rounded-[4rem] text-white relative overflow-hidden group border border-white/10">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="space-y-5">
                    <h4 className="text-4xl font-black tracking-tighter leading-none">Phát hành bài giảng cùng AI?</h4>
                    <p className="text-blue-100/60 font-medium max-w-lg leading-relaxed">AI sẽ tạo đề thi, đáp án và nhận xét mẫu chuẩn chương trình mới.</p>
                  </div>
                  <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="px-12 py-7 bg-white text-indigo-900 rounded-[2.5rem] font-black text-lg transition-all hover:scale-[1.05] hover:bg-[var(--accent-pink)] hover:text-white active:scale-95 flex items-center gap-5">
                    {isGenerating ? <div className="w-6 h-6 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-sparkles text-amber-500"></i>}
                    {isGenerating ? 'ĐANG KHỞI TẠO...' : 'KÍCH HOẠT AI'}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <textarea required rows={8} className="w-full bg-slate-950/50 border-2 border-white/5 rounded-[3rem] px-10 py-10 outline-none focus:border-indigo-500 text-slate-200 font-bold" placeholder="Nội dung đề bài chi tiết..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <textarea required rows={8} className="w-full bg-indigo-500/5 border-2 border-indigo-500/10 rounded-[3rem] px-10 py-10 outline-none focus:border-indigo-500 text-indigo-300 italic font-bold" placeholder="Đáp án & Rubric chấm điểm..." value={formData.rubric} onChange={e => setFormData({...formData, rubric: e.target.value})} />
              </div>

              <div className="pt-10 flex flex-col md:flex-row justify-end gap-6">
                <button type="submit" className="px-20 py-7 bg-indigo-600 hover:bg-[var(--accent-pink)] text-white font-black rounded-[2rem] shadow-2xl uppercase text-base tracking-[0.2em] active:scale-95 transition-all">PHÁT HÀNH NHIỆM VỤ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Thư viện chọn bài học */}
      {showCurriculumSelector && (
        <div className="fixed inset-0 bg-slate-950/95 z-[300] flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass rounded-[3.5rem] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.2)]">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-950/30">
               <div>
                 <h3 className="text-2xl font-black text-white tracking-tight uppercase">Thư viện KHTN 2018</h3>
                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Hệ thống bài giảng chuẩn</p>
               </div>
               <button onClick={() => setShowCurriculumSelector(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors"><i className="fas fa-times"></i></button>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-10">
               <div className="flex gap-3 justify-center">
                  {['6', '7', '8', '9'].map(g => (
                    <button key={g} onClick={() => setActiveGradeTab(g as any)} className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${activeGradeTab === g ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-[var(--accent-pink)] hover:text-white'}`}>KHỐI {g}</button>
                  ))}
               </div>
               
               <div className="space-y-8">
                 {KHTN_CURRICULUM[activeGradeTab].map((chapter, idx) => (
                   <div key={idx} className="space-y-4">
                      <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 border-l-4 border-indigo-600 pl-4">{chapter.title}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {chapter.lessons.map(lesson => (
                           <button key={lesson.id} onClick={() => handleSelectLesson(lesson.title, activeGradeTab)} className="text-left p-6 bg-white/5 hover:bg-[var(--accent-pink)] border border-white/5 hover:border-transparent rounded-2xl transition-all group">
                             <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{lesson.title}</p>
                           </button>
                         ))}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xem chi tiết bài nộp */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-950/95 z-[400] flex items-center justify-center p-4 md:p-10 animate-scaleUp">
           <div className="glass rounded-[4rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10 shadow-[0_0_150px_rgba(79,70,229,0.3)]">
              <div className="bg-indigo-600 p-12 text-white relative flex justify-between items-center overflow-hidden">
                 <div className="relative z-10">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] bg-black/20 px-4 py-1.5 rounded-full border border-white/10">{selectedSubmission.result?.level}</span>
                    <h3 className="text-4xl font-black tracking-tighter mt-4">{selectedSubmission.studentName}</h3>
                    <p className="text-indigo-100/60 font-bold uppercase text-[10px] tracking-widest mt-1">Bài làm: {selectedAssignment?.title}</p>
                 </div>
                 <div className="bg-black/20 p-8 rounded-[3rem] border border-white/10 text-center relative z-10">
                    <span className="block text-6xl font-black text-glow">{selectedSubmission.result?.score}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">ĐIỂM SỐ AI</span>
                 </div>
                 <button onClick={() => setSelectedSubmission(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/20 flex items-center justify-center hover:bg-rose-500 transition-all z-20"><i className="fas fa-times"></i></button>
                 <div className="absolute top-0 right-0 p-10 opacity-10 text-[20rem] -rotate-12 pointer-events-none z-0"><i className="fas fa-file-signature"></i></div>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar p-12 bg-slate-950/30 space-y-10">
                 <div className="bg-indigo-600/5 p-10 rounded-[3rem] border border-indigo-500/10">
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Nhận xét chi tiết</h5>
                    <p className="text-slate-300 italic font-bold leading-relaxed">“{selectedSubmission.result?.studentFeedback.suggestions}”</p>
                 </div>
                 <div className="mt-10 flex justify-center">
                    <button onClick={() => setSelectedSubmission(null)} className="px-16 py-6 bg-white hover:bg-[var(--accent-pink)] hover:text-white text-slate-950 rounded-2xl font-black text-base transition-all uppercase tracking-widest shadow-2xl">Hoàn tất kiểm tra</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
