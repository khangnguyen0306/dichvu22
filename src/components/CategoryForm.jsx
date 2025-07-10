
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    icon: category?.icon || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.icon) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    onSubmit(formData);
  };

  const commonIcons = ['🎨', '💻', '📈', '✍️', '🌐', '🎬', '📱', '🔧', '🎵', '📊', '🏠', '🚗'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">
              {category ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
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
                <Label htmlFor="name" className="text-white">
                  Tên danh mục <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên danh mục"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon" className="text-white">
                  Icon <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="Chọn emoji"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-300"
                  required
                />
                
                <div className="mt-3">
                  <p className="text-gray-300 text-sm mb-2">Chọn icon phổ biến:</p>
                  <div className="grid grid-cols-6 gap-2">
                    {commonIcons.map((icon, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-xl transition-colors"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {category ? 'Cập nhật' : 'Tạo danh mục'}
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

export default CategoryForm;
