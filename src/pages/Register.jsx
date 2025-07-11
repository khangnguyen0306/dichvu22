import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { authService } from '@/service/authService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Shop fields
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopDescription, setShopDescription] = useState('');
    const [shopLogoUrl, setShopLogoUrl] = useState('');
    const [businessLicenseNumber, setBusinessLicenseNumber] = useState('');
    const [taxId, setTaxId] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('customer');
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
            let userData = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                username,
                email,
                password
            };

            // Add shop data if registering as shop
            if (activeTab === 'shop') {
                userData = {
                    ...userData,
                    shopName: shopName.trim(),
                    shopAddress: shopAddress.trim(),
                    shopDescription: shopDescription.trim(),
                    shopLogoUrl: shopLogoUrl.trim(),
                    businessLicenseNumber: businessLicenseNumber.trim(),
                    taxId: taxId.trim(),
                    contactEmail: contactEmail.trim() || email,
                    contactPhone: contactPhone.trim(),
                    bankAccountNumber: bankAccountNumber.trim(),
                    bankName: bankName.trim()
                };
            }

           if(activeTab === 'shop'){
            const result = await authService.registerShop(userData);
            console.log(result);
           }else{
            const result = await authService.register(userData);
            console.log(result);
           }
    
            
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
                    className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg"
                >
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-400">Tạo Tài Khoản</h1>
                        <p className="text-gray-400">Tham gia cộng đồng của chúng tôi ngay hôm nay!</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                            <TabsTrigger value="customer" className="text-white data-[state=active]:bg-blue-600">Khách hàng</TabsTrigger>
                            <TabsTrigger value="shop" className="text-white data-[state=active]:bg-blue-600">Cửa hàng</TabsTrigger>
                        </TabsList>

                        <TabsContent value="customer">
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
                                    {isLoading ? 'Đang đăng ký...' : 'Đăng Ký Khách Hàng'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="shop">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Thông tin cá nhân */}
                                <div className="border-b border-gray-600 pb-4">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Thông tin cá nhân</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Họ *</label>
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
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Tên *</label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                required
                                                placeholder="Nhập tên"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Tên đăng nhập *</label>
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
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Email *</label>
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
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Mật khẩu *</label>
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
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Xác nhận Mật khẩu *</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                required
                                                placeholder="Nhập lại mật khẩu"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin cửa hàng */}
                                <div className="border-b border-gray-600 pb-4">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Thông tin cửa hàng</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Tên cửa hàng *</label>
                                            <input
                                                type="text"
                                                value={shopName}
                                                onChange={(e) => setShopName(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                required
                                                placeholder="Nhập tên cửa hàng"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Địa chỉ cửa hàng *</label>
                                            <input
                                                type="text"
                                                value={shopAddress}
                                                onChange={(e) => setShopAddress(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                required
                                                placeholder="Nhập địa chỉ cửa hàng"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Mô tả cửa hàng</label>
                                            <textarea
                                                value={shopDescription}
                                                onChange={(e) => setShopDescription(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                rows={3}
                                                placeholder="Mô tả về cửa hàng của bạn"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Logo cửa hàng (URL)</label>
                                            <input
                                                type="url"
                                                value={shopLogoUrl}
                                                onChange={(e) => setShopLogoUrl(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                placeholder="https://example.com/logo.png"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin doanh nghiệp */}
                                <div className="border-b border-gray-600 pb-4">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Thông tin doanh nghiệp</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Số giấy phép kinh doanh</label>
                                            <input
                                                type="text"
                                                value={businessLicenseNumber}
                                                onChange={(e) => setBusinessLicenseNumber(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                placeholder="Nhập số giấy phép"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Mã số thuế</label>
                                            <input
                                                type="text"
                                                value={taxId}
                                                onChange={(e) => setTaxId(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                placeholder="Nhập mã số thuế"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin liên hệ */}
                                <div className="border-b border-gray-600 pb-4">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Thông tin liên hệ</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Email liên hệ</label>
                                            <input
                                                type="email"
                                                value={contactEmail}
                                                onChange={(e) => setContactEmail(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                placeholder="Email liên hệ (mặc định dùng email chính)"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                value={contactPhone}
                                                onChange={(e) => setContactPhone(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin thanh toán */}
                                <div className="pb-4">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Thông tin thanh toán</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Số tài khoản ngân hàng</label>
                                            <input
                                                type="text"
                                                value={bankAccountNumber}
                                                onChange={(e) => setBankAccountNumber(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                placeholder="Nhập số tài khoản"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Tên ngân hàng</label>
                                            <input
                                                type="text"
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                                                placeholder="Nhập tên ngân hàng"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <Button 
                                    type="submit" 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang đăng ký...' : 'Đăng Ký Cửa Hàng'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <p className="text-center text-gray-400">
                        Đã có tài khoản? <Link to="/login" className="font-medium text-blue-400 hover:underline">Đăng nhập</Link>
                    </p>
                </motion.div>
            </div>
        </>
    );
};

export default Register;