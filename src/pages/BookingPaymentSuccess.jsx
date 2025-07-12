import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService } from '../service';
import { useToast } from "@/components/ui/use-toast";

const BookingPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState('loading');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        setIsProcessing(true);
        
        // Get URL parameters
        const bookingId = searchParams.get('bookingId');
        const success = searchParams.get('success');
        const code = searchParams.get('code');
        const status = searchParams.get('status');
        const cancel = searchParams.get('cancel');
        const orderCode = searchParams.get('orderCode');
        const id = searchParams.get('id');

        console.log('URL Parameters:', {
          bookingId,
          success,
          code,
          status,
          cancel,
          orderCode,
          id
        });

        // Validate required parameters
        if (!bookingId) {
          setStatus('failed');
          toast({
            title: "Lỗi tham số",
            description: "Thiếu bookingId để xử lý thanh toán.",
            variant: "destructive",
          });
          return;
        }

        // Handle different payment response formats
        let paymentSuccess = false;
        
        // Check if we have the success parameter
        if (success === 'true') {
          paymentSuccess = true;
        }
        // Check PayOS format
        else if (code === '00' && status === 'PAID' && cancel === 'false') {
          paymentSuccess = true;
        }
        // Check other success indicators
        else if (code === '00' && status === 'PAID') {
          paymentSuccess = true;
        }

        // Call payment return API if we have the required parameters
        if (code && status) {
          try {
            const response = await paymentService.handlePaymentReturn(code, status, bookingId);
            console.log('Payment API Response:', response);
          } catch (apiError) {
            console.error('Payment API Error:', apiError);
            // Continue with UI processing even if API fails
          }
        }

        // Set status based on payment success
        if (paymentSuccess) {
          setStatus('success');
          toast({
            title: "Thanh toán thành công!",
            description: "Đơn đặt lịch của bạn đã được thanh toán thành công.",
          });
        } else if (cancel === 'true') {
          setStatus('cancelled');
          toast({
            title: "Thanh toán bị hủy",
            description: "Bạn đã hủy thanh toán. Đơn đặt lịch vẫn được giữ lại.",
            variant: "destructive",
          });
        } else {
          setStatus('failed');
          toast({
            title: "Thanh toán thất bại",
            description: "Có lỗi xảy ra trong quá trình thanh toán.",
            variant: "destructive",
          });
        }

      } catch (error) {
        console.error('Error processing payment return:', error);
        setStatus('failed');
        toast({
          title: "Lỗi xử lý thanh toán",
          description: error.message || "Có lỗi xảy ra khi xử lý kết quả thanh toán.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    // Process payment return
    handlePaymentReturn();
  }, [searchParams, toast]);

  const handleViewBookings = () => {
    navigate('/profile?tab=bookings');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-300 mb-4">Đang xử lý thanh toán...</h1>
          <p className="text-gray-400">Vui lòng chờ trong giây lát.</p>
        </div>
      );
    }

    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-500 mb-4">Thanh toán thành công!</h1>
            <p className="text-gray-300 mb-6">
              Đơn đặt lịch của bạn đã được thanh toán thành công. 
              Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận lịch hẹn.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleViewBookings}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Xem lịch sử đặt lịch
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Về trang chủ
              </Button>
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
              Đơn đặt lịch của bạn vẫn được giữ lại. Vui lòng thử lại sau.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleViewBookings}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Xem lịch sử đặt lịch
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        );

      case 'cancelled':
        return (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">Thanh toán bị hủy</h1>
            <p className="text-gray-300 mb-6">
              Bạn đã hủy thanh toán. Đơn đặt lịch vẫn được giữ lại. 
              Bạn có thể thanh toán lại bất cứ lúc nào.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleViewBookings}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Xem lịch sử đặt lịch
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Về trang chủ
              </Button>
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
            <div className="space-y-3">
              <Button 
                onClick={handleViewBookings}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Xem lịch sử đặt lịch
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
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

export default BookingPaymentSuccess; 