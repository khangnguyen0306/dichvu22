import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { authService } from '@/service';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { login: authLogin } = useAuth();
    
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await authService.login(email, password);
            
            // Check if login was successful
            if (result.success) {
                const { token, ...user } = result.data;
                authLogin(user);
                toast({
                    title: "Đăng nhập thành công!",
                    description: `Chào mừng trở lại, ${user.username}!`,
                });
                
                navigate(from, { replace: true });
            } else {
                setError(result.message || 'Email hoặc mật khẩu không đúng.');
                toast({
                    title: "Đăng nhập thất bại",
                    description: result.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.log(error);
            setError(error.message || 'Email hoặc mật khẩu không đúng.');
            toast({
                title: "Đăng nhập thất bại",
                description: error.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Đăng Nhập - DịchVụPro</title>
                <meta name="description" content="Đăng nhập vào tài khoản DịchVụPro của bạn để quản lý dịch vụ và đơn hàng." />
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg"
                >
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-400">Đăng Nhập</h1>
                        <p className="text-gray-400">Chào mừng bạn trở lại!</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                required
                                placeholder="Nhập email của bạn"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                required
                                placeholder="Nhập mật khẩu của bạn"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="h-4 w-4 bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 rounded" />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">Ghi nhớ tôi</label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">Quên mật khẩu?</Link>
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </Button>
                    </form>
                    <p className="text-center text-gray-400">
                        Chưa có tài khoản? <Link to="/register" className="font-medium text-blue-400 hover:underline">Đăng ký ngay</Link>
                    </p>
                </motion.div>
            </div>
        </>
    );
};

export default Login;