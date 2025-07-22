import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Target, Eye } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    { name: 'Đinh Quang Khương', role: 'CEO & Founder', image: 'https://i.pinimg.com/736x/90/8c/b9/908cb9d436c368e660a936dcde119c8a.jpg', description: 'Người sáng lập và định hướng chiến lược phát triển.' },
    { name: 'Phạm Thanh Phương', role: 'Lead Marketing', image: 'https://i.pinimg.com/736x/75/dc/df/75dcdf5cf34baa783bc7d8cf375c4e69.jpg', description: ' Xây dựng thương hiệu và kết nối khách hàng.' },
    { name: 'Đỗ Văn Mạnh', role: 'Lead IT', image: 'https://i.pinimg.com/736x/00/1e/13/001e13630531a4f82425e08388296f99.jpg', description: 'Chịu trách nhiệm phát triển và vận hành hệ thống.' },
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

        {/* Core Values Section */}
        <section className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Những giá trị làm nên sự khác biệt của URGENT</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 hover:border-blue-400 transition-all"
            >
              <Users className="mx-auto h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Khách Hàng Là Trung Tâm</h3>
              <p className="text-gray-400">Chúng tôi luôn đặt lợi ích và trải nghiệm của khách hàng lên hàng đầu.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 hover:border-blue-400 transition-all"
            >
              <Target className="mx-auto h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Chất Lượng & Đổi Mới</h3>
              <p className="text-gray-400">Không ngừng cải tiến để mang đến dịch vụ tốt nhất, ứng dụng công nghệ hiện đại.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 hover:border-blue-400 transition-all"
            >
              <Eye className="mx-auto h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Minh Bạch & Tin Cậy</h3>
              <p className="text-gray-400">Cam kết minh bạch trong mọi hoạt động, xây dựng niềm tin với khách hàng và đối tác.</p>
            </motion.div>
          </div>
        </section>

        {/* Achievements/Stats Section */}
        {/* <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Thành Tựu & Con Số Ấn Tượng</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Những con số thể hiện sự phát triển và uy tín của URGENT</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700"
            >
              <h3 className="text-4xl font-bold text-blue-400 mb-2">10,000+</h3>
              <p className="text-gray-400">Khách hàng hài lòng</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700"
            >
              <h3 className="text-4xl font-bold text-green-400 mb-2">500+</h3>
              <p className="text-gray-400">Chuyên gia & đối tác</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700"
            >
              <h3 className="text-4xl font-bold text-purple-400 mb-2">99%</h3>
              <p className="text-gray-400">Tỉ lệ hài lòng</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700"
            >
              <h3 className="text-4xl font-bold text-yellow-400 mb-2">2025</h3>
              <p className="text-gray-400">Năm thành lập</p>
            </motion.div>
          </div>
        </section> */}

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
                  <img className="w-full h-full object-cover" alt={`Portrait of ${member.name}`} src={member.image} />
                </div>
                <h4 className="text-xl font-bold">{member.name}</h4>
                <p className="text-blue-400">{member.role}</p>
                <p className="text-gray-400 mt-2 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Khách Hàng & Đối Tác Nói Gì?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Những đánh giá thực tế từ khách hàng và đối tác đã đồng hành cùng URGENT
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Nguyễn Văn D',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                content: 'Tôi rất ấn tượng với sự chuyên nghiệp và tận tâm của đội ngũ URGENT. Dịch vụ tuyệt vời!',
                role: 'Khách hàng',
              },
              {
                name: 'Lê Thị E',
                avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
                content: 'Là đối tác của URGENT, tôi đánh giá cao sự minh bạch và hỗ trợ nhiệt tình từ hệ thống.',
                role: 'Đối tác',
              },
              {
                name: 'Phạm Văn F',
                avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
                content: 'Nền tảng hiện đại, dễ sử dụng và rất hiệu quả cho cả khách hàng lẫn nhà cung cấp dịch vụ.',
                role: 'Chuyên gia',
              },
            ].map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-gray-800/80 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-gray-700 hover:border-blue-400 transition-all"
              >
                <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-4 border-blue-400 object-cover" />
                <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
                <p className="text-blue-400 text-sm mb-2">{t.role}</p>
                <p className="text-gray-300 text-base">"{t.content}"</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;