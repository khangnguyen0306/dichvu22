import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { serviceService } from '@/service';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, MessageSquare, Loader2, AlertCircle, Package, Info, Clock, MapPin, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';

const ServiceDetail = () => {
    const { serviceId } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  console.log(service)

    useEffect(() => {
        const fetchServiceDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await serviceService.getServiceById(serviceId);
                setService(response.data);
            } catch (error) {
                console.error('Error fetching service:', error);
                setError(error.message || 'Không thể tải thông tin dịch vụ');
                toast({
                    title: "Lỗi",
                    description: "Không thể tải thông tin dịch vụ. Vui lòng thử lại.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (serviceId) {
            fetchServiceDetail();
        }
    }, [serviceId, toast]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-400">Đang tải thông tin dịch vụ...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h1 className="text-3xl text-white mb-2">
                    {error ? 'Lỗi tải dịch vụ' : 'Dịch vụ không tồn tại'}
                </h1>
                <p className="text-gray-400 mb-4">{error || 'Dịch vụ bạn tìm kiếm không tồn tại hoặc đã bị xóa.'}</p>
                <Link to="/services">
                    <Button className="mt-4">Quay lại trang dịch vụ</Button>
                </Link>
            </div>
        );
    }
    
    const handleBookNow = () => {
        navigate(`/booking/${serviceId}`);
    };

    const handleContactSeller = () => {
        toast({
            title: "🚧 Tính năng này chưa được triển khai!",
            description: "Đừng lo! Bạn có thể yêu cầu nó trong lần nhắc tiếp theo! 🚀",
            variant: "destructive",
        });
    };

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
                <title>{service.name} - URGENT</title>
                <meta name="description" content={service.description.substring(0, 160)} />
            </Helmet>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 p-8 rounded-lg shadow-xl"
            >
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {/* Shop Info */}
                        {service.shopId && (
                            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                                 onClick={() => navigate(`/shop/${service.shopId._id || service.shopId.id}`)}>
                                {service.shopId.shopLogoUrl ? (
                                    <img 
                                        src={service.shopId.shopLogoUrl} 
                                        alt={service.shopId.shopName || service.shopId.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {(service.shopId.shopName || service.shopId.name || 'S').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-white hover:text-blue-400 transition-colors">
                                        {service.shopId.shopName || service.shopId.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">Nhấn để xem thông tin shop</p>
                                </div>
                            </div>
                        )}

                        {/* Service Category and Name */}
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-blue-400 font-semibold">
                                {service.categories && service.categories.length > 0 
                                    ? service.categories[0].name 
                                    : 'Dịch vụ'}
                            </p>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                service.availability === 'available' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-red-600 text-white'
                            }`}>
                                {service.availability === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl font-bold my-2">{service.name}</h1>
                        
                        {/* Service Info */}
                        <div className="flex flex-wrap items-center gap-4 text-lg mb-4">
                            <div className="flex items-center text-yellow-400">
                                <Star className="w-6 h-6 fill-current" />
                                <span className="ml-1 font-bold">{service.rating || 0}</span>
                                <span className="text-gray-400 ml-1">
                                    ({service.reviews ? service.reviews.length : 0} đánh giá)
                                </span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <Clock className="w-5 h-5 mr-1" />
                                <span>{service.duration} phút</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <MapPin className="w-5 h-5 mr-1" />
                                <span className={`px-2 py-1 rounded text-xs ${
                                    service.serviceType === 'onsite' ? 'bg-blue-600 text-white' :
                                    service.serviceType === 'offsite' ? 'bg-red-600 text-white' :
                                    'bg-purple-600 text-white'
                                }`}>
                                    {service.serviceType === 'onsite' ? 'Tại chỗ' :
                                     service.serviceType === 'offsite' ? 'Tại nhà' : 'Cả hai'}
                                </span>
                            </div>
                        </div>

                        {/* Service Images */}
                        <div className="my-6">
                            {service.images && service.images.length > 0 ? (
                                <div>
                                    <img  
                                        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md mb-4"
                                        alt={service.name}
                                        src={service.images[selectedImageIndex]}
                                    />
                                    {service.images.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {service.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`${service.name} ${index + 1}`}
                                                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                                                        selectedImageIndex === index 
                                                            ? 'border-blue-400' 
                                                            : 'border-gray-600'
                                                    }`}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-[400px] bg-gray-700 rounded-lg flex items-center justify-center">
                                    <Package className="w-16 h-16 text-gray-500" />
                                </div>
                            )}
                        </div>

                        {/* Service Description */}
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-2">Mô tả dịch vụ</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-6">{service.description}</p>

                        {/* Requirements */}
                        {service.requirements && service.requirements.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2" />
                                    Yêu cầu
                                </h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {service.requirements.map((requirement, index) => (
                                        <li key={index}>{requirement}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Includes */}
                        {service.includes && service.includes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                                    Bao gồm
                                </h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {service.includes.map((include, index) => (
                                        <li key={index} className="text-green-300">{include}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Excludes */}
                        {service.excludes && service.excludes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <XCircle className="w-5 h-5 mr-2 text-red-400" />
                                    Không bao gồm
                                </h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {service.excludes.map((exclude, index) => (
                                        <li key={index} className="text-red-300">{exclude}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Notes */}
                        {service.notes && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4">Ghi chú</h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{service.notes}</p>
                            </div>
                        )}

                        {/* Working Hours */}
                        {service.workingHours && (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Giờ làm việc
                                </h3>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    {formatWorkingHours(service.workingHours)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Section */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-700 p-6 rounded-lg sticky top-24">
                            <p className="text-3xl font-bold text-center mb-2 text-green-400">
                                {service.price ? `${service.price.toLocaleString('vi-VN')} VND` : 'Liên hệ'}
                            </p>
                            
                            {service.maxBookings && (
                                <p className="text-center text-gray-300 mb-4">
                                    <Package className="w-4 h-4 inline mr-1" />
                                    Tối đa {service.maxBookings} đặt lịch
                                </p>
                            )}

                            <div className="text-center text-gray-300 mb-4">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Thời gian: {service.duration} phút
                            </div>

                            <Button 
                                onClick={handleBookNow} 
                                size="lg" 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 mb-4"
                                disabled={service.availability !== 'available'}
                            >
                                <ShoppingCart className="mr-2" /> 
                                Đặt lịch ngay
                            </Button>
                            
                            <Button 
                                onClick={handleContactSeller} 
                                variant="outline" 
                                size="lg" 
                                className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg py-6"
                            >
                                <MessageSquare className="mr-2" /> Liên hệ tư vấn
                            </Button>

                            {/* Service Categories */}
                            {service.categories && service.categories.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-bold text-gray-300 mb-2">Danh mục:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {service.categories.map((category, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Service Type */}
                            <div className="mt-4">
                                <h4 className="text-sm font-bold text-gray-300 mb-2">Loại dịch vụ:</h4>
                                <span className={`px-2 py-1 rounded text-xs ${
                                    service.serviceType === 'onsite' ? 'bg-blue-600 text-white' :
                                    service.serviceType === 'offsite' ? 'bg-red-600 text-white' :
                                    'bg-purple-600 text-white'
                                }`}>
                                    {service.serviceType === 'onsite' ? 'Tại chỗ' :
                                     service.serviceType === 'offsite' ? 'Tại nhà' : 'Cả hai'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ServiceDetail;