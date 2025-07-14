import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'Làm thế nào để đăng ký tài khoản?',
    answer: 'Bạn có thể nhấn vào nút Đăng ký ở góc trên bên phải và điền đầy đủ thông tin theo hướng dẫn. Sau khi xác thực email, bạn có thể sử dụng tài khoản ngay.'
  },
  {
    question: 'Tôi có thể đặt lịch dịch vụ như thế nào?',
    answer: 'Bạn chỉ cần chọn dịch vụ mong muốn, nhấn Đặt lịch và điền thông tin cần thiết. Hệ thống sẽ xác nhận và gửi thông báo cho bạn.'
  },
  {
    question: 'Thanh toán có an toàn không?',
    answer: 'Chúng tôi sử dụng các cổng thanh toán bảo mật hàng đầu. Mọi thông tin đều được mã hóa và bảo vệ tuyệt đối.'
  },
  {
    question: 'Tôi muốn trở thành đối tác/chuyên gia thì làm sao?',
    answer: 'Bạn có thể đăng ký tài khoản chuyên gia hoặc liên hệ với chúng tôi qua trang Liên hệ để được hướng dẫn chi tiết.'
  },
  {
    question: 'Nếu có vấn đề phát sinh thì liên hệ ai?',
    answer: 'Bạn có thể liên hệ bộ phận hỗ trợ qua email support@dichvupro.com hoặc số điện thoại trên trang Liên hệ.'
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Câu Hỏi Thường Gặp | URGENT</title>
        <meta name="description" content="Những câu hỏi thường gặp về nền tảng URGENT và các dịch vụ." />
      </Helmet>
      <div className="max-w-3xl mx-auto py-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-center text-blue-400 mb-10"
        >
          Câu Hỏi Thường Gặp
        </motion.h1>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-lg font-semibold text-white focus:outline-none hover:bg-blue-900/30 transition"
                onClick={() => toggle(idx)}
              >
                <span>{faq.question}</span>
                {openIndex === idx ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === idx ? 'auto' : 0, opacity: openIndex === idx ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`px-6 pb-5 text-gray-300 text-base ${openIndex === idx ? '' : 'hidden'}`}
              >
                {faq.answer}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ; 