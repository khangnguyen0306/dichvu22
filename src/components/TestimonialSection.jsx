import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    content: 'Dịch vụ rất chuyên nghiệp, nhân viên thân thiện và đúng giờ. Tôi rất hài lòng và sẽ tiếp tục sử dụng!',
  },
  {
    name: 'Trần Thị B',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    content: 'Đặt lịch nhanh chóng, giá cả hợp lý. Chuyên gia làm việc tận tâm, tôi đánh giá cao!',
  },
  {
    name: 'Lê Văn C',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    rating: 5,
    content: 'Tôi đã giới thiệu cho bạn bè và người thân. Dịch vụ rất đáng tin cậy!',
  },
];

const TestimonialSection = () => (
  <section className="py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl font-bold text-white mb-4">Khách Hàng Nói Gì?</h2>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Những đánh giá thực tế từ khách hàng đã sử dụng dịch vụ của chúng tôi
      </p>
    </motion.div>
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {testimonials.map((t, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.2 }}
          className="bg-gray-800/80 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-gray-700 hover:border-blue-400 transition-all"
        >
          <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-4 border-blue-400 object-cover" />
          <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
          <div className="flex items-center justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} fill={i < t.rating ? 'currentColor' : 'none'} />
            ))}
          </div>
          <p className="text-gray-300 text-base">"{t.content}"</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default TestimonialSection; 