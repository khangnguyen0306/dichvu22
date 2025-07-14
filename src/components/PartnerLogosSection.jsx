import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  {
    name: 'VinGroup',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/98/Vingroup_logo.svg/2560px-Vingroup_logo.svg.png',
  },
  {
    name: 'FPT',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/1200px-FPT_logo_2010.svg.png',
  },
  {
    name: 'Viettel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Viettel_Telecom_banner.jpg',
  },
  {
    name: 'Techcombank',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMxEk9d0Cczb9L6GQooIVyd3eq7AFzBu0K5g&s',
  },
  {
    name: 'Mobifone',
    logo: 'https://rubee.com.vn/admin/webroot/upload/image//images/tin-tuc/logo-mobifone-2(1).png',
  },
];

const PartnerLogosSection = () => (
  <section className="py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h2 className="text-3xl font-bold text-white mb-2">Đối Tác Tiêu Biểu</h2>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Chúng tôi tự hào hợp tác với các doanh nghiệp, tổ chức lớn
      </p>
    </motion.div>
    <div className="flex flex-wrap justify-center items-center gap-8 max-w-5xl mx-auto">
      {partners.map((p, idx) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="bg-white rounded-xl p-4 flex items-center justify-center shadow-md h-24 w-44 hover:scale-105 transition-transform"
        >
          <img src={p.logo} alt={p.name} className="h-12 object-contain mx-auto" />
        </motion.div>
      ))}
    </div>
  </section>
);

export default PartnerLogosSection; 