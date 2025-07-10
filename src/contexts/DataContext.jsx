
    import React, { createContext, useState, useContext, useEffect } from 'react';

    const DataContext = createContext();

    export const useData = () => useContext(DataContext);

    const initialServices = [
        { id: 1, name: 'Thiết kế Logo Chuyên nghiệp', category: 'Thiết kế', price: 1500000, seller: 'Creative Studio', rating: 4.9, reviews: 120, description: 'Tạo ra một logo độc đáo và đáng nhớ cho thương hiệu của bạn. Chúng tôi cung cấp các thiết kế chất lượng cao với các bản sửa đổi không giới hạn.', image: 'logo-design-service' },
        { id: 2, name: 'Phát triển Website WordPress', category: 'Web', price: 8000000, seller: 'Web Wizards', rating: 4.8, reviews: 85, description: 'Xây dựng một trang web WordPress tùy chỉnh, đáp ứng và thân thiện với SEO. Hoàn hảo cho các doanh nghiệp, blog và cửa hàng thương mại điện tử.', image: 'wordpress-development-service' },
        { id: 3, name: 'Quản lý Mạng xã hội', category: 'Marketing', price: 4500000, seller: 'Social Buzz', rating: 4.7, reviews: 95, description: 'Tăng cường sự hiện diện trực tuyến của bạn với các dịch vụ quản lý mạng xã hội chuyên nghiệp của chúng tôi. Chúng tôi xử lý việc đăng bài, tương tác và tăng trưởng.', image: 'social-media-management' },
        { id: 4, name: 'Viết Nội dung SEO', category: 'Viết lách', price: 800000, seller: 'Content Kings', rating: 4.9, reviews: 250, description: 'Nhận các bài viết blog, bài báo và nội dung trang web được tối ưu hóa SEO chất lượng cao để xếp hạng cao hơn trên Google.', image: 'seo-content-writing' },
        { id: 5, name: 'Chỉnh sửa Video chuyên nghiệp', category: 'Video', price: 2500000, seller: 'Motion Masters', rating: 4.8, reviews: 70, description: 'Chỉnh sửa video chuyên nghiệp cho YouTube, quảng cáo hoặc các dự án cá nhân. Bao gồm phân loại màu, hiệu ứng và đồ họa chuyển động.', image: 'video-editing-service' },
        { id: 6, name: 'Tư vấn Kinh doanh', category: 'Kinh doanh', price: 5000000, seller: 'Growth Gurus', rating: 5.0, reviews: 45, description: 'Nhận lời khuyên chuyên môn về chiến lược kinh doanh, marketing và vận hành để mở rộng quy mô công ty của bạn.', image: 'business-consulting' },
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
  