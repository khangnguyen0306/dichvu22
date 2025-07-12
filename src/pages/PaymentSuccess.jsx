import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../service/apiConfig';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const shopId = searchParams.get('shopId');
    const code = searchParams.get('code');
    const status = searchParams.get('status');
    const cancel = searchParams.get('cancel');
    const orderCode = searchParams.get('orderCode');

    // Gọi API để xử lý kết quả thanh toán
    const handlePaymentReturn = async () => {
      try {
        if (code && orderCode && status && shopId) {
          const params = new URLSearchParams({
            code,
            orderCode,
            status,
            shopId
          });
          
          await api.get(`/payments/payos/return?${params.toString()}`);
        }
      } catch (error) {
        console.error('Error calling payment return API:', error);
      }
    };

    // Gọi API trước khi xử lý UI
    handlePaymentReturn();

    // Kiểm tra theo logic PayOS
    if (code === '00' && status === 'PAID' && cancel === 'false') {
      setStatus('success');
    } else if (success === 'true') {
      setStatus('success');
    } else if (success === 'false' || code !== '00' || status !== 'PAID' || cancel === 'true') {
      setStatus('failed');
    } else {
      setStatus('unknown');
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-500 mb-4">Thanh toán thành công!</h1>
            <p className="text-gray-300 mb-6">
              Gói dịch vụ của bạn đã được kích hoạt thành công. 
              Bạn có thể bắt đầu sử dụng các tính năng nâng cao ngay bây giờ.
            </p>
            <div className="space-x-4">
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Đi đến Dashboard
                </Button>
              </Link>
              <Link to="/shop-admin">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Quản lý sản phẩm
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-500 mb-4">Thanh toán thất bại</h1>
            <p className="text-gray-300 mb-6">
              Có lỗi xảy ra trong quá trình thanh toán. 
              Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
            <div className="space-x-4">
              <Link to="/packages">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Thử lại
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Liên hệ hỗ trợ
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'unknown':
        return (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">Trạng thái không xác định</h1>
            <p className="text-gray-300 mb-6">
              Không thể xác định kết quả thanh toán. 
              Vui lòng kiểm tra email hoặc liên hệ hỗ trợ để được hỗ trợ.
            </p>
            <div className="space-x-4">
              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Đi đến Dashboard
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Liên hệ hỗ trợ
                </Button>
              </Link>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Đang xử lý...</h1>
            <p className="text-gray-400">Vui lòng chờ trong giây lát.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentSuccess; 