import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { useToast } from "@/components/ui/use-toast";
    import { Helmet } from 'react-helmet';

    const ForgotPassword = () => {
        const [email, setEmail] = useState('');
        const { toast } = useToast();

        const handleSubmit = (e) => {
            e.preventDefault();
            // Đây là chức năng giả
            toast({
                title: "Yêu cầu đã được gửi",
                description: `Nếu email ${email} tồn tại, bạn sẽ nhận được một liên kết để đặt lại mật khẩu.`,
            });
        };

        return (
            <>
                <Helmet>
                    <title>Quên Mật Khẩu - URGENT</title>
                    <meta name="description" content="Đặt lại mật khẩu cho tài khoản URGENT của bạn." />
                </Helmet>
                <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg"
                    >
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-blue-400">Đặt Lại Mật Khẩu</h1>
                            <p className="text-gray-400">Nhập email của bạn để nhận liên kết đặt lại.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">Gửi Liên Kết Đặt Lại</Button>
                        </form>
                        <p className="text-center text-gray-400">
                            Nhớ mật khẩu rồi? <Link to="/login" className="font-medium text-blue-400 hover:underline">Đăng nhập</Link>
                        </p>
                    </motion.div>
                </div>
            </>
        );
    };

    export default ForgotPassword;