
import React, { useState, useEffect, useCallback } from 'react';
import { Role, Assignment, Submission, User, Folder } from './types';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Header from './components/Header';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
    const savedAssignments = localStorage.getItem('khtn_assignments_v2');
    const savedSubmissions = localStorage.getItem('khtn_submissions_v2');
    const savedFolders = localStorage.getItem('khtn_folders_v2');
    const savedUser = localStorage.getItem('khtn_current_user');

    if (savedAssignments) {
      try { setAssignments(JSON.parse(savedAssignments)); } catch (e) { console.error(e); }
    }
    
    if (savedSubmissions) {
      try { setSubmissions(JSON.parse(savedSubmissions)); } catch (e) { console.error(e); }
    }

    if (savedFolders) {
      try { setFolders(JSON.parse(savedFolders)); } catch (e) { console.error(e); }
    }
    
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    loadData();
    setIsLoading(false);
  }, [loadData]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('khtn_assignments_v2', JSON.stringify(assignments));
      localStorage.setItem('khtn_submissions_v2', JSON.stringify(submissions));
      localStorage.setItem('khtn_folders_v2', JSON.stringify(folders));
    }
  }, [assignments, submissions, folders, isLoading]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('khtn_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('khtn_current_user');
    setCurrentUser(null);
  };

  const addAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const deleteAssignment = (id: string) => {
    if (window.confirm('Thầy cô có chắc chắn muốn xóa bài tập này? Tất cả bài nộp liên quan cũng sẽ bị xóa.')) {
      setAssignments(prev => prev.filter(a => a.id !== id));
      setSubmissions(prev => prev.filter(s => s.assignmentId !== id));
    }
  };

  const addFolder = (newFolder: Folder) => {
    setFolders(prev => [...prev, newFolder]);
  };

  const addSubmission = (newSubmission: Submission) => {
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const updateSubmission = (updatedSubmission: Submission) => {
    setSubmissions(prev => prev.map(s => s.id === updatedSubmission.id ? updatedSubmission : s));
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 animate-fadeIn relative">
      <Header user={currentUser} onLogout={handleLogout} />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8 max-w-[1400px]">
        {currentUser.role === Role.TEACHER ? (
          <TeacherDashboard 
            assignments={assignments} 
            submissions={submissions}
            folders={folders}
            onAddAssignment={addAssignment}
            onDeleteAssignment={deleteAssignment}
            onAddFolder={addFolder}
            onRefresh={loadData}
          />
        ) : (
          <StudentDashboard 
            user={currentUser}
            assignments={assignments}
            submissions={submissions}
            onAddSubmission={addSubmission}
            onUpdateSubmission={updateSubmission}
          />
        )}
      </main>

      <footer className="bg-slate-900/30 backdrop-blur-md border-t border-white/5 py-8 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
        <div className="container mx-auto px-4">
          <p className="text-gray-300 mb-1">Smart KHTN LMS © 2024</p>
          <p>Ứng dụng Trí tuệ Nhân tạo nâng cao năng lực Khoa học tự nhiên</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
