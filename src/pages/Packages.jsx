import React from 'react';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import packageService from '../service/packageService';
import { useAuth } from '../contexts/AuthContext';


const packages = [
  {
    id: 1,
    name: 'Gói Cơ Bản',
    price: 99000,
    duration: '1 tháng',
    description: 'Phù hợp cho cá nhân hoặc shop nhỏ muốn trải nghiệm dịch vụ.',
    highlight: false,
  },
  {
    id: 2,
    name: 'Gói Tiết Kiệm',
    price: 499000,
    duration: '6 tháng',
    description: 'Tiết kiệm hơn cho shop phát triển lâu dài.',
    highlight: true,
  },
  {
    id: 3,
    name: 'Gói Doanh Nghiệp',
    price: 899000,
    duration: '12 tháng',
    description: 'Tối ưu chi phí cho shop/doanh nghiệp lớn.',
    highlight: false,
  },
];

const Packages = () => {
  const { user } = useAuth();
  const handlePayment = async (pkg) => {
    try {
      const paymentData = {
        amount: pkg.price,
        description: `Đăng ký`,
        shopId: user.shopId
      };
      
      const result = await packageService.createPayment(paymentData);
      
      if (result.success && result.data.paymentUrl) {
        // Mở URL thanh toán trong tab mới
        window.open(result.data.paymentUrl, '_blank');
        toast({
          title: "Thành công",
          description: "Đang chuyển hướng đến trang thanh toán..."
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo thanh toán. Vui lòng thử lại.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi tạo thanh toán.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Các Gói Dịch Vụ</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`rounded-xl shadow-lg p-8 flex flex-col items-center bg-white/10 border border-white/20 ${pkg.highlight ? 'ring-2 ring-blue-500 scale-105' : ''}`}
          >
            <h2 className="text-xl font-bold mb-2 text-blue-500">{pkg.name}</h2>
            <div className="text-3xl font-extrabold mb-2 text-white">{pkg.price.toLocaleString()}<span className="text-lg font-normal">đ</span></div>
            <div className="mb-4 text-gray-200">/{pkg.duration}</div>
            <div className="mb-6 text-center text-gray-300">{pkg.description}</div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handlePayment(pkg)}
            >
              Chọn mua
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages; 