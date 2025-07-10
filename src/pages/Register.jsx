import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { authService } from '@/service';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp.');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            setIsLoading(false);
            return;
        }

        if (!firstName.trim() || !lastName.trim()) {
            setError('Vui lòng nhập đầy đủ họ và tên.');
            setIsLoading(false);
            return;
        }

        try {
            const userData = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                username,
                email,
                password
            };

            const result = await authService.register(userData);
            console.log(result);
            
            // Store email for potential resend verification
            localStorage.setItem('pendingVerificationEmail', email);
            
            toast({
                title: "Đăng ký thành công!",
                description: `Chào mừng, ${firstName} ${lastName}! Vui lòng kiểm tra email để xác thực tài khoản.`,
            });
            
            navigate('/login');
        } catch (error) {
            setError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            toast({
                title: "Đăng ký thất bại",
                description: error.message || 'Đăng ký thất bại. Vui lòng thử lại.',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Đăng Ký - DịchVụPro</title>
                <meta name="description" content="Tạo tài khoản DịchVụPro mới để bắt đầu mua và bán dịch vụ." />
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg"
                >
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-400">Tạo Tài Khoản</h1>
                        <p className="text-gray-400">Tham gia cộng đồng của chúng tôi ngay hôm nay!</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Họ</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                    required
                                    placeholder="Nhập họ"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Tên</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                    required
                                    placeholder="Nhập tên"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                required
                                minLength={3}
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                            <input
                                type="email"
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
                                minLength={6}
                                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Xác nhận Mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                required
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
                        </Button>
                    </form>
                    <p className="text-center text-gray-400">
                        Đã có tài khoản? <Link to="/login" className="font-medium text-blue-400 hover:underline">Đăng nhập</Link>
                    </p>
                </motion.div>
            </div>
        </>
    );
};

export default Register;