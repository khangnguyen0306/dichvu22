import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Thu thập thông tin',
    content: 'Chúng tôi thu thập thông tin cá nhân bạn cung cấp khi đăng ký, sử dụng dịch vụ hoặc liên hệ với chúng tôi.'
  },
  {
    title: '2. Sử dụng thông tin',
    content: 'Thông tin của bạn được sử dụng để cung cấp, duy trì, cải thiện dịch vụ và liên hệ khi cần thiết.'
  },
  {
    title: '3. Bảo mật thông tin',
    content: 'Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ thông tin cá nhân khỏi truy cập trái phép, mất mát hoặc lạm dụng.'
  },
  {
    title: '4. Chia sẻ thông tin',
    content: 'Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba, trừ khi có sự đồng ý của bạn hoặc theo yêu cầu pháp luật.'
  },
  {
    title: '5. Quyền của người dùng',
    content: 'Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất cứ lúc nào.'
  },
  {
    title: '6. Thay đổi chính sách',
    content: 'Chính sách bảo mật có thể được cập nhật. Mọi thay đổi sẽ được thông báo trên website.'
  },
  {
    title: '7. Liên hệ',
    content: 'Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ qua email support@dichvupro.com.'
  },
];

const Privacy = () => (
  <>
    <Helmet>
      <title>Chính Sách Bảo Mật | URGENT</title>
      <meta name="description" content="Chính sách bảo mật thông tin cá nhân của nền tảng URGENT." />
    </Helmet>
    <div className="max-w-3xl mx-auto py-16 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-extrabold text-center text-blue-400 mb-10"
      >
        Chính Sách Bảo Mật
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

export default Privacy; 