
    import React, { createContext, useState, useContext, useEffect } from 'react';

    const DataContext = createContext();

    export const useData = () => useContext(DataContext);

    const initialServices = [
        { 
            id: 1, 
            name: 'Giao Đồ Ăn Nhanh', 
            category: 'Đồ ăn', 
            price: 50000, 
            seller: 'Food Express', 
            rating: 4.8, 
            reviews: 320, 
            description: 'Dịch vụ giao đồ ăn nhanh chóng trong 30 phút. Đa dạng món ăn từ cơm tấm, phở, bún bò đến đồ ăn nhanh. Phí giao hàng chỉ từ 15k.', 
            image: 'https://cdn.tgdd.vn/2020/12/CookProduct/Thuc-an-nhanh-la-gi-tac-hai-cua-thuc-an-nhanh-va-cac-loai-tot-cho-suc-khoe-1-1200x676.jpg'
        },
        { 
            id: 2, 
            name: 'Sửa Chữa Quần Áo', 
            category: 'Thời trang', 
            price: 80000, 
            seller: 'Thời Trang Việt', 
            rating: 4.9, 
            reviews: 150, 
            description: 'Sửa chữa, may vá quần áo chuyên nghiệp. Từ thu gọn, nới rộng đến sửa khóa kéo, vá lỗ. Đảm bảo chất lượng như mới.', 
            image: 'https://donganhsafety.com.vn/wp-content/uploads/2024/01/USOutlet.vn-sua-quan-ao-hang-hieu-tphcm.jpg'
        },
        { 
            id: 3, 
            name: 'Sửa Chữa Điện Thoại', 
            category: 'Điện tử', 
            price: 200000, 
            seller: 'TechRepair Pro', 
            rating: 4.7, 
            reviews: 280, 
            description: 'Sửa chữa điện thoại, laptop, tablet. Thay màn hình, pin, sửa lỗi phần mềm. Bảo hành 6 tháng, phụ kiện chính hãng.', 
            image: 'https://newtop.vn/wp-content/uploads/2025/02/sua-dien-thoai-di-dong-1121x800.jpeg'
        },
        { 
            id: 4, 
            name: 'Dọn Dẹp Nhà Cửa', 
            category: 'Dọn dẹp', 
            price: 300000, 
            seller: 'Clean Home', 
            rating: 4.8, 
            reviews: 195, 
            description: 'Dịch vụ dọn dẹp nhà cửa chuyên nghiệp. Vệ sinh tổng quát, lau chùi kính, dọn toilet, bếp. Đội ngũ có kinh nghiệm, dụng cụ hiện đại.', 
            image: 'https://cdn.tgdd.vn/Files/2020/01/10/1230914/4-buoc-de-hoan-thanh-viec-don-dep-nha-cua-thu-vi-de-dang-va-nhanh-chong-3.jpg'
        },
        { 
            id: 5, 
            name: 'Sửa Xe Máy Tại Chỗ', 
            category: 'Sửa chữa', 
            price: 150000, 
            seller: 'Garage 24/7', 
            rating: 4.6, 
            reviews: 420, 
            description: 'Sửa chữa xe máy tại nhà hoặc nơi xe hỏng. Thay nhớt, sửa phanh, lốp xe, máy nổ. Phục vụ 24/7, có phụ tùng sẵn.', 
            image: 'https://www.taidanang.com/wp-content/uploads/2020/07/sua-xe-may-da-nang-9.jpg'
        },
        { 
            id: 6, 
            name: 'Massage Thư Giãn Tại Nhà', 
            category: 'Chăm sóc sức khỏe', 
            price: 400000, 
            seller: 'Spa Việt', 
            rating: 4.9, 
            reviews: 180, 
            description: 'Dịch vụ massage thư giãn tại nhà với kỹ thuật truyền thống. Massage toàn thân, bấm huyệt, thư giãn cơ bắp. Thời gian 90 phút.', 
            image: 'https://medicviet.vn/uploads/images/dich-vu-massage-1.jpg'
        },
        { 
            id: 7, 
            name: 'Gia Sư Toán - Lý - Hóa', 
            category: 'Giáo dục', 
            price: 250000, 
            seller: 'EduSmart', 
            rating: 4.8, 
            reviews: 95, 
            description: 'Dạy kèm tại nhà cho học sinh THCS, THPT. Giáo viên có kinh nghiệm, phương pháp dạy hiệu quả. Cam kết cải thiện điểm số.', 
            image: 'https://giasutainha.edu.vn/wp-content/uploads/2022/08/3-dau-hieu-con-can-gia-su.jpeg'
        },
        { 
            id: 8, 
            name: 'Chăm Sóc Thú Cưng', 
            category: 'Thú cưng', 
            price: 120000, 
            seller: 'Pet Care Plus', 
            rating: 4.7, 
            reviews: 240, 
            description: 'Dịch vụ chăm sóc thú cưng tại nhà. Tắm rửa, cắt tỉa lông, vệ sinh tai, cắt móng. Phù hợp cho chó, mèo và các pet khác.', 
            image: 'https://phongkhamthuytenlua.vn/wp-content/uploads/2022/11/dich-vu-cham-soc-thu-cung-1.png'
        },
        { 
            id: 9, 
            name: 'Chuyển Nhà Trọn Gói', 
            category: 'Vận chuyển', 
            price: 800000, 
            seller: 'Move Master', 
            rating: 4.5, 
            reviews: 160, 
            description: 'Dịch vụ chuyển nhà, văn phòng chuyên nghiệp. Đóng gói cẩn thận, vận chuyển an toàn. Có xe tải các loại, bảo hiểm đồ đạc.', 
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDaWRxf02NQ4KYHe-7V3t03MxOsixwRt_ffg&s'
        },
        { 
            id: 10, 
            name: 'Chăm Sóc Vườn Tược', 
            category: 'Làm vườn', 
            price: 180000, 
            seller: 'Green Garden', 
            rating: 4.6, 
            reviews: 75, 
            description: 'Dịch vụ làm vườn, chăm sóc cây cảnh. Tỉa cành, bón phân, tưới nước, diệt sâu bệnh. Tư vấn cách chăm sóc cây hiệu quả.', 
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCCxjoKFM6yfRMsHeiR1qDBMft3Cnu_EGSA&s'
        },
        { 
            id: 11, 
            name: 'Sửa Chữa Điện Nước', 
            category: 'Sửa chữa', 
            price: 220000, 
            seller: 'Fix It Pro', 
            rating: 4.4, 
            reviews: 190, 
            description: 'Sửa chữa hệ thống điện, nước trong nhà. Thay bóng đèn, ổ cắm, vòi nước, sửa rò rỉ. Thợ có kinh nghiệm, giá rẻ.', 
            image: 'https://suachuanhacua.com/wp-content/uploads/2018/07/thi-cong-dien-nuoc-tphcm-1-570x380.jpg'
        },
        { 
            id: 12, 
            name: 'Giao Hàng Siêu Tốc', 
            category: 'Vận chuyển', 
            price: 35000, 
            seller: 'Fast Delivery', 
            rating: 4.7, 
            reviews: 500, 
            description: 'Giao hàng trong ngày, chuyển phát nhanh. Hỗ trợ COD, theo dõi đơn hàng realtime. Phục vụ 24/7, giá cả cạnh tranh.', 
            image: 'https://zship.vn/wp-content/uploads/2023/11/giao-hang-nhanh-anh-huong-the-nao-654c8c54afb40.webp'
        }
    ];

    const initialUsers = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'password' },
        { id: 2, name: 'Seller User', email: 'seller@example.com', role: 'seller', password: 'password' },
        { id: 3, name: 'Normal User', email: 'user@example.com', role: 'user', password: 'password' },
    ];

    const initialCategories = [
        { id: 1, name: 'Thiết kế' },
        { id: 2, name: 'Web' },
        { id: 3, name: 'Marketing' },
        { id: 4, name: 'Viết lách' },
        { id: 5, name: 'Video' },
        { id: 6, name: 'Kinh doanh' },
    ];

    export const DataProvider = ({ children }) => {
        const [services, setServices] = useState(() => {
            const saved = localStorage.getItem('services');
            return saved ? JSON.parse(saved) : initialServices;
        });
        const [users, setUsers] = useState(() => {
            const saved = localStorage.getItem('users');
            return saved ? JSON.parse(saved) : initialUsers;
        });
        const [categories, setCategories] = useState(() => {
            const saved = localStorage.getItem('categories');
            return saved ? JSON.parse(saved) : initialCategories;
        });
        const [currentUser, setCurrentUser] = useState(() => {
            const saved = localStorage.getItem('currentUser');
            return saved ? JSON.parse(saved) : null;
        });

        useEffect(() => {
            localStorage.setItem('services', JSON.stringify(services));
        }, [services]);

        useEffect(() => {
            localStorage.setItem('users', JSON.stringify(users));
        }, [users]);

        useEffect(() => {
            localStorage.setItem('categories', JSON.stringify(categories));
        }, [categories]);

        useEffect(() => {
            if (currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('currentUser');
            }
        }, [currentUser]);

        const login = (email, password) => {
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                setCurrentUser(user);
                return user;
            }
            return null;
        };

        const logout = () => {
            setCurrentUser(null);
        };

        const register = (name, email, password) => {
            if (users.some(u => u.email === email)) {
                return { success: false, message: 'Email đã tồn tại.' };
            }
            const newUser = {
                id: users.length + 1,
                name,
                email,
                password,
                role: 'user' // Mặc định là người dùng thường
            };
            setUsers([...users, newUser]);
            setCurrentUser(newUser);
            return { success: true, user: newUser };
        };
        
        const addService = (service) => {
            const newService = { ...service, id: Date.now(), seller: currentUser.name, rating: 0, reviews: 0 };
            setServices(prev => [newService, ...prev]);
        };

        const updateService = (updatedService) => {
            setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
        };

        const deleteService = (serviceId) => {
            setServices(prev => prev.filter(s => s.id !== serviceId));
        };

        const value = {
            services,
            users,
            categories,
            currentUser,
            login,
            logout,
            register,
            addService,
            updateService,
            deleteService,
            setUsers,
            setCategories,
        };

        return (
            <DataContext.Provider value={value}>
                {children}
            </DataContext.Provider>
        );
    };
  