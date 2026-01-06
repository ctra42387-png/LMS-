
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GradingResult, Assignment, AssignmentType, Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * AI function to grade student work from an image and typed answers
 */
export const gradeStudentWork = async (
  imageBuffer: string | null, 
  assignment: Assignment,
  onlineAnswers?: Record<string, string>
): Promise<GradingResult> => {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Bạn là Hệ thống AI Chấm bài thông minh cho môn Khoa học tự nhiên (KHTN) lớp 6, 7, 8, 9 theo chương trình GDPT 2018 Việt Nam.
    
    VAI TRÒ:
    - Nhận dạng chữ viết tay từ ảnh (nếu có) và đọc các câu trả lời học sinh đã đánh máy trực tiếp.
    - Chấm điểm công bằng, chính xác dựa trên Rubic/Đáp án giáo viên cung cấp.
    - Phân tích chi tiết từng câu hỏi học sinh đã làm để xác định câu nào ĐÚNG (correct), câu nào SAI (incorrect).

    QUY TRÌNH XỬ LÝ:
    1. Tổng hợp dữ liệu: Kết hợp câu trả lời từ phần đánh máy và phần ảnh chụp.
    2. Chấm điểm chi tiết: Đối với mỗi câu hỏi (Question ID) trong danh sách nhiệm vụ, xác định trạng thái "correct" hoặc "incorrect".
    3. Thang điểm 10. Chú ý các bước giải, lập luận khoa học.

    ĐẦU RA: Trả về JSON theo đúng schema quy định. 
    LƯU Ý: Trường "questionResults" phải chứa đầy đủ ID của các câu hỏi đã giao trong đề bài.
  `;

  const typedAnswersStr = onlineAnswers 
    ? Object.entries(onlineAnswers)
        .map(([qId, val]) => {
          const q = assignment.questions?.find(item => item.id === qId);
          return `Câu hỏi [ID: ${qId}, Nội dung: ${q?.text || '?' }]: ${val}`;
        })
        .join('\n')
    : 'Học sinh không đánh máy câu trả lời.';

  const prompt = `
    HÃY PHÂN TÍCH BÀI LÀM VÀ CHẤM ĐIỂM CHI TIẾT.
    
    THÔNG TIN NHIỆM VỤ:
    - Chủ đề: ${assignment.title}
    - Đáp án mẫu/Rubric: ${assignment.rubric}
    - Danh sách câu hỏi chính thức (ID): ${assignment.questions?.map(q => q.id).join(', ')}

    DỮ LIỆU BÀI LÀM CỦA HỌC SINH:
    1. CÂU TRẢ LỜI ĐÁNH MÁY:
    ${typedAnswersStr}

    2. ẢNH CHỤP MINH CHỨNG:
    ${imageBuffer ? 'Học sinh có gửi ảnh kèm theo (phân tích nội dung trong ảnh).' : 'Không có ảnh chụp.'}
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      assignmentInfo: {
        type: Type.OBJECT,
        properties: {
          grade: { type: Type.STRING },
          topic: { type: Type.STRING },
          type: { type: Type.STRING }
        },
        required: ["grade", "topic", "type"]
      },
      score: { type: Type.NUMBER },
      level: { type: Type.STRING },
      integrityCheck: {
        type: Type.OBJECT,
        properties: {
          isPlagiarismSuspected: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["isPlagiarismSuspected", "confidence", "reasoning"]
      },
      questionResults: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionId: { type: Type.STRING },
            status: { type: Type.STRING, description: "'correct' hoặc 'incorrect'" },
            shortExplanation: { type: Type.STRING }
          },
          required: ["questionId", "status"]
        }
      },
      studentFeedback: {
        type: Type.OBJECT,
        properties: {
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.STRING }
        },
        required: ["pros", "cons", "suggestions"]
      },
      teacherReport: {
        type: Type.OBJECT,
        properties: {
          accuracyRate: { type: Type.STRING },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          teachingSuggestions: { type: Type.STRING }
        },
        required: ["accuracyRate", "commonMistakes", "teachingSuggestions"]
      }
    },
    required: ["assignmentInfo", "score", "level", "integrityCheck", "questionResults", "studentFeedback", "teacherReport"]
  };

  const parts: any[] = [{ text: prompt }];
  if (imageBuffer) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBuffer.split(',')[1] 
      }
    });
  }

  try {
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0.1
      }
    });

    if (!result.text) throw new Error("Không có phản hồi từ AI");
    return JSON.parse(result.text);
  } catch (error) {
    console.error("AI Grading Error:", error);
    throw error;
  }
};

/**
 * AI function to generate questions and rubric based on a topic
 */
export const generateAssignmentContent = async (
  title: string,
  grade: string,
  type: AssignmentType,
  mcqCount: number = 10,
  essayCount: number = 2
): Promise<{ description: string; rubric: string; questions: Question[] }> => {
  const modelName = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    Bạn là chuyên gia soạn thảo học liệu môn Khoa học tự nhiên (KHTN) lớp 6, 7, 8, 9 theo chương trình GDPT 2018 Việt Nam.
    Nhiệm vụ: Tạo nội dung bài tập có cấu trúc để hiển thị trên web.
    
    YÊU CẦU CẤU TRÚC & MỨC ĐỘ:
    1. Trả về mảng "questions" chứa các đối tượng câu hỏi.
    2. Mỗi câu hỏi phải có "level" thuộc một trong bốn mức độ: "Biết", "Hiểu", "Vận dụng", "Vận dụng cao".
    3. Phân bổ mức độ hợp lý (ví dụ: 40% Biết, 30% Hiểu, 20% Vận dụng, 10% Vận dụng cao).
    4. Mỗi câu hỏi trắc nghiệm (mcq) phải có: id, text, type: "mcq", level, options (mảng 4 lựa chọn A, B, C, D), và correctAnswer (ký tự A, B, C hoặc D).
    5. Mỗi câu hỏi tự luận (essay) phải có: id, text, type: "essay", level.
    6. Trả về "description" là bản tóm tắt đề bài bằng Markdown để xem nhanh.
    7. Trả về "rubric" là đáp án chi tiết và hướng dẫn chấm điểm cho từng câu theo mức độ.
  `;

  const prompt = `
    Hãy tạo nội dung bài tập KHTN lớp ${grade} cho chủ đề: "${title}".
    Hình thức: ${type}.
    Số câu trắc nghiệm yêu cầu: ${mcqCount} câu.
    Số câu tự luận yêu cầu: ${essayCount} câu.
    Hãy đảm bảo các câu hỏi được phân loại rõ ràng theo mức độ Biết, Hiểu, Vận dụng, Vận dụng cao.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      description: { type: Type.STRING },
      rubric: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            type: { type: Type.STRING },
            level: { type: Type.STRING, enum: ["Biết", "Hiểu", "Vận dụng", "Vận dụng cao"] },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING }
          },
          required: ["id", "text", "type", "level"]
        }
      }
    },
    required: ["description", "rubric", "questions"]
  };

  try {
    const result = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0.7 
      }
    });

    return JSON.parse(result.text || '{}');
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
