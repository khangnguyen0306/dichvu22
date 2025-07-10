
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const { categories } = useData();
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    price: service?.price || '',
    category: service?.category || '',
    categoryId: service?.categoryId || '',
    deliveryTime: service?.deliveryTime || '',
    image: service?.image || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update categoryId when category changes
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat.name === value);
      setFormData(prev => ({
        ...prev,
        categoryId: selectedCategory?.id || ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    onSubmit({
      ...formData,
      price: parseInt(formData.price)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">
              {service ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Tiêu đề dịch vụ <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề dịch vụ"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Mô tả dịch vụ <span className="text-red-400">*</span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về dịch vụ của bạn"
                  rows={4}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">
                    Giá dịch vụ (VNĐ) <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTime" className="text-white">
                    Thời gian giao hàng
                  </Label>
                  <Input
                    id="deliveryTime"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    placeholder="VD: 3-5 ngày"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">
                  Danh mục <span className="text-red-400">*</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                >
                  <option value="" className="bg-gray-800">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name} className="bg-gray-800">
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-white">
                  URL hình ảnh
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                />
                <p className="text-gray-400 text-sm">
                  Để trống để sử dụng hình ảnh mặc định
                </p>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {service ? 'Cập nhật dịch vụ' : 'Tạo dịch vụ'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServiceForm;
