import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { dashboardService } from '@/service';
import { 
    Users, 
    ShoppingBag, 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    Calendar,
    Loader2,
    AlertCircle,
    UserCheck,
    UserX,
    Store,
    Package,
    BarChart3,
    ArrowUp,
    ArrowDown,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color, isLoading }) => (
    <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    {isLoading ? (
                        <div className="flex items-center mt-2">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                            <span className="ml-2 text-gray-400">Đang tải...</span>
                        </div>
                    ) : (
                        <p className="text-2xl font-bold text-white mt-1">{value}</p>
                    )}
                    {change !== undefined && !isLoading && (
                        <div className={`flex items-center mt-2 text-sm ${
                            change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {change >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                            <span>{Math.abs(change)}% so với tháng trước</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const AdminStatistics = () => {
    const { toast } = useToast();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [overview, setOverview] = useState(null);
    const [users, setUsers] = useState({ users: [], stats: null });
    const [shops, setShops] = useState(null);
    const [revenue, setRevenue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOverview = async () => {
        try {
            const response = await dashboardService.getOverview(currentMonth, currentYear);
            setOverview(response.data);
        } catch (error) {
            console.error('Error fetching overview:', error);
            toast({
                title: "Lỗi",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await dashboardService.getUsers(currentMonth, currentYear, currentPage, 10);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                title: "Lỗi",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const fetchShops = async () => {
        try {
            const response = await dashboardService.getShops(currentMonth, currentYear, currentPage, 10);
            setShops(response.data);
        } catch (error) {
            console.error('Error fetching shops:', error);
            toast({
                title: "Lỗi",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const fetchRevenue = async () => {
        try {
            const response = await dashboardService.getRevenue(currentMonth, currentYear);
            setRevenue(response.data);
        } catch (error) {
            console.error('Error fetching revenue:', error);
            toast({
                title: "Lỗi",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                await Promise.all([
                    fetchOverview(),
                    fetchUsers(),
                    fetchShops(),
                    fetchRevenue()
                ]);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [currentMonth, currentYear, currentPage]);

    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getApprovalStatusBadge = (status) => {
        const statusConfig = {
            approved: { color: 'bg-green-600 text-white', icon: CheckCircle, text: 'Đã duyệt' },
            pending: { color: 'bg-yellow-600 text-white', icon: Clock, text: 'Chờ duyệt' },
            rejected: { color: 'bg-red-600 text-white', icon: XCircle, text: 'Từ chối' }
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

    const getActiveStatusBadge = (isActive) => {
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold ${
                isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
            }`}>
                {isActive ? 'Hoạt động' : 'Không hoạt động'}
            </span>
        );
    };

    if (isLoading && !overview) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-400">Đang tải thống kê...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 text-lg mb-2">Không thể tải thống kê</p>
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
                <title>Thống Kê - URGENT</title>
                <meta name="description" content="Thống kê tổng quan hệ thống URGENT" />
            </Helmet>
            
            <div className="space-y-8 mt-[100px]">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-blue-400">Thống Kê Hệ Thống</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <select
                                value={currentMonth}
                                onChange={handleMonthChange}
                                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Tháng {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={currentYear}
                                onChange={handleYearChange}
                                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                            >
                                {Array.from({ length: 5 }, (_, i) => {
                                    const year = new Date().getFullYear() - 2 + i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Overview Cards */}
                {overview && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Tổng người dùng"
                            value={overview.totalUsers}
                            icon={Users}
                            color="bg-blue-600"
                            isLoading={isLoading}
                        />
                        <StatCard
                            title="Tổng cửa hàng"
                            value={overview.totalShops}
                            icon={Store}
                            color="bg-green-600"
                            isLoading={isLoading}
                        />
                        <StatCard
                            title="Tổng đơn hàng"
                            value={overview.totalOrders}
                            icon={Package}
                            color="bg-purple-600"
                            isLoading={isLoading}
                        />
                        <StatCard
                            title="Tổng doanh thu"
                            value={formatCurrency(overview.totalRevenue)}
                            icon={DollarSign}
                            color="bg-yellow-600"
                            isLoading={isLoading}
                        />
                    </div>
                )}

                {/* Monthly Statistics */}
                {overview && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Người dùng mới tháng này"
                            value={overview.newUsersThisMonth}
                            icon={UserCheck}
                            color="bg-green-600"
                            isLoading={isLoading}
                        />
                        <StatCard
                            title="Cửa hàng mới tháng này"
                            value={overview.newShopsThisMonth}
                            icon={Store}
                            color="bg-blue-600"
                            isLoading={isLoading}
                        />
                        <StatCard
                            title="Đơn hàng tháng này"
                            value={overview.ordersThisMonth}
                            icon={Package}
                            color="bg-purple-600"
                            isLoading={isLoading}
                        />
                        <StatCard
                            title="Doanh thu tháng này"
                            value={formatCurrency(overview.revenueThisMonth)}
                            icon={TrendingUp}
                            color="bg-yellow-600"
                            isLoading={isLoading}
                        />
                    </div>
                )}

                {/* Detailed Statistics */}
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                        <TabsTrigger value="users">
                            <Users className="mr-2 h-4 w-4" />
                            Người dùng
                        </TabsTrigger>
                        <TabsTrigger value="shops">
                            <Store className="mr-2 h-4 w-4" />
                            Cửa hàng
                        </TabsTrigger>
                        <TabsTrigger value="revenue">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Doanh thu
                        </TabsTrigger>
                        <TabsTrigger value="overview">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Tổng quan
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Thống kê người dùng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {users.stats && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Tổng người dùng</p>
                                            <p className="text-2xl font-bold text-white">{users.stats.totalUsers}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Người dùng mới tháng này</p>
                                            <p className="text-2xl font-bold text-green-400">{users.stats.newUsersThisMonth}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Người dùng hoạt động</p>
                                            <p className="text-2xl font-bold text-blue-400">{users.stats.activeUsers}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="p-4">Tên đăng nhập</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Họ tên</th>
                                                <th className="p-4">Vai trò</th>
                                                <th className="p-4">Trạng thái</th>
                                                <th className="p-4">Ngày tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.users.map((user) => (
                                                <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/30 transition">
                                                    <td className="p-4 font-medium text-blue-300">{user.username}</td>
                                                    <td className="p-4 text-gray-200">{user.email}</td>
                                                    <td className="p-4 text-gray-200">{user.firstName} {user.lastName}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            user.role === 'admin' ? 'bg-red-600 text-white' :
                                                            user.role === 'shop' ? 'bg-green-600 text-white' :
                                                            'bg-blue-600 text-white'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            user.isEmailVerified ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                                        }`}>
                                                            {user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-200">{formatDate(user.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {users.pages > 1 && (
                                    <div className="flex justify-center mt-6">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </Button>
                                            <span className="px-4 py-2 text-gray-300">
                                                Trang {currentPage} / {users.pages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(Math.min(users.pages, currentPage + 1))}
                                                disabled={currentPage === users.pages}
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shops">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Thống kê cửa hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {shops && shops.stats && (
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Tổng cửa hàng</p>
                                            <p className="text-2xl font-bold text-white">{shops.stats.totalShops}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Cửa hàng mới tháng này</p>
                                            <p className="text-2xl font-bold text-green-400">{shops.stats.newShopsThisMonth}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Đã duyệt</p>
                                            <p className="text-2xl font-bold text-green-400">{shops.stats.approvedShops}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Chờ duyệt</p>
                                            <p className="text-2xl font-bold text-yellow-400">{shops.stats.pendingShops}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400">Từ chối</p>
                                            <p className="text-2xl font-bold text-red-400">{shops.stats.rejectedShops}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="p-4">Tên cửa hàng</th>
                                                <th className="p-4">Địa chỉ</th>
                                                <th className="p-4">Email liên hệ</th>
                                                <th className="p-4">Trạng thái duyệt</th>
                                                <th className="p-4">Trạng thái hoạt động</th>
                                                <th className="p-4">Gói dịch vụ</th>
                                                <th className="p-4">Ngày tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shops && shops.shops.map((shop) => (
                                                <tr key={shop._id} className="border-b border-gray-700 hover:bg-gray-700/30 transition">
                                                    <td className="p-4 font-medium text-blue-300">{shop.shopName}</td>
                                                    <td className="p-4 text-gray-200">{shop.shopAddress}</td>
                                                    <td className="p-4 text-gray-200">{shop.contactEmail || 'Chưa cập nhật'}</td>
                                                    <td className="p-4">
                                                        {getApprovalStatusBadge(shop.approvalStatus)}
                                                    </td>
                                                    <td className="p-4">
                                                        {getActiveStatusBadge(shop.isActive)}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            shop.hasActivePackage ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                                                        }`}>
                                                            {shop.hasActivePackage ? 'Có gói' : 'Chưa có gói'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-200">{formatDate(shop.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {shops && shops.pages > 1 && (
                                    <div className="flex justify-center mt-6">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </Button>
                                            <span className="px-4 py-2 text-gray-300">
                                                Trang {currentPage} / {shops.pages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                onClick={() => setCurrentPage(Math.min(shops.pages, currentPage + 1))}
                                                disabled={currentPage === shops.pages}
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="revenue">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Thống kê doanh thu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {revenue && revenue.stats && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-white mb-4">Tổng quan doanh thu</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Tổng doanh thu:</span>
                                                    <span className="text-white font-semibold">{formatCurrency(revenue.stats.totalRevenue)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Doanh thu tháng này:</span>
                                                    <span className="text-green-400 font-semibold">{formatCurrency(revenue.stats.revenueThisMonth)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Tổng đơn hàng:</span>
                                                    <span className="text-white font-semibold">{revenue.stats.totalOrders}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Đơn hàng tháng này:</span>
                                                    <span className="text-blue-400 font-semibold">{revenue.stats.ordersThisMonth}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Giá trị đơn hàng TB:</span>
                                                    <span className="text-purple-400 font-semibold">{formatCurrency(revenue.stats.averageOrderValue)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Giá trị đơn hàng TB tháng này:</span>
                                                    <span className="text-yellow-400 font-semibold">{formatCurrency(revenue.stats.averageOrderValueThisMonth)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-white mb-4">Chi tiết doanh thu</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Doanh thu chờ xử lý:</span>
                                                    <span className="text-yellow-400 font-semibold">{formatCurrency(revenue.stats.pendingRevenue)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Doanh thu hoàn thành:</span>
                                                    <span className="text-green-400 font-semibold">{formatCurrency(revenue.stats.completedRevenue)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {revenue && revenue.orders && revenue.orders.length > 0 ? (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Danh sách đơn hàng</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-700">
                                                    <tr>
                                                        <th className="p-4">Mã đơn hàng</th>
                                                        <th className="p-4">Khách hàng</th>
                                                        <th className="p-4">Dịch vụ</th>
                                                        <th className="p-4">Giá trị</th>
                                                        <th className="p-4">Trạng thái</th>
                                                        <th className="p-4">Ngày tạo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {revenue.orders.map((order) => (
                                                        <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-700/30 transition">
                                                            <td className="p-4 font-medium text-blue-300">{order._id}</td>
                                                            <td className="p-4 text-gray-200">{order.customerName || 'N/A'}</td>
                                                            <td className="p-4 text-gray-200">{order.serviceName || 'N/A'}</td>
                                                            <td className="p-4 text-green-400 font-semibold">{formatCurrency(order.totalAmount || 0)}</td>
                                                            <td className="p-4">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    order.status === 'completed' ? 'bg-green-600 text-white' :
                                                                    order.status === 'pending' ? 'bg-yellow-600 text-white' :
                                                                    'bg-gray-600 text-white'
                                                                }`}>
                                                                    {order.status === 'completed' ? 'Hoàn thành' :
                                                                     order.status === 'pending' ? 'Chờ xử lý' : 'Khác'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-gray-200">{formatDate(order.createdAt)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 mt-6">
                                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-400">Chưa có đơn hàng nào</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="overview">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Tổng quan hệ thống</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {overview && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-white mb-4">Thống kê dịch vụ</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Tổng dịch vụ:</span>
                                                    <span className="text-white font-semibold">{overview.totalServices}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Dịch vụ hoạt động:</span>
                                                    <span className="text-green-400 font-semibold">{overview.activeServices}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Cửa hàng chờ duyệt:</span>
                                                    <span className="text-yellow-400 font-semibold">{overview.pendingShops}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-white mb-4">Thống kê tháng {currentMonth}/{currentYear}</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Người dùng mới:</span>
                                                    <span className="text-green-400 font-semibold">{overview.newUsersThisMonth}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Cửa hàng mới:</span>
                                                    <span className="text-blue-400 font-semibold">{overview.newShopsThisMonth}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Đơn hàng mới:</span>
                                                    <span className="text-purple-400 font-semibold">{overview.ordersThisMonth}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Doanh thu mới:</span>
                                                    <span className="text-yellow-400 font-semibold">{formatCurrency(overview.revenueThisMonth)}</span>
                                                </div>
                                            </div>
                                        </div>
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

export default AdminStatistics; 