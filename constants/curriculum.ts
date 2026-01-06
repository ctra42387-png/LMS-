
export interface Lesson {
  id: string;
  title: string;
}

export interface Chapter {
  title: string;
  lessons: Lesson[];
}

export interface GradeCurriculum {
  [grade: string]: Chapter[];
}

export const KHTN_CURRICULUM: GradeCurriculum = {
  '6': [
    {
      title: 'Chương I: Mở đầu về Khoa học tự nhiên',
      lessons: [
        { id: '6-1-1', title: 'Bài 1: Giới thiệu về Khoa học tự nhiên' },
        { id: '6-1-2', title: 'Bài 2: An toàn trong phòng thực hành' },
        { id: '6-1-3', title: 'Bài 3: Sử dụng kính lúp' },
        { id: '6-1-4', title: 'Bài 4: Sử dụng kính hiển vi quang học' },
        { id: '6-1-5', title: 'Bài 5: Đo chiều dài' },
        { id: '6-1-6', title: 'Bài 6: Đo khối lượng' },
        { id: '6-1-7', title: 'Bài 7: Đo thời gian' },
        { id: '6-1-8', title: 'Bài 8: Đo nhiệt độ' }
      ]
    },
    {
      title: 'Chương II: Chất quanh ta',
      lessons: [
        { id: '6-2-9', title: 'Bài 9: Sự đa dạng của chất' },
        { id: '6-2-10', title: 'Bài 10: Các thể của chất và sự chuyển thể' },
        { id: '6-2-11', title: 'Bài 11: Oxygen. Không khí' }
      ]
    },
    {
      title: 'Chương III: Một số vật liệu, nhiên liệu, nguyên liệu, lương thực, thực phẩm thông dụng',
      lessons: [
        { id: '6-3-12', title: 'Bài 12: Một số vật liệu' },
        { id: '6-3-13', title: 'Bài 13: Một số nhiên liệu' },
        { id: '6-3-14', title: 'Bài 14: Một số nguyên liệu' },
        { id: '6-3-15', title: 'Bài 15: Một số lương thực, thực phẩm' }
      ]
    },
    {
      title: 'Chương IV: Hỗn hợp. Tách chất ra khỏi hỗn hợp',
      lessons: [
        { id: '6-4-16', title: 'Bài 16: Hỗn hợp các chất' },
        { id: '6-4-17', title: 'Bài 17: Tách chất ra khỏi hỗn hợp' }
      ]
    },
    {
      title: 'Chương V: Tế bào',
      lessons: [
        { id: '6-5-18', title: 'Bài 18: Tế bào - Đơn vị cơ sở của sự sống' },
        { id: '6-5-19', title: 'Bài 19: Cấu tạo và chức năng của các thành phần trong tế bào' },
        { id: '6-5-20', title: 'Bài 20: Sự lớn lên và sinh sản của tế bào' },
        { id: '6-5-21', title: 'Bài 21: Thực hành: Quan sát tế bào' }
      ]
    },
    {
      title: 'Chương VI: Từ tế bào đến cơ thể',
      lessons: [
        { id: '6-6-22', title: 'Bài 22: Cơ thể sinh vật' },
        { id: '6-6-23', title: 'Bài 23: Tổ chức cơ thể đa bào' }
      ]
    },
    {
      title: 'Chương VII: Đa dạng thế giới sống',
      lessons: [
        { id: '6-7-25', title: 'Bài 25: Hệ thống phân loại sinh vật' },
        { id: '6-7-26', title: 'Bài 26: Khóa lưỡng phân' },
        { id: '6-7-27', title: 'Bài 27: Vi khuẩn' },
        { id: '6-7-28', title: 'Bài 28: Thực hành: Quan sát vi khuẩn. Làm sữa chua' },
        { id: '6-7-29', title: 'Bài 29: Virus' },
        { id: '6-7-30', title: 'Bài 30: Nguyên sinh vật' },
        { id: '6-7-31', title: 'Bài 31: Thực hành: Quan sát nguyên sinh vật' },
        { id: '6-7-32', title: 'Bài 32: Nấm' },
        { id: '6-7-33', title: 'Bài 33: Thực hành: Quan sát các loại nấm' },
        { id: '6-7-34', title: 'Bài 34: Thực vật' },
        { id: '6-7-35', title: 'Bài 35: Thực hành: Quan sát các nhóm thực vật' },
        { id: '6-7-36', title: 'Bài 36: Động vật' },
        { id: '6-7-37', title: 'Bài 37: Thực hành: Nhận biết động vật ngoài thiên nhiên' },
        { id: '6-7-38', title: 'Bài 38: Đa dạng sinh học' },
        { id: '6-7-39', title: 'Bài 39: Tìm hiểu sinh vật ngoài thiên nhiên' }
      ]
    },
    {
      title: 'Chương VIII: Lực trong đời sống',
      lessons: [
        { id: '6-8-40', title: 'Bài 40: Lực là gì?' },
        { id: '6-8-41', title: 'Bài 41: Biểu diễn lực' },
        { id: '6-8-42', title: 'Bài 42: Biến dạng của lò xo' },
        { id: '6-8-43', title: 'Bài 43: Trọng lượng, lực hấp dẫn' },
        { id: '6-8-44', title: 'Bài 44: Lực ma sát' },
        { id: '6-8-45', title: 'Bài 45: Lực cản của nước' }
      ]
    },
    {
      title: 'Chương IX: Năng lượng',
      lessons: [
        { id: '6-9-46', title: 'Bài 46: Năng lượng và sự truyền năng lượng' },
        { id: '6-9-47', title: 'Bài 47: Một số dạng năng lượng' },
        { id: '6-9-48', title: 'Bài 48: Sự chuyển hóa năng lượng' },
        { id: '6-9-49', title: 'Bài 49: Năng lượng hao phí' },
        { id: '6-9-50', title: 'Bài 50: Năng lượng tái tạo' },
        { id: '6-9-51', title: 'Bài 51: Tiết kiệm năng lượng' }
      ]
    },
    {
      title: 'Chương X: Trái Đất và bầu trời',
      lessons: [
        { id: '6-10-52', title: 'Bài 52: Chuyển động nhìn thấy của Mặt Trời' },
        { id: '6-10-53', title: 'Bài 53: Mặt Trăng' },
        { id: '6-10-54', title: 'Bài 54: Hệ Mặt Trời' },
        { id: '6-10-55', title: 'Bài 55: Ngân Hà' }
      ]
    }
  ],
  '7': [
    {
      title: 'Chương I: Nguyên tử. Sơ lược về bảng tuần hoàn',
      lessons: [
        { id: '7-1-1', title: 'Bài 1: Phương pháp và kĩ năng học tập môn KHTN' },
        { id: '7-1-2', title: 'Bài 2: Nguyên tử' },
        { id: '7-1-3', title: 'Bài 3: Nguyên tố hóa học' },
        { id: '7-1-4', title: 'Bài 4: Sơ lược về bảng tuần hoàn các nguyên tố hóa học' }
      ]
    },
    {
      title: 'Chương II: Phân tử. Liên kết hóa học',
      lessons: [
        { id: '7-2-5', title: 'Bài 5: Phân tử - Đơn chất - Hợp chất' },
        { id: '7-2-6', title: 'Bài 6: Giới thiệu về liên kết hóa học' },
        { id: '7-2-7', title: 'Bài 7: Hóa trị và công thức hóa học' }
      ]
    },
    {
      title: 'Chương III: Tốc độ',
      lessons: [
        { id: '7-3-8', title: 'Bài 8: Tốc độ chuyển động' },
        { id: '7-3-9', title: 'Bài 9: Đo tốc độ' },
        { id: '7-3-10', title: 'Bài 10: Đồ thị quãng đường – thời gian' },
        { id: '7-3-11', title: 'Bài 11: Thảo luận về ảnh hưởng của tốc độ trong an toàn giao thông' }
      ]
    },
    {
      title: 'Chương IV: Âm thanh',
      lessons: [
        { id: '7-4-12', title: 'Bài 12: Sóng âm' },
        { id: '7-4-13', title: 'Bài 13: Độ cao và độ to của âm' },
        { id: '7-4-14', title: 'Bài 14: Phản xạ âm, chống ô nhiễm tiếng ồn' }
      ]
    },
    {
      title: 'Chương V: Ánh sáng',
      lessons: [
        { id: '7-5-15', title: 'Bài 15: Năng lượng ánh sáng. Tia sáng, vùng tối' },
        { id: '7-5-16', title: 'Bài 16: Sự phản xạ ánh sáng' },
        { id: '7-5-17', title: 'Bài 17: Ảnh của vật qua gương phẳng' }
      ]
    },
    {
      title: 'Chương VI: Từ',
      lessons: [
        { id: '7-6-18', title: 'Bài 18: Nam châm' },
        { id: '7-6-19', title: 'Bài 19: Từ trường' },
        { id: '7-6-20', title: 'Bài 20: Chế tạo nam châm điện đơn giản' }
      ]
    },
    {
      title: 'Chương VII: Trao đổi chất và chuyển hóa năng lượng ở sinh vật',
      lessons: [
        { id: '7-7-21', title: 'Bài 21: Khái quát về trao đổi chất và chuyển hóa năng lượng' },
        { id: '7-7-22', title: 'Bài 22: Quang hợp ở thực vật' },
        { id: '7-7-23', title: 'Bài 23: Một số yếu tố ảnh hưởng đến quang hợp' },
        { id: '7-7-24', title: 'Bài 24: Thực hành: Chứng minh quang hợp ở cây xanh' },
        { id: '7-7-25', title: 'Bài 25: Hô hấp tế bào' },
        { id: '7-7-26', title: 'Bài 26: Một số yếu tố ảnh hưởng đến hô hấp tế bào' },
        { id: '7-7-27', title: 'Bài 27: Thực hành: Hô hấp ở hạt nảy mầm' },
        { id: '7-7-28', title: 'Bài 28: Trao đổi khí ở sinh vật' },
        { id: '7-7-29', title: 'Bài 29: Vai trò của nước và chất dinh dưỡng đối với sinh vật' },
        { id: '7-7-30', title: 'Bài 30: Trao đổi nước và chất dinh dưỡng ở thực vật' },
        { id: '7-7-31', title: 'Bài 31: Trao đổi nước và chất dinh dưỡng ở động vật' }
      ]
    },
    {
      title: 'Chương VIII: Cảm ứng ở sinh vật',
      lessons: [
        { id: '7-8-32', title: 'Bài 32: Cảm ứng ở sinh vật' },
        { id: '7-8-33', title: 'Bài 33: Thực hành: Quan sát hiện tượng cảm ứng ở sinh vật' }
      ]
    },
    {
      title: 'Chương IX: Sinh trưởng và phát triển ở sinh vật',
      lessons: [
        { id: '7-9-34', title: 'Bài 34: Vận dụng hiện tượng cảm ứng ở sinh vật vào thực tiễn' },
        { id: '7-9-35', title: 'Bài 35: Các nhân tố ảnh hưởng đến sinh trưởng và phát triển' },
        { id: '7-9-36', title: 'Bài 36: Thực hành: Chứng minh sinh trưởng và phát triển' }
      ]
    },
    {
      title: 'Chương X: Sinh sản ở sinh vật',
      lessons: [
        { id: '7-10-37', title: 'Bài 37: Sinh sản ở sinh vật' },
        { id: '7-10-38', title: 'Bài 38: Các yếu tố ảnh hưởng và điều khiển sinh sản ở sinh vật' }
      ]
    },
    {
      title: 'Chương XI: Cơ thể sinh vật là một thể thống nhất',
      lessons: [
        { id: '7-11-39', title: 'Bài 39: Chứng minh cơ thể sinh vật là một thể thống nhất' }
      ]
    }
  ],
  '8': [
    {
      title: 'Chương I: Phản ứng hóa học',
      lessons: [
        { id: '8-1-1', title: 'Bài 1: Biến đổi vật lí và biến đổi hóa học' },
        { id: '8-1-2', title: 'Bài 2: Phản ứng hóa học' },
        { id: '8-1-3', title: 'Bài 3: Mol và tỉ khối chất khí' },
        { id: '8-1-4', title: 'Bài 4: Định luật bảo toàn khối lượng và phương trình hóa học' },
        { id: '8-1-5', title: 'Bài 5: Tính theo phương trình hóa học' },
        { id: '8-1-6', title: 'Bài 6: Nồng độ dung dịch' },
        { id: '8-1-7', title: 'Bài 7: Tốc độ phản ứng và chất xúc tác' }
      ]
    },
    {
      title: 'Chương II: Một số hợp chất thông dụng',
      lessons: [
        { id: '8-2-8', title: 'Bài 8: Acid' },
        { id: '8-2-9', title: 'Bài 9: Base. Thang pH' },
        { id: '8-2-10', title: 'Bài 10: Oxide' },
        { id: '8-2-11', title: 'Bài 11: Muối' },
        { id: '8-2-12', title: 'Bài 12: Phân bón hóa học' }
      ]
    },
    {
      title: 'Chương III: Khối lượng riêng và áp suất',
      lessons: [
        { id: '8-3-13', title: 'Bài 13: Khối lượng riêng' },
        { id: '8-3-14', title: 'Bài 14: Thực hành: Xác định khối lượng riêng' },
        { id: '8-3-15', title: 'Bài 15: Áp suất trên một bề mặt' },
        { id: '8-3-16', title: 'Bài 16: Áp suất chất lỏng. Áp suất khí quyển' },
        { id: '8-3-17', title: 'Bài 17: Lực đẩy Archimedes' }
      ]
    },
    {
      title: 'Chương IV: Tác dụng làm quay của lực',
      lessons: [
        { id: '8-4-18', title: 'Bài 18: Moment lực. Đòn bẩy' },
        { id: '8-4-19', title: 'Bài 19: Tác dụng làm quay của lực' }
      ]
    },
    {
      title: 'Chương V: Điện',
      lessons: [
        { id: '8-5-20', title: 'Bài 20: Hiện tượng nhiễm điện do cọ xát' },
        { id: '8-5-21', title: 'Bài 21: Dòng điện, nguồn điện' },
        { id: '8-5-22', title: 'Bài 22: Mạch điện đơn giản' },
        { id: '8-5-23', title: 'Bài 23: Tác dụng của dòng điện' },
        { id: '8-5-24', title: 'Bài 24: Cường độ dòng điện và hiệu điện thế' },
        { id: '8-5-25', title: 'Bài 25: Thực hành: Đo cường độ dòng điện và hiệu điện thế' }
      ]
    },
    {
      title: 'Chương VI: Nhiệt',
      lessons: [
        { id: '8-6-26', title: 'Bài 26: Năng lượng nhiệt và nội năng' },
        { id: '8-6-27', title: 'Bài 27: Thực hành: Đo năng lượng nhiệt' },
        { id: '8-6-28', title: 'Bài 28: Sự truyền nhiệt' },
        { id: '8-6-29', title: 'Bài 29: Sự nở vì nhiệt' }
      ]
    },
    {
      title: 'Chương VII: Sinh học cơ thể người',
      lessons: [
        { id: '8-7-30', title: 'Bài 30: Khái quát về cơ thể người' },
        { id: '8-7-31', title: 'Bài 31: Hệ vận động ở người' },
        { id: '8-7-32', title: 'Bài 32: Dinh dưỡng và tiêu hóa ở người' },
        { id: '8-7-33', title: 'Bài 33: Máu và hệ tuần hoàn ở người' },
        { id: '8-7-34', title: 'Bài 34: Hệ hô hấp ở người' },
        { id: '8-7-35', title: 'Bài 35: Hệ bài tiết ở người' },
        { id: '8-7-36', title: 'Bài 36: Điều hòa môi trường trong cơ thể người' },
        { id: '8-7-37', title: 'Bài 37: Hệ thần kinh và các giác quan ở người' },
        { id: '8-7-38', title: 'Bài 38: Hệ nội tiết ở người' },
        { id: '8-7-39', title: 'Bài 39: Da và điều hòa thân nhiệt ở người' },
        { id: '8-7-40', title: 'Bài 40: Sinh sản ở người' }
      ]
    },
    {
      title: 'Chương VIII: Sinh vật và môi trường',
      lessons: [
        { id: '8-8-41', title: 'Bài 41: Môi trường sống và các nhân tố sinh thái' },
        { id: '8-8-42', title: 'Bài 42: Quần thể sinh vật' },
        { id: '8-8-43', title: 'Bài 43: Quần xã sinh vật' },
        { id: '8-8-44', title: 'Bài 44: Hệ sinh thái' },
        { id: '8-8-45', title: 'Bài 45: Sinh quyển' },
        { id: '8-8-46', title: 'Bài 46: Cân bằng tự nhiên' },
        { id: '8-8-47', title: 'Bài 47: Bảo vệ môi trường' }
      ]
    }
  ],
  '9': [
    {
      title: 'Chương I: Năng lượng cơ học',
      lessons: [
        { id: '9-1-1', title: 'Bài 1: Công và công suất' },
        { id: '9-1-2', title: 'Bài 2: Động năng. Thế năng' },
        { id: '9-1-3', title: 'Bài 3: Cơ năng' }
      ]
    },
    {
      title: 'Chương II: Ánh sáng',
      lessons: [
        { id: '9-2-4', title: 'Bài 4: Khúc xạ ánh sáng' },
        { id: '9-2-5', title: 'Bài 5: Phản xạ toàn phần' },
        { id: '9-2-6', title: 'Bài 6: Thấu kính hội tụ' },
        { id: '9-2-7', title: 'Bài 7: Thấu kính phân kì' },
        { id: '9-2-8', title: 'Bài 8: Kính lúp' },
        { id: '9-2-9', title: 'Bài 9: Sự tán sắc ánh sáng. Màu sắc ánh sáng' }
      ]
    },
    {
      title: 'Chương III: Điện',
      lessons: [
        { id: '9-3-10', title: 'Bài 10: Định luật Ohm. Điện trở' },
        { id: '9-3-11', title: 'Bài 11: Điện trở và biến trở' },
        { id: '9-3-12', title: 'Bài 12: Đoạn mạch nối tiếp, song song' },
        { id: '9-3-13', title: 'Bài 13: Năng lượng điện và công suất điện' }
      ]
    },
    {
      title: 'Chương IV: Điện từ',
      lessons: [
        { id: '9-4-14', title: 'Bài 14: Từ trường Trái Đất. Sử dụng la bàn' },
        { id: '9-4-15', title: 'Bài 15: Cảm ứng điện từ' },
        { id: '9-4-16', title: 'Bài 16: Dòng điện xoay chiều' },
        { id: '9-4-17', title: 'Bài 17: Máy biến áp' }
      ]
    },
    {
      title: 'Chương V: Năng lượng với cuộc sống',
      lessons: [
        { id: '9-5-18', title: 'Bài 18: Năng lượng của hóa thạch' },
        { id: '9-5-19', title: 'Bài 19: Năng lượng tái tạo' }
      ]
    },
    {
      title: 'Chương VI: Kim loại. Sự khác nhau giữa kim loại và phi kim',
      lessons: [
        { id: '9-6-20', title: 'Bài 20: Tính chất vật lí của kim loại' },
        { id: '9-6-21', title: 'Bài 21: Tính chất hóa học của kim loại. Dãy hoạt động hóa học' },
        { id: '9-6-22', title: 'Bài 22: Tách kim loại và việc sử dụng hợp kim' },
        { id: '9-6-23', title: 'Bài 23: Sự ăn mòn kim loại và bảo vệ kim loại' }
      ]
    },
    {
      title: 'Chương VII: Hydrocarbon. Nhiên liệu',
      lessons: [
        { id: '9-7-24', title: 'Bài 24: Alkane' },
        { id: '9-7-25', title: 'Bài 25: Ethylene' },
        { id: '9-7-26', title: 'Bài 26: Acetylene' },
        { id: '9-7-27', title: 'Bài 27: Dầu mỏ và khí thiên nhiên. Nhiên liệu' }
      ]
    },
    {
      title: 'Chương VIII: Ethylic Alcohol và Acetic Acid',
      lessons: [
        { id: '9-8-28', title: 'Bài 28: Ethylic Alcohol' },
        { id: '9-8-29', title: 'Bài 29: Acetic Acid' }
      ]
    },
    {
      title: 'Chương IX: Lipid. Carbohydrate. Protein. Polymer',
      lessons: [
        { id: '9-9-30', title: 'Bài 30: Chất béo' },
        { id: '9-9-31', title: 'Bài 31: Glucose và Saccharose' },
        { id: '9-9-32', title: 'Bài 32: Tinh bột và Cellulose' },
        { id: '9-9-33', title: 'Bài 33: Protein' },
        { id: '9-9-34', title: 'Bài 34: Polymer' }
      ]
    },
    {
      title: 'Chương X: Khai thác tài nguyên từ vỏ Trái Đất',
      lessons: [
        { id: '9-10-35', title: 'Bài 35: Khai thác đá vôi và đất sét' },
        { id: '9-10-36', title: 'Bài 36: Nhiên liệu hóa thạch' }
      ]
    },
    {
      title: 'Chương XI: Di truyền Mendel. Cơ sở phân tử của di truyền',
      lessons: [
        { id: '9-11-37', title: 'Bài 37: Mendel và khái niệm nhân tố di truyền' },
        { id: '9-11-38', title: 'Bài 38: Lai một cặp tính trạng' },
        { id: '9-11-39', title: 'Bài 39: Nucleic acid và Gene' },
        { id: '9-11-40', title: 'Bài 40: Cơ chế di truyền ở cấp độ phân tử' }
      ]
    },
    {
      title: 'Chương XII: Di truyền nhiễm sắc thể',
      lessons: [
        { id: '9-12-41', title: 'Bài 41: Cấu trúc nhiễm sắc thể' },
        { id: '9-12-42', title: 'Bài 42: Nguyên phân và Giảm phân' },
        { id: '9-12-43', title: 'Bài 43: Cơ chế xác định giới tính' },
        { id: '9-12-44', title: 'Bài 44: Di truyền liên kết' }
      ]
    },
    {
      title: 'Chương XIII: Di truyền học người',
      lessons: [
        { id: '9-13-45', title: 'Bài 45: Di truyền học người và bệnh, tật di truyền ở người' }
      ]
    },
    {
      title: 'Chương XIV: Tiến hóa',
      lessons: [
        { id: '9-14-46', title: 'Bài 46: Bằng chứng tiến hóa' },
        { id: '9-14-47', title: 'Bài 47: Các học thuyết tiến hóa' },
        { id: '9-14-48', title: 'Bài 48: Sự phát sinh và phát triển của sự sống trên Trái Đất' }
      ]
    }
  ]
};
