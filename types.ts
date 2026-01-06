
export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export enum AssignmentType {
  MULTIPLE_CHOICE = 'trắc nghiệm',
  ESSAY = 'tự luận',
  HYBRID = 'trắc nghiệm & tự luận',
  PRACTICAL = 'thực hành/báo cáo'
}

export type QuestionLevel = 'Biết' | 'Hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'essay';
  level: QuestionLevel; // Mức độ nhận thức
  options?: string[]; // Chỉ dành cho trắc nghiệm
  correctAnswer?: string; // Đáp án đúng (A, B, C, D)
}

export interface User {
  id: string;
  name: string;
  className?: string; // Tên lớp cụ thể: 6/1, 7A, 8/2...
  email?: string; 
  role: Role;
  password?: string;
}

export interface Folder {
  id: string;
  name: string;
  grade: '6' | '7' | '8' | '9';
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  questions?: Question[]; // Danh sách câu hỏi có cấu trúc
  grade: '6' | '7' | '8' | '9'; // Khối lớp mục tiêu (để phân loại chung)
  subject: 'KHTN';
  type: AssignmentType;
  rubric: string;
  createdAt: number;
  folderId?: string; // ID của thư mục nhóm bài tập
}

export interface QuestionResult {
  questionId: string;
  status: 'correct' | 'incorrect';
  shortExplanation?: string;
}

export interface GradingResult {
  assignmentInfo: {
    grade: string;
    topic: string;
    type: string;
  };
  score: number;
  level: 'Hoàn thành tốt' | 'Hoàn thành' | 'Chưa hoàn thành';
  integrityCheck: {
    isPlagiarismSuspected: boolean;
    confidence: number;
    reasoning: string;
  };
  questionResults: QuestionResult[];
  studentFeedback: {
    pros: string[];
    cons: string[];
    suggestions: string;
  };
  teacherReport: {
    accuracyRate: string;
    commonMistakes: string[];
    teachingSuggestions: string;
  };
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  imageUrl: string;
  status: 'pending' | 'graded' | 'error';
  result?: GradingResult;
  timestamp: number;
  onlineAnswers?: Record<string, string>; // Lưu câu trả lời học sinh làm online
}
