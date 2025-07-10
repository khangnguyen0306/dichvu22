import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext.jsx';
import { Star, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ServiceCard = ({ service }) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300 flex flex-col"
    >
        <div className="h-48 w-full overflow-hidden">
            <img  
                class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                alt={service.name}
              src="https://images.unsplash.com/photo-1690721606848-ac5bdcde45ea" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <p className="text-sm text-blue-400 mb-1">{service.category}</p>
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <div className="flex items-center text-yellow-400 mb-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1">{service.rating} ({service.reviews} đánh giá)</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">Cung cấp bởi {service.seller}</p>
            <div className="flex justify-between items-center mt-auto">
                <p className="text-lg font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</p>
                <Link to={`/services/${service.id}`}>
                    <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">Xem</Button>
                </Link>
            </div>
        </div>
    </motion.div>
);

const Services = () => {
    const { services, categories } = useData();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [priceRange, setPriceRange] = useState([0, 10000000]);

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'All' || service.category === category;
            const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [services, searchTerm, category, priceRange]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchTerm, category });
    };

    return (
        <>
            <Helmet>
                <title>Duyệt Dịch Vụ - DịchVụPro</title>
                <meta name="description" content="Tìm kiếm, lọc và khám phá hàng ngàn dịch vụ chuyên nghiệp trên DịchVụPro." />
            </Helmet>
            <div className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold text-blue-400 mb-4">Khám Phá Dịch Vụ</h1>
                    <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4 items-end">
                        <div className="relative">
                            <label className="text-sm font-bold text-gray-300 block mb-2">Tìm kiếm</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: 'thiết kế logo'"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                            />
                            <Search className="absolute left-3 top-11 text-gray-400" size={20} />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-300 block mb-2">Danh mục</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition"
                            >
                                <option value="All">Tất cả danh mục</option>
                                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                        </div>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-12">
                            <Search className="mr-2" size={20} /> Tìm kiếm
                        </Button>
                    </form>
                </div>

                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredServices.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </motion.div>
                {filteredServices.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-2xl text-gray-400">Không tìm thấy dịch vụ nào.</p>
                        <p className="text-gray-500">Hãy thử thay đổi bộ lọc của bạn.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Services;