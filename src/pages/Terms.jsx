import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Giới thiệu',
    content: 'Khi sử dụng nền tảng URGENT, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.'
  },
  {
    title: '2. Đăng ký & Tài khoản',
    content: 'Bạn phải cung cấp thông tin chính xác khi đăng ký tài khoản. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động dưới tài khoản của mình.'
  },
  {
    title: '3. Quyền & Trách nhiệm',
    content: 'Bạn cam kết không sử dụng dịch vụ cho mục đích vi phạm pháp luật, gian lận hoặc gây hại cho người khác. URGENT có quyền tạm ngưng hoặc chấm dứt tài khoản nếu phát hiện vi phạm.'
  },
  {
    title: '4. Thanh toán & Hoàn tiền',
    content: 'Các khoản thanh toán phải được thực hiện đúng quy định. Chính sách hoàn tiền sẽ được áp dụng theo từng trường hợp cụ thể và quy định của URGENT.'
  },
  {
    title: '5. Bảo mật & Quyền riêng tư',
    content: 'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Vui lòng tham khảo thêm tại trang Chính sách bảo mật.'
  },
  {
    title: '6. Thay đổi điều khoản',
    content: 'URGENT có thể cập nhật điều khoản sử dụng bất kỳ lúc nào. Các thay đổi sẽ được thông báo trên website.'
  },
  {
    title: '7. Liên hệ',
    content: 'Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua email support@dichvupro.com.'
  },
];

const Terms = () => (
  <>
    <Helmet>
      <title>Điều Khoản Sử Dụng | URGENT</title>
      <meta name="description" content="Điều khoản sử dụng dịch vụ của nền tảng URGENT." />
    </Helmet>
    <div className="max-w-3xl mx-auto py-16 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-extrabold text-center text-blue-400 mb-10"
      >
        Điều Khoản Sử Dụng
      </motion.h1>
      <div className="space-y-8">
        {sections.map((sec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{sec.title}</h2>
            <p className="text-gray-300 text-base">{sec.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </>
);

export default Terms; 