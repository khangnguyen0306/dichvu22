import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { authService } from '@/service';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerifyEmail = async () => {
        if (!token) {
            setError('Token xác thực không hợp lệ.');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            await authService.verifyEmail(token);
            
            toast({
                title: "Xác thực thành công",
                description: "Email của bạn đã được xác thực thành công!",
            });

            // Chuyển về trang login sau khi xác thực thành công
            navigate('/login');
        } catch (error) {
            const errorMessage = error.message || 'Xác thực email thất bại. Vui lòng thử lại.';
            setError(errorMessage);
            
            toast({
                title: "Xác thực thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Xác Thực Email - URGENT</title>
                <meta name="description" content="Xác thực email tài khoản URGENT của bạn." />
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-blue-400">
                            Xác Thực Email
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Nhấn nút bên dưới để xác thực email của bạn
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                            <p className="text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Button 
                            onClick={handleVerifyEmail}
                            disabled={isLoading || !token}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang xác thực...
                                </div>
                            ) : (
                                'Xác Thực Email'
                            )}
                        </Button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-400">
                                <Link to="/login" className="text-blue-400 hover:underline">Đăng nhập</Link> nếu đã có tài khoản
                            </p>
                            <p className="text-sm text-gray-400">
                                Hoặc <Link to="/" className="text-blue-400 hover:underline">về trang chủ</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default VerifyEmail; 