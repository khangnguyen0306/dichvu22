import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Mail, Clock, Package, Users, Calendar, CheckCircle, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { shopService } from '@/service/shopService';
import { serviceService } from '@/service/serviceService';

const ServiceCard = ({ service }) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300 flex flex-col"
    >
        <div className="h-48 w-full overflow-hidden">
            <img  
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                alt={service.name}
                src={service.images && service.images.length > 0 ? service.images[0] : '/placeholder-image.jpg'}
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-400">
                    {service.categories && service.categories.length > 0 ? service.categories[0].name : 'Dịch vụ'}
                </p>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    service.availability === 'available' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                }`}>
                    {service.availability === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                </span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{service.name}</h3>
            <div className="flex items-center text-yellow-400 mb-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1">
                    {service.rating || 0} ({service.reviews ? service.reviews.length : 0} đánh giá)
                </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">
                {service.description && service.description.length > 100 
                    ? `${service.description.substring(0, 100)}...` 
                    : service.description}
            </p>
            <div className="flex items-center text-gray-400 text-sm mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>{service.duration} phút</span>
            </div>
            <div className="flex items-center text-gray-400 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className={`px-2 py-1 rounded text-xs ${
                    service.serviceType === 'onsite' ? 'bg-blue-600 text-white' :
                    service.serviceType === 'offsite' ? 'bg-red-600 text-white' :
                    'bg-purple-600 text-white'
                }`}>
                    {service.serviceType === 'onsite' ? 'Tại chỗ' :
                     service.serviceType === 'offsite' ? 'Tại nhà' : 'Cả hai'}
                </span>
            </div>
            {service.maxBookings && (
                <p className="text-gray-500 text-sm mb-4">
                    Tối đa: {service.maxBookings} đặt lịch
                </p>
            )}
            <div className="flex justify-between items-center mt-auto">
                <p className="text-lg font-semibold text-green-400">
                    {service.price ? `${service.price.toLocaleString('vi-VN')} VND` : 'Liên hệ'}
                </p>
                <Link to={`/services/${service._id}`}>
                    <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                        Xem chi tiết
                    </Button>
                </Link>
            </div>
        </div>
    </motion.div>
);

const ShopDetail = () => {
    const { shopId } = useParams();
    const { toast } = useToast();
    const [shop, setShop] = useState(null);
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShopDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Gọi API lấy thông tin shop
                const shopResponse = await shopService.getShopProfile(shopId);
                setShop(shopResponse.data);
                
                // Gọi API lấy tất cả dịch vụ của shop
                const servicesResponse = await serviceService.getServicesByShop(shopId);
                setServices(servicesResponse.data || []);
                
            } catch (error) {
                console.error('Error fetching shop:', error);
                setError(error.message || 'Không thể tải thông tin shop');
                toast({
                    title: "Lỗi",
                    description: "Không thể tải thông tin shop. Vui lòng thử lại.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (shopId) {
            fetchShopDetail();
        }
    }, [shopId, toast]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Đang tải thông tin shop...</p>
                </div>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl text-white mb-2">Shop không tồn tại</h1>
                <p className="text-gray-400 mb-4">{error || 'Shop bạn tìm kiếm không tồn tại hoặc đã bị xóa.'}</p>
                <Link to="/services">
                    <Button className="mt-4">Quay lại trang dịch vụ</Button>
                </Link>
            </div>
        );
    }

    const formatWorkingHours = (workingHours) => {
        if (!workingHours) return null;
        
        const days = {
            monday: 'Thứ 2',
            tuesday: 'Thứ 3', 
            wednesday: 'Thứ 4',
            thursday: 'Thứ 5',
            friday: 'Thứ 6',
            saturday: 'Thứ 7',
            sunday: 'Chủ nhật'
        };

        return Object.entries(workingHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between py-1">
                <span className="text-gray-400">{days[day]}:</span>
                <span className="text-white">{hours}</span>
            </div>
        ));
    };

    return (
        <>
            <Helmet>
                <title>{shop.shopName} - Shop Detail</title>
                <meta name="description" content={shop.description} />
            </Helmet>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 p-8 rounded-lg shadow-xl"
            >
                {/* Shop Header */}
                <div className="flex items-start gap-6 mb-8">
                    {shop.shopLogoUrl ? (
                        <img 
                            src={shop.shopLogoUrl} 
                            alt={shop.shopName}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-3xl">
                                {shop.shopName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{shop.shopName}</h1>
                            {shop.hasActivePackage && (
                                <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">
                                    Premium
                                </span>
                            )}
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                shop.approvalStatus === 'approved' ? 'bg-green-600 text-white' :
                                shop.approvalStatus === 'pending' ? 'bg-yellow-600 text-white' :
                                'bg-red-600 text-white'
                            }`}>
                                {shop.approvalStatus === 'approved' ? 'Đã duyệt' :
                                 shop.approvalStatus === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-lg mb-3">
                            <div className="flex items-center text-gray-400">
                                <Package className="w-5 h-5 mr-1" />
                                <span>Shop ID: {shop._id}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <Users className="w-5 h-5 mr-1" />
                                <span>Chủ shop: {shop.accountId?.username}</span>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed">{shop.shopDescription}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        {/* Contact Information */}
                        <div className="bg-gray-700 p-6 rounded-lg mb-6">
                            <h2 className="text-xl font-bold mb-4 text-white">Thông tin liên hệ</h2>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-300">
                                    <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>{shop.shopAddress}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Phone className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>{shop.contactPhone}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Mail className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>{shop.contactEmail}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Mail className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>Email chủ shop: {shop.accountId?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Business Information */}
                        <div className="bg-gray-700 p-6 rounded-lg mb-6">
                            <h2 className="text-xl font-bold mb-4 text-white">Thông tin doanh nghiệp</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Mã số thuế:</span>
                                        <span className="text-white font-semibold">{shop.taxId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Giấy phép kinh doanh:</span>
                                        <span className="text-white font-semibold">{shop.businessLicenseNumber}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Ngân hàng:</span>
                                        <span className="text-white font-semibold">{shop.bankName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Số tài khoản:</span>
                                        <span className="text-white font-semibold">{shop.bankAccountNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-gray-700 p-6 rounded-lg mb-6">
                            <h2 className="text-xl font-bold mb-4 text-white">Thông tin tài khoản</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Tên đăng nhập:</span>
                                    <span className="text-white font-semibold">{shop.accountId?.username}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Email:</span>
                                    <span className="text-white font-semibold">{shop.accountId?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Ngày tạo:</span>
                                    <span className="text-white font-semibold">
                                        {new Date(shop.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Cập nhật lần cuối:</span>
                                    <span className="text-white font-semibold">
                                        {new Date(shop.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="bg-gray-700 p-6 rounded-lg">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white">Dịch vụ của shop</h2>
                                <p className="text-gray-400 text-sm mt-1">Hiển thị {services.length} dịch vụ</p>
                            </div>
                            {services && services.length > 0 ? (
                                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {services.map(service => (
                                        <ServiceCard key={service._id || service.id} service={service} />
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">Chưa có dịch vụ nào</p>
                                        <p className="text-sm">Shop này chưa đăng ký dịch vụ nào.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-700 p-6 rounded-lg sticky top-24">
                            <h3 className="text-lg font-bold mb-4 text-white">Thông tin shop</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Trạng thái:</span>
                                    <span className={`font-semibold ${
                                        shop.isActive ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {shop.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Gói dịch vụ:</span>
                                    <span className={`font-semibold ${
                                        shop.hasActivePackage ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {shop.hasActivePackage ? 'Premium' : 'Cơ bản'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Phê duyệt:</span>
                                    <span className={`font-semibold ${
                                        shop.approvalStatus === 'approved' ? 'text-green-400' :
                                        shop.approvalStatus === 'pending' ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                        {shop.approvalStatus === 'approved' ? 'Đã duyệt' :
                                         shop.approvalStatus === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                    </span>
                                </div>
                            </div>
                            
                            <Button 
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                                onClick={() => toast({
                                    title: "Liên hệ shop",
                                    description: "Tính năng này sẽ được triển khai sớm!"
                                })}
                            >
                                Liên hệ shop
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ShopDetail; 