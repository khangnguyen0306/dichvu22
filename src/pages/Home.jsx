import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext.jsx';
import { ArrowRight, Star } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ServiceCard = ({ service, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300 flex flex-col"
    >
        <div className="h-48 w-full overflow-hidden">
            <img 
                class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                alt={service.name}
              src="https://images.unsplash.com/photo-1690721606848-ac5bdcde45ea" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-blue-300 mb-2">{service.name}</h3>
            <p className="text-gray-400 mb-4 flex-grow">{service.description.substring(0, 70)}...</p>
            <div className="flex justify-between items-center mt-auto">
                <p className="text-lg font-semibold text-white">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</p>
                <Link to={`/services/${service.id}`}>
                    <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">Xem chi tiết</Button>
                </Link>
            </div>
        </div>
    </motion.div>
);

const Home = () => {
    const { services, categories } = useData();
    const featuredServices = services.slice(0, 3);

    return (
        <>
            <Helmet>
                <title>Trang Chủ - DịchVụPro</title>
                <meta name="description" content="Tìm kiếm và thuê các chuyên gia hàng đầu cho mọi dịch vụ bạn cần. DịchVụPro là nền tảng thương mại điện tử dịch vụ tốt nhất." />
            </Helmet>
            <div className="space-y-16">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center py-20 px-4 bg-gradient-to-br from-gray-900 to-blue-900/30 rounded-lg"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
                        Tìm Dịch Vụ Hoàn Hảo, <span className="text-blue-400">Ngay Lập Tức</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Kết nối với các chuyên gia tài năng để hoàn thành công việc của bạn. Từ thiết kế đến phát triển, chúng tôi có tất cả.
                    </p>
                    <Link to="/services">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                            Khám Phá Dịch Vụ <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </motion.section>

                {/* Featured Services */}
                <section>
                    <h2 className="text-4xl font-bold text-center mb-10">Dịch Vụ Nổi Bật</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredServices.map((service, index) => (
                            <ServiceCard key={service.id} service={service} index={index} />
                        ))}
                    </div>
                </section>

                {/* Categories Section */}
                <section>
                    <h2 className="text-4xl font-bold text-center mb-10">Khám Phá Theo Danh Mục</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link to={`/services?category=${cat.name}`}>
                                    <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white text-base px-6 py-4">
                                        {cat.name}
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;