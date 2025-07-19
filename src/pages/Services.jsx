import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { serviceService, categoryService } from '@/service';
import { Star, Search, Loader2, AlertCircle, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { truncateText } from '@/utils/textUtils';

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
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                alt={service.name}
                src={service.images && service.images.length > 0 ? service.images[0] : '/placeholder-image.jpg'}
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-400">
                    {service.categories && service.categories.length > 0 ? service.categories[0].name : 'Dịch vụ'}
                </p>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                    service.availability === 'available' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                }`}>
                    {service.availability === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <div className="flex items-center text-yellow-400 mb-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1">
                    {service.rating || 0} ({service.reviews ? service.reviews.length : 0} đánh giá)
                </span>
            </div>
            <p className="text-gray-400 text-sm mb-2" title={service.description}>
                {truncateText(service.description, 80)}
            </p>
            <div className="flex items-center text-gray-400 text-sm mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>{service.duration} phút</span>
            </div>
            <div className="flex items-center text-gray-400 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className={`px-2 py-1 rounded text-xs ${
                    service.serviceType === 'onsite' ? 'bg-blue-600 text-white' :
                    service.serviceType === 'offsite' ? 'bg-red-600 text-white' :
                    'bg-purple-600 text-white'
                }`}>
                    {service.serviceType === 'onsite' ? 'Tại chỗ' :
                     service.serviceType === 'offsite' ? 'Tại nhà' : 'Cả hai'}
                </span>
            </div>
            {service.maxBookings && (
                <p className="text-gray-500 text-sm mb-4">
                    Tối đa: {service.maxBookings} đặt lịch
                </p>
            )}
            <div className="flex justify-between items-center mt-auto">
                <p className="text-lg font-semibold text-green-400">
                    {service.price ? `${service.price.toLocaleString('vi-VN')} VND` : 'Liên hệ'}
                </p>
                <Link to={`/services/${service._id}`}>
                    <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                        Xem chi tiết
                    </Button>
                </Link>
            </div>
        </div>
    </motion.div>
);

const Services = () => {
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [pagination, setPagination] = useState({
        page: parseInt(searchParams.get('page')) || 1,
        limit: 12,
        total: 0,
        pages: 0
    });

    // Search and filter states (immediate updates)
    const [searchFilters, setSearchFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        categories: searchParams.get('categories') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        serviceType: searchParams.get('serviceType') || '',
        availability: searchParams.get('availability') || ''
    });

    // Debounced search filters (used for API calls)
    const [debouncedSearchFilters, setDebouncedSearchFilters] = useState(searchFilters);

    // Debounce search filters
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchFilters(searchFilters);
            // Reset to page 1 when search filters change
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchFilters]);

    // Update URL params when debounced filters change
    useEffect(() => {
        const params = {
            page: pagination.page,
            ...Object.fromEntries(
                Object.entries(debouncedSearchFilters).filter(([_, value]) => value !== '')
            )
        };
        setSearchParams(params);
    }, [debouncedSearchFilters, pagination.page, setSearchParams]);

    // Fetch services and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Build query parameters
                const params = {
                    page: pagination.page,
                    limit: pagination.limit,
                    ...Object.fromEntries(
                        Object.entries(debouncedSearchFilters).filter(([_, value]) => value !== '')
                    )
                };
                
                // Fetch both services and categories in parallel
                const [servicesResponse, categoriesResponse] = await Promise.all([
                    serviceService.getServices(params),
                    categoryService.getCategories()
                ]);
                
                setServices(servicesResponse.data || []);
                setCategories(categoriesResponse.data || categoriesResponse);
                
                // Update pagination from response
                if (servicesResponse.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: servicesResponse.pagination.total || 0,
                        pages: servicesResponse.pagination.pages || 0
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Không thể tải dữ liệu');
                toast({
                    title: "Lỗi",
                    description: "Không thể tải danh sách dịch vụ. Vui lòng thử lại.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [debouncedSearchFilters, pagination.page, pagination.limit, toast]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Immediately apply current search filters (will trigger debounce)
        setDebouncedSearchFilters(searchFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (name, value) => {
        setSearchFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        const clearedFilters = {
            keyword: '',
            categories: '',
            minPrice: '',
            maxPrice: '',
            serviceType: '',
            availability: ''
        };
        setSearchFilters(clearedFilters);
        setDebouncedSearchFilters(clearedFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-400">Đang tải dịch vụ...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 text-lg mb-2">Không thể tải dịch vụ</p>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Duyệt Dịch Vụ - URGENT</title>
                <meta name="description" content="Tìm kiếm, lọc và khám phá hàng ngàn dịch vụ chất lượng trên URGENT." />
            </Helmet>
            <div className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold text-blue-400 mb-4">Khám Phá Dịch Vụ</h1>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="relative">
                                <label className="text-sm font-bold text-gray-300 block mb-2">Từ khóa</label>
                                <input
                                    type="text"
                                    placeholder="Tên dịch vụ..."
                                    value={searchFilters.keyword}
                                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                    className="w-full p-3 pl-10 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                />
                                <Search className="absolute left-3 top-11 text-gray-400" size={20} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Danh mục</label>
                                <input
                                    type="text"
                                    placeholder="Danh mục..."
                                    value={searchFilters.categories}
                                    onChange={(e) => handleFilterChange('categories', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Loại dịch vụ</label>
                                <select
                                    value={searchFilters.serviceType}
                                    onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="onsite">Tại chỗ</option>
                                    <option value="offsite">Tại nhà</option>
                                    <option value="both">Cả hai</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Giá tối thiểu</label>
                                <input
                                    type="number"
                                    placeholder="Giá tối thiểu..."
                                    value={searchFilters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Giá tối đa</label>
                                <input
                                    type="number"
                                    placeholder="Giá tối đa..."
                                    value={searchFilters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 block mb-2">Trạng thái</label>
                                <select
                                    value={searchFilters.availability}
                                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="available">Có sẵn</option>
                                    <option value="unavailable">Không có sẵn</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                <Search className="mr-2" size={20} /> Tìm kiếm
                            </Button>
                            <Button type="button" variant="outline" onClick={clearFilters}>
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </form>
                    
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                        <span>
                            Hiển thị {services.length} dịch vụ
                            {pagination.total > 0 && ` / ${pagination.total} tổng cộng`}
                        </span>
                        <div className="flex items-center gap-4">
                            <span>
                                {categories.length} danh mục có sẵn
                            </span>
                            <div className="flex items-center gap-2">
                                <span>Hiển thị:</span>
                                <select
                                    value={pagination.limit}
                                    onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                                >
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                    <option value={48}>48</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {services.map(service => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </motion.div>
                
                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                                disabled={pagination.page === 1}
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Trước
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.page <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.page >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i;
                                    } else {
                                        pageNum = pagination.page - 2 + i;
                                    }
                                    
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pagination.page === pageNum ? "default" : "outline"}
                                            onClick={() => handlePageChange(pageNum)}
                                            className="w-10 h-10 p-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                                disabled={pagination.page === pagination.pages}
                                className="flex items-center gap-1"
                            >
                                Sau
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
                
                {services.length === 0 && !isLoading && (
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