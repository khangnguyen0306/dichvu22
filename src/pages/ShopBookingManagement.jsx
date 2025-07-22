import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { formatCurrency, formatDate, truncateText } from '@/utils/textUtils';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    Phone, 
    Mail, 
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
    Check,
    X
} from 'lucide-react';

const ShopBookingManagement = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    
    // Booking states
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    // Action states
    const [processingBooking, setProcessingBooking] = useState(null);

    // Fetch shop bookings
    const fetchBookings = async (page = 1) => {
        if (!user?.shopId) return;
        
        try {
            setIsLoading(true);
            setError(null);
            
            const params = {
                page,
                limit: 10
            };
            
            // Add filters
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            if (paymentFilter !== 'all') {
                params.paymentStatus = paymentFilter;
            }
            if (searchKeyword) {
                params.search = searchKeyword;
            }
            
            const response = await bookingService.getShopBookings(user.shopId, params);
            setBookings(response.data || []);
            setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError(error.message);
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách đặt lịch. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(1);
    }, [user, statusFilter, paymentFilter, searchKeyword]);

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

    const handleAcceptBooking = async (bookingId) => {
        try {
            setProcessingBooking(bookingId);
            await bookingService.updateBookingStatus(bookingId, 'completed');
            
            toast({
                title: "Thành công",
                description: "Đã chấp nhận đặt lịch.",
            });
            
            // Refresh bookings
            fetchBookings(pagination.page);
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast({
                title: "Lỗi",
                description: error.message || "Không thể chấp nhận đặt lịch.",
                variant: "destructive",
            });
        } finally {
            setProcessingBooking(null);
        }
    };

    const handleRejectBooking = async (bookingId) => {
        try {
            setProcessingBooking(bookingId);
            await bookingService.updateBookingStatus(bookingId, 'cancelled');
            
            toast({
                title: "Thành công",
                description: "Đã từ chối đặt lịch.",
            });
            
            // Refresh bookings
            fetchBookings(pagination.page);
        } catch (error) {
            console.error('Error rejecting booking:', error);
            toast({
                title: "Lỗi",
                description: error.message || "Không thể từ chối đặt lịch.",
                variant: "destructive",
            });
        } finally {
            setProcessingBooking(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBookings(1);
    };

    const handlePageChange = (newPage) => {
        fetchBookings(newPage);
    };

    // Filter out pending bookings from display
    const filteredBookings = bookings.filter(booking => booking.status !== 'pending');

    return (
        <>
            <Helmet>
                <title>Quản Lý Đặt Lịch - URGENT</title>
                <meta name="description" content="Quản lý đặt lịch của shop trên URGENT." />
            </Helmet>
            
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-blue-400">Quản Lý Đặt Lịch</h1>
                    <div className="text-sm text-gray-400">
                        Shop: <span className="text-blue-400 font-semibold">{user?.shopName}</span>
                    </div>
                </div>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Bộ Lọc & Tìm Kiếm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-300 block mb-2">
                                        <Search className="w-4 h-4 inline mr-2" />
                                        Tìm kiếm
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Tìm theo tên khách hàng, dịch vụ..."
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
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                    >
                                        <option value="all">Tất cả</option>
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
                                <div className="flex items-end">
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                        <Search className="w-4 h-4 mr-2" />
                                        Tìm kiếm
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Bookings List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                            <p className="text-gray-400">Đang tải danh sách đặt lịch...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                            <p className="text-red-400 text-lg mb-2">Không thể tải danh sách</p>
                            <p className="text-gray-400 mb-4">{error}</p>
                            <Button 
                                onClick={() => fetchBookings(1)} 
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Thử lại
                            </Button>
                        </div>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-2xl text-gray-400 mb-2">Không có đặt lịch nào</p>
                        <p className="text-gray-500">
                            {searchKeyword || statusFilter !== 'all' || paymentFilter !== 'all'
                                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.' 
                                : 'Chưa có đặt lịch nào cho shop của bạn.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <h3 className="font-semibold text-white text-lg">{booking.serviceId?.name}</h3>
                                            {getStatusBadge(booking.status)}
                                            {getPaymentStatusBadge(booking.paymentStatus)}
                                            {getServiceTypeBadge(booking.serviceType)}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300 mb-3">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">{booking.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{booking.customerPhone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span className="truncate">{booking.customerEmail}</span>
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
                                                    <span className="truncate" title={booking.address}>
                                                        {truncateText(booking.address, 50)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {booking.notes && (
                                            <p className="text-sm text-gray-400 mb-2">
                                                <span className="font-medium">Ghi chú:</span> {truncateText(booking.notes, 100)}
                                            </p>
                                        )}
                                        
                                        <div className="text-xs text-gray-400">
                                            ID: {booking._id} | Tạo lúc: {formatDate(booking.createdAt)}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-3">
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
                                        
                                        {/* Action buttons for confirmed bookings */}
                                        {booking.status === 'confirmed' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAcceptBooking(booking._id)}
                                                    disabled={processingBooking === booking._id}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {processingBooking === booking._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                    Hoàn thành
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRejectBooking(booking._id)}
                                                    disabled={processingBooking === booking._id}
                                                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                >
                                                    {processingBooking === booking._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <X className="w-4 h-4" />
                                                    )}
                                                    Từ chối
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
            </div>
        </>
    );
};

export default ShopBookingManagement; 