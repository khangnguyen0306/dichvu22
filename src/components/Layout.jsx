import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { LogOut, User, LayoutDashboard, Shield, BarChart3 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
    const { user, logout } = useAuth();
    console.log(user)
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogout = () => {
        logout();
        navigate('/');
        toast({
            title: "Đăng xuất thành công!",
            description: "Hẹn gặp lại bạn sớm.",
        });
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/80 backdrop-blur-sm text-white p-4 sticky top-0 z-50 shadow-lg shadow-blue-500/10"
        >
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
                    URGENT
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="hover:text-blue-300 transition-colors">Trang chủ</Link>
                    <Link to="/services" className="hover:text-blue-300 transition-colors">Dịch vụ</Link>
                    <Link to="/about" className="hover:text-blue-300 transition-colors">Về chúng tôi</Link>
                    <Link to="/contact" className="hover:text-blue-300 transition-colors">Liên hệ</Link>
                    <Link to="/faq" className="hover:text-blue-300 transition-colors">FAQ</Link>
                    <Link to="/terms" className="hover:text-blue-300 transition-colors">Điều khoản</Link>
                    <Link to="/privacy" className="text-white hover:text-blue-300 transition-colors">
              Bảo mật
            </Link>
                    {user?.role === 'shop' && (
                        <Link to="/packages" className="hover:text-blue-300 transition-colors">Gói dịch vụ</Link>
                   )}
                </nav>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="relative group">
                            <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                                Chào, {user.username}
                            </Button>
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><User className="mr-2 h-4 w-4" />Hồ sơ</Link>
                                {user.role === 'seller' && <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><LayoutDashboard className="mr-2 h-4 w-4" />Bảng điều khiển</Link>}
                                {user.role === 'admin' && <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><Shield className="mr-2 h-4 w-4" />Quản trị</Link>}
                                {user.role === 'admin' && <Link to="/admin/statistics" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><BarChart3 className="mr-2 h-4 w-4" />Thống kê</Link>}
                                {user.role === 'shop' && <Link to="/shop-admin" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><Shield className="mr-2 h-4 w-4" />Quản trị</Link>}
                                {user.role === 'shop' && <Link to="/shop-booking-management" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><BarChart3 className="mr-2 h-4 w-4" />Quản lý đặt lịch</Link>}
                                <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"><LogOut className="mr-2 h-4 w-4" />Đăng xuất</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-white hover:bg-gray-700">Đăng nhập</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-blue-600 hover:bg-blue-700">Đăng ký</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    );
};

const Footer = () => (
    <footer className="bg-gray-900 text-white p-8 mt-auto">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <p className="font-bold text-xl text-blue-400 mb-2">URGENT</p>
                <p className="text-gray-400">
                    Nền tảng kết nối dịch vụ hàng đầu, giúp bạn dễ dàng tìm kiếm và sử dụng các dịch vụ chất lượng.
                </p>
            </div>
            <div>
                <p className="font-bold mb-2">Khám phá</p>
                <ul className="space-y-1 text-gray-400">
                    <li><Link to="/services" className="hover:text-blue-300">Dịch vụ</Link></li>
                    <li><Link to="/about" className="hover:text-blue-300">Về chúng tôi</Link></li>
                    <li><Link to="/contact" className="hover:text-blue-300">Liên hệ</Link></li>
                    <li><Link to="/" className="hover:text-blue-300">Trang chủ</Link></li>
                </ul>
            </div>
            <div>
                <p className="font-bold mb-2">Pháp lý</p>
                <ul className="space-y-1 text-gray-400">
                    <li><a href="#" className="hover:text-blue-300">Điều khoản dịch vụ</a></li>
                    <li><a href="#" className="hover:text-blue-300">Chính sách bảo mật</a></li>
                </ul>
            </div>
            <div>
                <p className="font-bold mb-2">Theo dõi chúng tôi</p>
                <div className="flex space-x-4">
                    {/* Icons here */}
                </div>
            </div>
        </div>
        <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-800">
            <p>&copy; 2025 URGENT. Mọi quyền được bảo lưu.</p>
        </div>
    </footer>
);

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;