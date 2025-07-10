import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext.jsx';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, MessageSquare } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';

const ServiceDetail = () => {
    const { serviceId } = useParams();
    const { services } = useData();
    const { toast } = useToast();
    const service = services.find(s => s.id === parseInt(serviceId));

    if (!service) {
        return <div className="text-center py-20">
            <h1 className="text-3xl">Dịch vụ không tồn tại</h1>
            <Link to="/services"><Button className="mt-4">Quay lại trang dịch vụ</Button></Link>
        </div>;
    }
    
    const handleNotImplemented = () => {
        toast({
            title: "🚧 Tính năng này chưa được triển khai!",
            description: "Đừng lo! Bạn có thể yêu cầu nó trong lần nhắc tiếp theo! 🚀",
            variant: "destructive",
        });
    };

    return (
        <>
            <Helmet>
                <title>{service.name} - DịchVụPro</title>
                <meta name="description" content={service.description.substring(0, 160)} />
            </Helmet>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 p-8 rounded-lg shadow-xl"
            >
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <p className="text-blue-400 font-semibold">{service.category}</p>
                        <h1 className="text-4xl font-bold my-2">{service.name}</h1>
                        <div className="flex items-center space-x-4 text-lg">
                            <div className="flex items-center text-yellow-400">
                                <Star className="w-6 h-6 fill-current" />
                                <span className="ml-1 font-bold">{service.rating}</span>
                                <span className="text-gray-400 ml-1">({service.reviews} đánh giá)</span>
                            </div>
                            <span className="text-gray-400">Cung cấp bởi <span className="font-semibold text-white">{service.seller}</span></span>
                        </div>
                        <div className="my-6">
                            <img  
                                class="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
                                alt={service.name}
                              src="https://images.unsplash.com/photo-1690721606848-ac5bdcde45ea" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-2">Mô tả dịch vụ</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{service.description}</p>
                    </div>
                    <div className="md:col-span-1">
                        <div className="bg-gray-700 p-6 rounded-lg sticky top-24">
                            <p className="text-3xl font-bold text-center mb-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</p>
                            <Button onClick={handleNotImplemented} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                                <ShoppingCart className="mr-2" /> Mua ngay
                            </Button>
                            <Button onClick={handleNotImplemented} variant="outline" size="lg" className="w-full mt-4 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg py-6">
                                <MessageSquare className="mr-2" /> Liên hệ người bán
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ServiceDetail;