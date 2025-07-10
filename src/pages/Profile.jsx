import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState(user.username);
    const [email, setEmail] = useState(user.email);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        toast({
            title: "🚧 Tính năng này chưa được triển khai!",
            description: "Cập nhật hồ sơ sẽ sớm được hỗ trợ.",
            variant: "destructive",
        });
    };
    
    const handlePasswordChange = (e) => {
        e.preventDefault();
        toast({
            title: "🚧 Tính năng này chưa được triển khai!",
            description: "Thay đổi mật khẩu sẽ sớm được hỗ trợ.",
            variant: "destructive",
        });
    };

    return (
        <>
            <Helmet>
                <title>Hồ Sơ Của Tôi - DịchVụPro</title>
                <meta name="description" content="Xem và chỉnh sửa thông tin hồ sơ cá nhân của bạn trên DịchVụPro." />
            </Helmet>
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-blue-400">Hồ Sơ Của Tôi</h1>

                {/* Profile Info */}
                <div className="bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-6">Thông Tin Cá Nhân</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Tên</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-700 rounded" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-gray-700 rounded" />
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Cập Nhật Hồ Sơ</Button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-gray-800 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-6">Thay Đổi Mật Khẩu</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Mật Khẩu Hiện Tại</label>
                            <input type="password" className="w-full p-3 bg-gray-700 rounded" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Mật Khẩu Mới</label>
                            <input type="password" className="w-full p-3 bg-gray-700 rounded" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Xác Nhận Mật Khẩu Mới</label>
                            <input type="password" className="w-full p-3 bg-gray-700 rounded" />
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Thay Đổi Mật Khẩu</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;