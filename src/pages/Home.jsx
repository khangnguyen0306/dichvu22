import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { serviceService, categoryService } from '@/service';
import { ArrowRight, Star, Loader2, AlertCircle, Clock, MapPin, CheckCircle, Users, Award, Shield, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { truncateText } from '@/utils/textUtils';

const ServiceCard = ({ service, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex flex-col group"
    >
        <div className="h-48 w-full overflow-hidden relative">
            <img 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                alt={service.name}
                src={service.images && service.images.length > 0 ? service.images[0] : '/placeholder-image.jpg'}
            />
            <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    service.availability === 'available' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                }`}>
                    {service.availability === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                </span>
            </div>
            <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    service.serviceType === 'onsite' ? 'bg-blue-600 text-white' :
                    service.serviceType === 'offsite' ? 'bg-red-600 text-white' :
                    'bg-purple-600 text-white'
                }`}>
                    {service.serviceType === 'onsite' ? 'Tại chỗ' :
                     service.serviceType === 'offsite' ? 'Tại nhà' : 'Cả hai'}
                </span>
            </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-blue-400 font-medium">
                    {service.categories && service.categories.length > 0 ? service.categories[0].name : 'Dịch vụ'}
                </p>
                <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                        {service.rating || 0} ({service.reviews ? service.reviews.length : 0})
                    </span>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{service.name}</h3>
            <p className="text-gray-400 mb-4 flex-grow text-sm leading-relaxed" title={service.description}>
                {truncateText(service.description, 80)}
            </p>
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.duration} phút</span>
                </div>
                {service.maxBookings && (
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Tối đa {service.maxBookings}</span>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mt-auto">
                <p className="text-lg font-semibold text-green-400">
                    {service.price ? `${service.price.toLocaleString('vi-VN')} VND` : 'Liên hệ'}
                </p>
                <Link to={`/services/${service._id}`}>
                    <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all">
                        Xem chi tiết
                    </Button>
                </Link>
            </div>
        </div>
    </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
    >
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

const Home = () => {
    const { toast } = useToast();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch services and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Fetch both services and categories in parallel
                const [servicesResponse, categoriesResponse] = await Promise.all([
                    serviceService.getServices(),
                    categoryService.getCategories()
                ]);
                
                setServices(servicesResponse.data || []);
                setCategories(categoriesResponse.data || categoriesResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Không thể tải dữ liệu');
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu trang chủ. Vui lòng thử lại.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    // Get featured services (first 6 services)
    const featuredServices = services.slice(0, 6);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-400">Đang tải trang chủ...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 text-lg mb-2">Không thể tải trang chủ</p>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Trang Chủ - URGENT</title>
                <meta name="description" content="Khám phá và đặt lịch các dịch vụ chất lượng cao từ các chuyên gia uy tín. URGENT là nền tảng kết nối dịch vụ tốt nhất." />
            </Helmet>
            <div className="space-y-20">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center py-24 px-4 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6"
                        >
                            <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium mb-4">
                                ✨ Dịch vụ chất lượng cao
                            </span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                            Dịch Vụ Chuyên Nghiệp, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ngay Tại Nhà</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
                            Khám phá hàng trăm dịch vụ chất lượng cao từ các chuyên gia uy tín. Từ chụp ảnh đến sửa chữa, chúng tôi kết nối bạn với những dịch vụ tốt nhất.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/services">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 rounded-xl shadow-lg">
                                    Khám Phá Dịch Vụ <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                                    <span>{services.length} dịch vụ</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1 text-blue-400" />
                                    <span>Chuyên gia uy tín</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Tại Sao Chọn URGENT?</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Chúng tôi cam kết mang đến những dịch vụ chất lượng nhất với trải nghiệm tuyệt vời
                        </p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Award}
                            title="Chất Lượng Cao"
                            description="Tất cả dịch vụ đều được kiểm định chất lượng và đánh giá bởi khách hàng"
                            color="bg-yellow-600"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="An Toàn & Bảo Mật"
                            description="Thông tin cá nhân được bảo vệ tuyệt đối, thanh toán an toàn"
                            color="bg-green-600"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Nhanh Chóng"
                            description="Đặt lịch nhanh chóng, dịch vụ được thực hiện đúng hẹn"
                            color="bg-blue-600"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Chuyên Gia Uy Tín"
                            description="Đội ngũ chuyên gia có kinh nghiệm và được đào tạo bài bản"
                            color="bg-purple-600"
                        />
                    </div>
                </section>

                {/* Featured Services */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Dịch Vụ Nổi Bật</h2>
                            <p className="text-gray-400">Khám phá những dịch vụ được yêu thích nhất</p>
                        </div>
                        <Link to="/services">
                            <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white rounded-xl">
                                Xem tất cả
                            </Button>
                        </Link>
                    </div>
                    
                    {featuredServices.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredServices.map((service, index) => (
                                <ServiceCard key={service._id} service={service} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-400 text-lg">Không có dịch vụ nổi bật nào để hiển thị.</p>
                        </div>
                    )}
                </section>

                {/* Categories Section */}
                <section>
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Khám Phá Theo Danh Mục</h2>
                            <p className="text-gray-400">Tìm dịch vụ phù hợp với nhu cầu của bạn</p>
                        </div>
                        <div className="text-sm text-gray-400">
                            {categories.length} danh mục
                        </div>
                    </div>
                    
                    {categories.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link to={`/services?categories=${category.name}`}>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300 group">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                    {category.name}
                                                </h3>
                                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            {category.description && (
                                                <p className="text-gray-400 text-sm leading-relaxed" title={category.description}>
                                                    {truncateText(category.description, 80)}
                                                </p>
                                            )}
                                            <div className="mt-4 flex items-center text-sm text-gray-400">
                                                <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                                    {services.filter(s => s.categories?.some(c => c.name === category.name)).length} dịch vụ
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-400 text-lg">Không có danh mục nào để hiển thị.</p>
                        </div>
                    )}
                </section>

                {/* Statistics Section */}
                <section className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">Thống Kê Ấn Tượng</h2>
                        <p className="text-gray-400">Những con số nói lên chất lượng dịch vụ của chúng tôi</p>
                    </motion.div>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h3 className="text-4xl font-bold text-blue-400 mb-2">{services.length}+</h3>
                            <p className="text-gray-400">Dịch vụ chất lượng</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-4xl font-bold text-green-400 mb-2">{categories.length}+</h3>
                            <p className="text-gray-400">Danh mục đa dạng</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h3 className="text-4xl font-bold text-purple-400 mb-2">
                                {services.filter(s => s.availability === 'available').length}+
                            </h3>
                            <p className="text-gray-400">Dịch vụ có sẵn</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h3 className="text-4xl font-bold text-yellow-400 mb-2">
                                {Math.round(services.reduce((acc, s) => acc + (s.rating || 0), 0) / Math.max(services.length, 1) * 10) / 10}
                            </h3>
                            <p className="text-gray-400">Điểm đánh giá trung bình</p>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Sẵn Sàng Đặt Lịch?</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            Khám phá ngay các dịch vụ chất lượng cao và đặt lịch với các chuyên gia uy tín
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/services">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg">
                                    Khám Phá Dịch Vụ <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 rounded-xl">
                                    Đăng Ký Ngay
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default Home;