import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';
import { bookingService, userService } from '@/service';
import { formatCurrency, formatDate } from '@/utils/textUtils';
import { useSearchParams } from 'react-router-dom';
import { 
    User, 
    Mail, 
    Lock, 
    Calendar, 
    Clock, 
    MapPin, 
    Package, 
    CheckCircle, 
    XCircle, 
    Clock as ClockIcon,
    Loader2,
    AlertCircle,
    Filter,
    Search,
    CreditCard,
    Store,
    Star as StarIcon
} from 'lucide-react';
import { reviewService } from '@/service';

const Profile = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    
    // Profile form states
    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        address: user?.address || '',
        email: user?.email || ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Password form states
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    // Get default tab from URL parameter
    const defaultTab = searchParams.get('tab') === 'bookings' ? 'bookings' : 'profile';
    
    // Booking history states
    const [bookings, setBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [bookingFilter, setBookingFilter] = useState('all'); // all, pending, completed, cancelled
    const [paymentFilter, setPaymentFilter] = useState('all'); // all, pending, paid, refunded
    const [searchKeyword, setSearchKeyword] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    // State cho form đánh giá booking
    const [openReviewBookingId, setOpenReviewBookingId] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    // Update profile form when user data changes
    useEffect(() => {
        if (user) {
            setProfileForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                address: user.address || '',
                email: user.email || ''
            });
        }
    }, [user]);

    // Handle profile form input changes
    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fetch user's booking history
    const fetchBookings = async (page = 1) => {
        if (!user?.email) return;
        
        try {
            setIsLoadingBookings(true);
            setBookingError(null);
            
            const params = {
                page,
                limit: 10
            };
            
            // Add filters
            if (bookingFilter !== 'all') {
                params.status = bookingFilter;
            }
            if (paymentFilter !== 'all') {
                params.paymentStatus = paymentFilter;
            }
            if (searchKeyword) {
                params.search = searchKeyword;
            }
            
            const response = await bookingService.getUserBookings(user.email, params);
            setBookings(response.data || []);
            setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookingError(error.message);
            toast({
                title: "Lỗi",
                description: "Không thể tải lịch sử đặt lịch. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingBookings(false);
        }
    };

    useEffect(() => {
        fetchBookings(1);
    }, [user, bookingFilter, paymentFilter, searchKeyword]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
            toast({
                title: "Thông tin không hợp lệ",
                description: "Vui lòng nhập đầy đủ tên và họ.",
                variant: "destructive",
            });
            return;
        }

        setIsUpdating(true);
        try {
            await userService.updateProfile(profileForm);
            
            toast({
                title: "Cập nhật thành công!",
                description: "Thông tin hồ sơ của bạn đã được cập nhật.",
            });
        } catch (error) {
            console.error('Profile update error:', error);
            toast({
                title: "Lỗi cập nhật",
                description: error.message || "Có lỗi xảy ra khi cập nhật hồ sơ.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast({
                title: "Thông tin không đầy đủ",
                description: "Vui lòng điền đầy đủ tất cả trường mật khẩu.",
                variant: "destructive",
            });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({
                title: "Mật khẩu không khớp",
                description: "Mật khẩu mới và xác nhận mật khẩu không giống nhau.",
                variant: "destructive",
            });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast({
                title: "Mật khẩu quá ngắn",
                description: "Mật khẩu mới phải có ít nhất 6 ký tự.",
                variant: "destructive",
            });
            return;
        }

        setIsChangingPassword(true);
        try {
            await userService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            
            // Clear form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            toast({
                title: "Đổi mật khẩu thành công!",
                description: "Mật khẩu của bạn đã được thay đổi.",
            });
        } catch (error) {
            console.error('Password change error:', error);
            toast({
                title: "Lỗi đổi mật khẩu",
                description: error.message || "Có lỗi xảy ra khi đổi mật khẩu.",
                variant: "destructive",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Handle password form input changes
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Gửi đánh giá booking
    const handleReviewSubmit = async (e, booking) => {
        console.log(booking);
        e.preventDefault();
        if (!reviewForm.rating || !reviewForm.comment.trim()) {
            toast({
                title: 'Vui lòng nhập đủ số sao và bình luận!',
                variant: 'destructive',
            });
            return;
        }
        setSubmittingReview(true);
        try {
            await reviewService.createServiceReview(booking._id, {
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            });
            toast({ title: 'Đánh giá thành công!' });
            setOpenReviewBookingId(null);
            setReviewForm({ rating: 0, comment: '' });
        } catch (err) {
            toast({
                title: 'Gửi đánh giá thất bại',
                description: err?.message || 'Có lỗi xảy ra',
                variant: 'destructive',
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-600 text-white', icon: ClockIcon, text: 'Chờ xử lý' },
            confirmed: { color: 'bg-blue-600 text-white', icon: CheckCircle, text: 'Đã xác nhận' },
            completed: { color: 'bg-green-600 text-white', icon: CheckCircle, text: 'Hoàn thành' },
            canceled: { color: 'bg-red-600 text-white', icon: XCircle, text: 'Đã hủy' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const paymentConfig = {
            pending: { color: 'bg-yellow-600 text-white', icon: ClockIcon, text: 'Chờ thanh toán' },
            paid: { color: 'bg-green-600 text-white', icon: CheckCircle, text: 'Đã thanh toán' },
            failed: { color: 'bg-red-600 text-white', icon: XCircle, text: 'Thanh toán thất bại' }
        };
        
        const config = paymentConfig[paymentStatus] || paymentConfig.pending;
        const Icon = config.icon;
        
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    const getServiceTypeBadge = (serviceType) => {
        return (
            <p className={`px-2 py-1 rounded text-xs font-bold ${
                serviceType === 'onsite' ? 'bg-blue-600 text-white' :
                serviceType === 'offsite' ? 'bg-red-600 text-white' :
                'bg-purple-600 text-white'
            }`}>
                {serviceType === 'onsite' ? 'Tại chỗ' :
                 serviceType === 'offsite' ? 'Tại nhà' : 'Cả hai'}
            </p>
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBookings(1);
    };

    const handlePageChange = (newPage) => {
        fetchBookings(newPage);
    };

    return (
        <>
            <Helmet>
                <title>Hồ Sơ Của Tôi - URGENT</title>
                <meta name="description" content="Xem và chỉnh sửa thông tin hồ sơ cá nhân của bạn trên URGENT." />
            </Helmet>
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-blue-400">Hồ Sơ Của Tôi</h1>

                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                        <TabsTrigger value="profile">
                            <User className="mr-2 h-4 w-4" />
                            Thông Tin Cá Nhân
                        </TabsTrigger>
                        <TabsTrigger value="bookings">
                            <Calendar className="mr-2 h-4 w-4" />
                            Lịch Sử Đặt Lịch
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <div className="space-y-8">
                            {/* Profile Info */}
                            <Card className="bg-gray-800 border-gray-700 shadow-xl">
                                <CardHeader className="pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white text-xl">Thông Tin Cá Nhân</CardTitle>
                                            <p className="text-gray-400 text-sm">Cập nhật thông tin hồ sơ của bạn</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        {/* Name Fields Row */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-bold text-gray-300 block mb-2">
                                                    <User className="w-4 h-4 inline mr-2" />
                                                    Tên <span className="text-red-400">*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    value={profileForm.firstName} 
                                                    onChange={handleProfileInputChange} 
                                                    name="firstName"
                                                    placeholder="Nhập tên của bạn"
                                                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-300 block mb-2">
                                                    <User className="w-4 h-4 inline mr-2" />
                                                    Họ <span className="text-red-400">*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    value={profileForm.lastName} 
                                                    onChange={handleProfileInputChange} 
                                                    name="lastName"
                                                    placeholder="Nhập họ của bạn"
                                                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                Email
                                                <span className="ml-2 px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full">
                                                    Chỉ đọc
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type="email" 
                                                    value={profileForm.email} 
                                                    name="email"
                                                    className="w-full p-3 bg-gray-600 rounded-lg border border-gray-500 text-gray-300 cursor-not-allowed"
                                                    readOnly
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Email không thể thay đổi sau khi đăng ký
                                            </p>
                                        </div>

                                        {/* Address Field */}
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">
                                                <MapPin className="w-4 h-4 inline mr-2" />
                                                Địa chỉ
                                            </label>
                                            <textarea
                                                value={profileForm.address} 
                                                onChange={handleProfileInputChange} 
                                                name="address"
                                                placeholder="Nhập địa chỉ của bạn (tùy chọn)"
                                                rows="3"
                                                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400 resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-4 border-t border-gray-600">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-400">
                                                    <span className="text-red-400">*</span> Trường bắt buộc
                                                </p>
                                                <Button 
                                                    type="submit" 
                                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Đang cập nhật...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Cập Nhật Hồ Sơ
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Change Password */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Thay Đổi Mật Khẩu</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">
                                                <Lock className="w-4 h-4 inline mr-2" />
                                                Mật Khẩu Hiện Tại
                                            </label>
                                            <input 
                                                type="password" 
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white" 
                                                name="currentPassword"
                                                value={passwordForm.currentPassword}
                                                onChange={handlePasswordInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">
                                                <Lock className="w-4 h-4 inline mr-2" />
                                                Mật Khẩu Mới
                                            </label>
                                            <input 
                                                type="password" 
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white" 
                                                name="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={handlePasswordInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">
                                                <Lock className="w-4 h-4 inline mr-2" />
                                                Xác Nhận Mật Khẩu Mới
                                            </label>
                                            <input 
                                                type="password" 
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white" 
                                                name="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={handlePasswordInputChange}
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isChangingPassword}>
                                                {isChangingPassword ? (
                                                    <>
                                                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                        Đổi mật khẩu...
                                                    </>
                                                ) : (
                                                    "Thay Đổi Mật Khẩu"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="bookings">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Lịch Sử Đặt Lịch</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Filters and Search */}
                                <div className="mb-6 space-y-4">
                                    <form onSubmit={handleSearch} className="space-y-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1">
                                                <label className="text-sm font-bold text-gray-300 block mb-2">
                                                    <Search className="w-4 h-4 inline mr-2" />
                                                    Tìm kiếm
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Tìm theo tên dịch vụ hoặc shop..."
                                                    value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-300 block mb-2">
                                                    <Filter className="w-4 h-4 inline mr-2" />
                                                    Trạng thái đặt lịch
                                                </label>
                                                <select
                                                    value={bookingFilter}
                                                    onChange={(e) => setBookingFilter(e.target.value)}
                                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                                >
                                                    <option value="all">Tất cả</option>
                                                    <option value="pending">Chờ xử lý</option>
                                                    <option value="confirmed">Đã xác nhận</option>
                                                    <option value="completed">Hoàn thành</option>
                                                    <option value="canceled">Đã hủy</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-300 block mb-2">
                                                    <CreditCard className="w-4 h-4 inline mr-2" />
                                                    Trạng thái thanh toán
                                                </label>
                                                <select
                                                    value={paymentFilter}
                                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                                >
                                                    <option value="all">Tất cả</option>
                                                    <option value="pending">Chờ thanh toán</option>
                                                    <option value="paid">Đã thanh toán</option>
                                                    <option value="failed">Thanh toán thất bại</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                                <Search className="w-4 h-4 mr-2" />
                                                Tìm kiếm
                                            </Button>
                                        </div>
                                    </form>
                                </div>

                                {/* Bookings List */}
                                {isLoadingBookings ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                                            <p className="text-gray-400">Đang tải lịch sử đặt lịch...</p>
                                        </div>
                                    </div>
                                ) : bookingError ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                                            <p className="text-red-400 text-lg mb-2">Không thể tải lịch sử</p>
                                            <p className="text-gray-400 mb-4">{bookingError}</p>
                                            <Button 
                                                onClick={() => fetchBookings(1)} 
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                Thử lại
                                            </Button>
                                        </div>
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-2xl text-gray-400 mb-2">Không có đặt lịch nào</p>
                                        <p className="text-gray-500">
                                            {searchKeyword || bookingFilter !== 'all' || paymentFilter !== 'all'
                                                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.' 
                                                : 'Bạn chưa có lịch sử đặt lịch nào.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => (
                                            <div key={booking._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <h3 className="font-semibold text-white">{booking.serviceId?.name || 'Dịch vụ'}</h3>
                                                            {getStatusBadge(booking.status)}
                                                            {getPaymentStatusBadge(booking.paymentStatus)}
                                                            {getServiceTypeBadge(booking.serviceType)}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300 mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Store className="w-4 h-4" />
                                                                <span className="truncate">{booking.shopId?.shopName || 'Shop'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>Ngày: {formatDate(booking.bookingDate)}</span>
                                                            </div>
                                                            {booking.bookingTime && (
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>Giờ: {booking.bookingTime}</span>
                                                                </div>
                                                            )}
                                                            {booking.address && (
                                                                <div className="flex items-center gap-2 md:col-span-2">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span className="truncate">{booking.address}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {booking.notes && (
                                                            <p className="text-sm text-gray-400 mb-2">
                                                                <span className="font-medium">Ghi chú:</span> {booking.notes}
                                                            </p>
                                                        )}
                                                        
                                                        <div className="text-xs text-gray-400">
                                                            ID: {booking._id}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold text-green-400">
                                                                {formatCurrency(booking.totalAmount)}
                                                            </p>
                                                            {booking.depositAmount && (
                                                                <p className="text-sm text-gray-400">
                                                                    Đặt cọc: {formatCurrency(booking.depositAmount)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {/* Nút đánh giá cho booking đã hoàn thành */}
                                                        {booking.status === 'completed' && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    className="mt-2"
                                                                    onClick={() => {
                                                                        setOpenReviewBookingId(booking._id);
                                                                        setReviewForm({ rating: 0, comment: '' });
                                                                    }}
                                                                    disabled={openReviewBookingId === booking._id}
                                                                >
                                                                    Đánh giá
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Form đánh giá */}
                                                {openReviewBookingId === booking._id && (
                                                    <form onSubmit={e => handleReviewSubmit(e, booking)} className="mt-4 bg-gray-800 p-4 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {[1,2,3,4,5].map((star) => (
                                                                <button
                                                                    type="button"
                                                                    key={star}
                                                                    onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                                                                    className="focus:outline-none"
                                                                >
                                                                    <StarIcon
                                                                        className={`w-7 h-7 ${reviewForm.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                                                                        fill={reviewForm.rating >= star ? '#facc15' : 'none'}
                                                                    />
                                                                </button>
                                                            ))}
                                                            <span className="ml-2 text-gray-300">{reviewForm.rating > 0 ? `${reviewForm.rating} sao` : ''}</span>
                                                        </div>
                                                        <textarea
                                                            className="w-full p-2 rounded bg-gray-900 text-gray-100 mb-2 border border-gray-600 focus:border-blue-400"
                                                            rows={3}
                                                            placeholder="Nhập bình luận của bạn..."
                                                            value={reviewForm.comment}
                                                            onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                                                            disabled={submittingReview}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button type="submit" className="mt-2" disabled={submittingReview}>
                                                                {submittingReview ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                                                Gửi đánh giá
                                                            </Button>
                                                            <Button type="button" variant="ghost" className="mt-2" onClick={() => setOpenReviewBookingId(null)} disabled={submittingReview}>
                                                                Hủy
                                                            </Button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        ))}
                                        
                                        {/* Pagination */}
                                        {pagination.pages > 1 && (
                                            <div className="flex justify-center mt-6">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                                                        disabled={pagination.page === 1}
                                                    >
                                                        Trước
                                                    </Button>
                                                    <span className="px-4 py-2 text-gray-300">
                                                        Trang {pagination.page} / {pagination.pages}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                                                        disabled={pagination.page === pagination.pages}
                                                    >
                                                        Sau
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default Profile;