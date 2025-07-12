import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { serviceService } from '@/service';
import { Button } from '@/components/ui/button';
import { Star, ArrowLeft, MapPin, Phone, User, Calendar, Clock, Loader2, AlertCircle, Package, CheckCircle, XCircle, Info } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';

const BookingDetail = () => {
    const { serviceId } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [bookingData, setBookingData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        address: '',
        bookingDate: '',
        bookingTime: '',
        notes: '',
        serviceType: 'onsite' // onsite or offsite
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch service data from API
    useEffect(() => {
        const fetchService = async () => {
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
            fetchService();
        }
    }, [serviceId, toast]);

    // Auto-fill form with user data when component mounts
    useEffect(() => {
        if (user) {
            setBookingData(prev => ({
                ...prev,
                customerName: user.username || '',
                customerEmail: user.email || '',
            }));
        }
    }, [user]);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!user) {
            toast({
                title: "Yêu cầu đăng nhập",
                description: "Bạn cần đăng nhập để đặt dịch vụ.",
                variant: "destructive",
            });
            navigate('/login');
        }
    }, [user, navigate, toast]);

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

    // Don't render if user is not logged in (will redirect anyway)
    if (!user) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
        const subtotal = service.price || 0;
        const serviceFee = subtotal * 0.05; // 5% phí dịch vụ
        return {
            subtotal,
            serviceFee,
            total: subtotal + serviceFee
        };
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
            <div key={day} className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">{days[day]}:</span>
                <span className="text-white">{hours}</span>
            </div>
        ));
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form
        if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.bookingDate) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        // Validate service type
        if (service.serviceType === 'onsite' && bookingData.serviceType === 'offsite') {
            toast({
                title: "Loại dịch vụ không phù hợp",
                description: "Dịch vụ này chỉ có thể thực hiện tại chỗ.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        if (service.serviceType === 'offsite' && bookingData.serviceType === 'onsite') {
            toast({
                title: "Loại dịch vụ không phù hợp",
                description: "Dịch vụ này chỉ có thể thực hiện tại nhà.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const pricing = calculateTotal();
            const orderData = {
                id: Date.now(),
                userId: user._id,
                userEmail: user.email,
                service: service,
                customer: bookingData,
                pricing: pricing,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Save to localStorage for demo
            const existingOrders = JSON.parse(localStorage.getItem('bookings') || '[]');
            localStorage.setItem('bookings', JSON.stringify([orderData, ...existingOrders]));

            toast({
                title: "Đặt lịch thành công!",
                description: `Đơn đặt lịch #${orderData.id} đã được tạo. Chúng tôi sẽ liên hệ với bạn sớm nhất.`,
            });

            // Redirect to success page or orders page
            navigate('/profile'); // Assuming there's a profile page to view orders
        } catch (error) {
            toast({
                title: "Lỗi đặt lịch",
                description: "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const pricing = calculateTotal();

    return (
        <>
            <Helmet>
                <title>Đặt lịch - {service.name} - DịchVụPro</title>
                <meta name="description" content={`Đặt lịch dịch vụ ${service.name} với giá ${service.price ? service.price.toLocaleString('vi-VN') : 'Liên hệ'} VND`} />
            </Helmet>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(`/services/${serviceId}`)}
                        className="text-blue-400 hover:bg-blue-400/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                    <h1 className="text-3xl font-bold text-white">Đặt lịch dịch vụ</h1>
                    <div className="ml-auto text-sm text-gray-400">
                        Đăng nhập với: <span className="text-blue-400 font-semibold">{user.username}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Thông tin đặt lịch</h2>
                            
                            <form onSubmit={handleSubmitBooking} className="space-y-6">
                                {/* Customer Information */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Họ tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={bookingData.customerName}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                            placeholder="Nhập họ tên của bạn"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            name="customerPhone"
                                            value={bookingData.customerPhone}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                            placeholder="Nhập số điện thoại"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        value={bookingData.customerEmail}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                        placeholder="Nhập email (không bắt buộc)"
                                    />
                                    {user.email && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Email đã được tự động điền từ tài khoản của bạn
                                        </p>
                                    )}
                                </div>

                                {/* Service Type Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        Loại dịch vụ
                                    </label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <label className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                            bookingData.serviceType === 'onsite' 
                                                ? 'border-blue-500 bg-blue-500/10' 
                                                : 'border-gray-600 bg-gray-700'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="serviceType"
                                                value="onsite"
                                                checked={bookingData.serviceType === 'onsite'}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                                disabled={service.serviceType === 'offsite'}
                                            />
                                            <div className="flex items-center">
                                                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                                                <div>
                                                    <div className="font-semibold text-white">Tại chỗ</div>
                                                    <div className="text-sm text-gray-400">Thực hiện tại studio</div>
                                                </div>
                                            </div>
                                        </label>
                                        <label className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                            bookingData.serviceType === 'offsite' 
                                                ? 'border-red-500 bg-red-500/10' 
                                                : 'border-gray-600 bg-gray-700'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="serviceType"
                                                value="offsite"
                                                checked={bookingData.serviceType === 'offsite'}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                                disabled={service.serviceType === 'onsite'}
                                            />
                                            <div className="flex items-center">
                                                <MapPin className="w-5 h-5 mr-2 text-red-400" />
                                                <div>
                                                    <div className="font-semibold text-white">Tại nhà</div>
                                                    <div className="text-sm text-gray-400">Thực hiện tại nhà bạn</div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Địa chỉ {bookingData.serviceType === 'offsite' ? 'thực hiện dịch vụ' : 'studio'} *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={bookingData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                        placeholder={bookingData.serviceType === 'offsite' 
                                            ? "Nhập địa chỉ chi tiết để thực hiện dịch vụ" 
                                            : "Nhập địa chỉ studio (nếu có yêu cầu đặc biệt)"}
                                        required={bookingData.serviceType === 'offsite'}
                                    />
                                </div>

                                {/* Booking Date & Time */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-2" />
                                            Ngày mong muốn thực hiện *
                                        </label>
                                        <input
                                            type="date"
                                            name="bookingDate"
                                            value={bookingData.bookingDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">
                                            <Clock className="w-4 h-4 inline mr-2" />
                                            Giờ thực hiện
                                        </label>
                                        <input
                                            type="time"
                                            name="bookingTime"
                                            value={bookingData.bookingTime}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={bookingData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                        placeholder="Yêu cầu đặc biệt hoặc ghi chú khác..."
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-xl sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-4">Chi tiết đặt lịch</h3>
                            
                            {/* User Info */}
                            <div className="border-b border-gray-600 pb-3 mb-4">
                                <p className="text-sm text-gray-400">Khách hàng</p>
                                <p className="text-white font-semibold">{user.username}</p>
                                <p className="text-gray-300 text-sm">{user.email}</p>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    user.isEmailVerified ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                }`}>
                                    {user.isEmailVerified ? 'Email đã xác thực' : 'Email chưa xác thực'}
                                </span>
                            </div>
                            
                            {/* Service Info */}
                            <div className="border-b border-gray-600 pb-4 mb-4">
                                <img 
                                    src={service.images && service.images.length > 0 ? service.images[0] : '/placeholder-image.jpg'} 
                                    alt={service.name}
                                    className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h4 className="font-semibold text-white">{service.name}</h4>
                                <p className="text-sm text-gray-400">
                                    {service.categories && service.categories.length > 0 
                                        ? service.categories[0].name 
                                        : 'Dịch vụ'}
                                </p>
                                <div className="flex items-center mt-2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm text-gray-300 ml-1">
                                        {service.rating || 0} ({service.reviews ? service.reviews.length : 0} đánh giá)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-300">{service.duration} phút</span>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        service.availability === 'available' 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-red-600 text-white'
                                    }`}>
                                        {service.availability === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                                    </span>
                                    {service.maxBookings && (
                                        <span className="text-xs text-gray-400">
                                            <Package className="w-3 h-3 inline mr-1" />
                                            Tối đa {service.maxBookings} đặt lịch
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Service Details */}
                            {service.requirements && service.requirements.length > 0 && (
                                <div className="border-b border-gray-600 pb-4 mb-4">
                                    <h5 className="text-sm font-bold text-gray-300 mb-2">Yêu cầu:</h5>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        {service.requirements.slice(0, 3).map((req, index) => (
                                            <li key={index} className="flex items-start">
                                                <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Working Hours */}
                            {service.workingHours && (
                                <div className="border-b border-gray-600 pb-4 mb-4">
                                    <h5 className="text-sm font-bold text-gray-300 mb-2">Giờ làm việc:</h5>
                                    <div className="text-xs">
                                        {formatWorkingHours(service.workingHours)}
                                    </div>
                                </div>
                            )}

                            {/* Pricing */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-300">
                                    <span>Giá dịch vụ:</span>
                                    <span>{service.price ? `${service.price.toLocaleString('vi-VN')} VND` : 'Liên hệ'}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Thời gian:</span>
                                    <span>{service.duration} phút</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Tạm tính:</span>
                                    <span>{pricing.subtotal.toLocaleString('vi-VN')} VND</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Phí dịch vụ (5%):</span>
                                    <span>{pricing.serviceFee.toLocaleString('vi-VN')} VND</span>
                                </div>
                                <div className="border-t border-gray-600 pt-3 flex justify-between text-xl font-bold text-white">
                                    <span>Tổng cộng:</span>
                                    <span className="text-blue-400">{pricing.total.toLocaleString('vi-VN')} VND</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                onClick={handleSubmitBooking}
                                disabled={isSubmitting || service.availability !== 'available'}
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                            </Button>
                            
                            <p className="text-xs text-gray-400 text-center mt-3">
                                Bằng cách đặt lịch, bạn đồng ý với điều khoản dịch vụ của chúng tôi
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default BookingDetail; 