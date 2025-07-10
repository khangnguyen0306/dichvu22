import React, { useState, useEffect } from 'react';
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
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token xác thực không hợp lệ.');
                setIsLoading(false);
                return;
            }

            try {
                const result = await authService.verifyEmail(token);
                setStatus('success');
                setMessage('Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.');
                
                toast({
                    title: "Xác thực thành công!",
                    description: "Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.",
                });
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Xác thực email thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
                
                toast({
                    title: "Xác thực thất bại",
                    description: error.message || 'Xác thực email thất bại. Vui lòng thử lại.',
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [token, navigate, toast]);

    const handleResendVerification = async () => {
        setIsLoading(true);
        try {
            // Note: This would need the user's email, which we don't have in this context
            // You might want to store the email in localStorage during registration
            const userEmail = localStorage.getItem('pendingVerificationEmail');
            
            if (!userEmail) {
                setMessage('Không thể gửi lại email xác thực. Vui lòng đăng ký lại.');
                return;
            }

            await authService.resendVerificationEmail(userEmail);
            setMessage('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
            
            toast({
                title: "Email đã được gửi lại",
                description: "Vui lòng kiểm tra hộp thư của bạn.",
            });
        } catch (error) {
            setMessage(error.message || 'Không thể gửi lại email xác thực. Vui lòng thử lại.');
            
            toast({
                title: "Gửi lại email thất bại",
                description: error.message || 'Không thể gửi lại email xác thực.',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'verifying':
                return (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                );
            case 'success':
                return (
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'text-green-400';
            case 'error':
                return 'text-red-400';
            default:
                return 'text-blue-400';
        }
    };

    return (
        <>
            <Helmet>
                <title>Xác Thực Email - DịchVụPro</title>
                <meta name="description" content="Xác thực email tài khoản DịchVụPro của bạn." />
            </Helmet>
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg"
                >
                    <div className="text-center">
                        <h1 className={`text-3xl font-bold ${getStatusColor()}`}>
                            {status === 'verifying' && 'Đang Xác Thực...'}
                            {status === 'success' && 'Xác Thực Thành Công!'}
                            {status === 'error' && 'Xác Thực Thất Bại'}
                        </h1>
                        <p className="text-gray-400 mt-2">
                            {status === 'verifying' && 'Vui lòng chờ trong khi chúng tôi xác thực email của bạn...'}
                            {status === 'success' && 'Email của bạn đã được xác thực thành công!'}
                            {status === 'error' && 'Có lỗi xảy ra trong quá trình xác thực email.'}
                        </p>
                    </div>

                    <div className="text-center">
                        {getStatusIcon()}
                    </div>

                    {!isLoading && (
                        <div className="text-center space-y-4">
                            <p className="text-gray-300">{message}</p>
                            
                            {status === 'success' && (
                                <div className="space-y-3">
                                    <Button 
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                                    >
                                        Đăng Nhập Ngay
                                    </Button>
                                    <p className="text-sm text-gray-400">
                                        Hoặc <Link to="/" className="text-blue-400 hover:underline">về trang chủ</Link>
                                    </p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="space-y-3">
                                    <Button 
                                        onClick={handleResendVerification}
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                                    >
                                        {isLoading ? 'Đang gửi...' : 'Gửi Lại Email Xác Thực'}
                                    </Button>
                                    <Button 
                                        onClick={() => navigate('/register')}
                                        variant="outline"
                                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                                    >
                                        Đăng Ký Lại
                                    </Button>
                                    <p className="text-sm text-gray-400">
                                        Hoặc <Link to="/login" className="text-blue-400 hover:underline">đăng nhập</Link> nếu đã có tài khoản
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {isLoading && status === 'verifying' && (
                        <div className="text-center">
                            <p className="text-gray-300">Đang xác thực email...</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default VerifyEmail; 