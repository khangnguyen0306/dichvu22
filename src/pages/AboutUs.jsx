import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Target, Eye } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    { name: 'Alex Johnson', role: 'CEO & Founder', image: 'team-member-1' },
    { name: 'Maria Garcia', role: 'Lead Developer', image: 'team-member-2' },
    { name: 'James Smith', role: 'Marketing Director', image: 'team-member-3' },
  ];

  return (
    <>
      <Helmet>
        <title>Về Chúng Tôi - URGENT</title>
        <meta name="description" content="Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ đằng sau URGENT, nền tảng kết nối dịch vụ hàng đầu." />
      </Helmet>
      <div className="space-y-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 px-4 bg-gradient-to-b from-blue-900/30 to-gray-900 rounded-lg"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Về <span className="text-blue-400">URGENT</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Chúng tôi là nền tảng kết nối dịch vụ hàng đầu, giúp mọi người dễ dàng tìm kiếm và sử dụng các dịch vụ chất lượng.
          </p>
        </motion.section>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Câu Chuyện Của Chúng Tôi</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              URGENT được thành lập vào năm 2025 với một mục tiêu đơn giản: làm cho việc tìm kiếm và cung cấp dịch vụ trở nên dễ dàng, minh bạch và an toàn hơn cho tất cả mọi người. Chúng tôi nhận thấy có một khoảng trống lớn trong thị trường dịch vụ trực tuyến tại Việt Nam - nơi mà người dùng thường gặp khó khăn trong việc tìm kiếm dịch vụ đáng tin cậy và các nhà cung cấp dịch vụ gặp thách thức trong việc tiếp cận khách hàng tiềm năng.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Nền tảng của chúng tôi được thiết kế để giải quyết vấn đề đó. Bằng cách cung cấp các công cụ mạnh mẽ, một hệ thống đánh giá đáng tin cậy và quy trình làm việc liền mạch, chúng tôi trao quyền cho cả người bán và người mua để đạt được mục tiêu của họ.
            </p>
          </div>
          <div>
            <img  class="rounded-lg shadow-lg w-full h-auto" alt="A team collaborating in a modern office" src="https://images.unsplash.com/photo-1651009188116-bb5f80eaf6aa" />
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <Target className="mx-auto h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Sứ Mệnh Của Chúng Tôi</h3>
            <p className="text-gray-400">
              Trao quyền cho các chuyên gia và doanh nghiệp bằng cách cung cấp một nền tảng để họ giới thiệu tài năng của mình và kết nối với khách hàng trên toàn thế giới.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <Eye className="mx-auto h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Tầm Nhìn Của Chúng Tôi</h3>
            <p className="text-gray-400">
              Trở thành thị trường dịch vụ kỹ thuật số đáng tin cậy và được yêu thích nhất, nơi chất lượng, sự đổi mới và sự hài lòng của khách hàng là trọng tâm.
            </p>
          </motion.div>
        </section>

        <section>
          <h2 className="text-4xl font-bold text-center mb-10">Gặp Gỡ Đội Ngũ</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-800 rounded-lg p-6 text-center"
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-blue-400">
                  <img  class="w-full h-full object-cover" alt={`Portrait of ${member.name}`} src="https://images.unsplash.com/photo-1589132012505-a2d7a7a39589" />
                </div>
                <h4 className="text-xl font-bold">{member.name}</h4>
                <p className="text-blue-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;