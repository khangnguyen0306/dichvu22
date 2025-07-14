import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { toast } from '../components/ui/use-toast';
import { ChevronDown, X } from 'lucide-react';
import serviceService from '../service/serviceService';
import categoryService from '../service/categoryService';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    duration: '', 
    categoryId: '', 
    images: [], 
    serviceType: 'both',
    availability: 'available',
    maxBookings: '',
    requirements: [],
    includes: [],
    excludes: [],
    notes: '',
    workingHours: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '09:00-18:00',
      sunday: '09:00-18:00'
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [formError, setFormError] = useState('');
  
  // New state for managing lists
  const [newRequirement, setNewRequirement] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  
  // Search and filter states
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    shopId: '',
    categories: '',
    minPrice: '',
    maxPrice: '',
    serviceType: '',
    availability: ''
  });

  // Fetch services from API
  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const res = await serviceService.getServices(params);
      setServices(res.data || []);
    } catch (error) {
      toast({ title: 'Lỗi', description: error.message || 'Không thể tải dịch vụ.' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data || res);
    } catch (error) {
      toast({ title: 'Lỗi', description: error.message || 'Không thể tải danh mục.' });
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownOpen && !event.target.closest('.category-dropdown')) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryDropdownOpen]);

  const openAddModal = () => {
    setForm({ 
      name: '', 
      description: '', 
      price: '', 
      duration: '', 
      categoryId: '', 
      images: [], 
      serviceType: 'both',
      availability: 'available',
      maxBookings: '',
      requirements: [],
      includes: [],
      excludes: [],
      notes: '',
      workingHours: {
        monday: '09:00-18:00',
        tuesday: '09:00-18:00',
        wednesday: '09:00-18:00',
        thursday: '09:00-18:00',
        friday: '09:00-18:00',
        saturday: '09:00-18:00',
        sunday: '09:00-18:00'
      }
    });
    setEditingId(null);
    setNewImageUrl('');
    setNewRequirement('');
    setNewInclude('');
    setNewExclude('');
    setOpen(true);
  };

  const openEditModal = (service) => {
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      categoryId: Array.isArray(service.categories) ? service.categories.map(cat => cat._id) : [service.categoryId || ''],
      images: service.images || [],
      serviceType: service.serviceType || 'both',
      availability: service.availability || 'available',
      maxBookings: service.maxBookings || '',
      requirements: service.requirements || [],
      includes: service.includes || [],
      excludes: service.excludes || [],
      notes: service.notes || '',
      workingHours: service.workingHours || {
        monday: '09:00-18:00',
        tuesday: '09:00-18:00',
        wednesday: '09:00-18:00',
        thursday: '09:00-18:00',
        friday: '09:00-18:00',
        saturday: '09:00-18:00',
        sunday: '09:00-18:00'
      }
    });
    setEditingId(service._id);
    setNewImageUrl('');
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !form.images.includes(newImageUrl.trim())) {
      setForm({ ...form, images: [...form.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updatedImages });
  };

  // Functions to manage lists
  const addRequirement = () => {
    if (newRequirement.trim() && !form.requirements.includes(newRequirement.trim())) {
      setForm({ ...form, requirements: [...form.requirements, newRequirement.trim()] });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    const updatedRequirements = form.requirements.filter((_, i) => i !== index);
    setForm({ ...form, requirements: updatedRequirements });
  };

  const addInclude = () => {
    if (newInclude.trim() && !form.includes.includes(newInclude.trim())) {
      setForm({ ...form, includes: [...form.includes, newInclude.trim()] });
      setNewInclude('');
    }
  };

  const removeInclude = (index) => {
    const updatedIncludes = form.includes.filter((_, i) => i !== index);
    setForm({ ...form, includes: updatedIncludes });
  };

  const addExclude = () => {
    if (newExclude.trim() && !form.excludes.includes(newExclude.trim())) {
      setForm({ ...form, excludes: [...form.excludes, newExclude.trim()] });
      setNewExclude('');
    }
  };

  const removeExclude = (index) => {
    const updatedExcludes = form.excludes.filter((_, i) => i !== index);
    setForm({ ...form, excludes: updatedExcludes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedCategories = Array.isArray(form.categoryId) ? form.categoryId : form.categoryId ? [form.categoryId] : [];
    if (!form.name || !form.price || selectedCategories.length === 0) {
      toast({ title: 'Vui lòng nhập đầy đủ tên, giá và chọn danh mục' });
      return;
    }
    if (!isPositiveNumber(form.price)) {
      setFormError('Giá dịch vụ phải là số dương.');
      return;
    }
    if (form.duration && !isPositiveNumber(form.duration)) {
      setFormError('Thời lượng phải là số dương.');
      return;
    }
    if (form.maxBookings && !isPositiveNumber(form.maxBookings)) {
      setFormError('Số lượng đặt tối đa phải là số dương.');
      return;
    }
    setFormError('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        duration: Number(form.duration),
        categories: selectedCategories,
        images: form.images,
        serviceType: form.serviceType,
        maxBookings: Number(form.maxBookings),
        requirements: form.requirements,
        includes: form.includes,
        excludes: form.excludes,
        notes: form.notes
      };
      
      if (editingId !== null && editingId !== undefined && editingId !== '') {
        await serviceService.updateService(editingId, payload);
        toast({ title: 'Cập nhật dịch vụ thành công' });
      } else {
        await serviceService.createService(payload);
        toast({ title: 'Thêm dịch vụ thành công' });
      }
      setOpen(false);
      setForm({ 
        name: '', 
        description: '', 
        price: '', 
        duration: '', 
        categoryId: '', 
        images: [], 
        serviceType: 'both',
        availability: 'available',
        maxBookings: '',
        requirements: [],
        includes: [],
        excludes: [],
        notes: '',
        workingHours: {
          monday: '09:00-18:00',
          tuesday: '09:00-18:00',
          wednesday: '09:00-18:00',
          thursday: '09:00-18:00',
          friday: '09:00-18:00',
          saturday: '09:00-18:00',
          sunday: '09:00-18:00'
        }
      });
      setNewImageUrl('');
      setNewRequirement('');
      setNewInclude('');
      setNewExclude('');
      setEditingId(null);
      fetchServices();
    } catch (error) {
      toast({ title: 'Lỗi', description: error.message || 'Thao tác thất bại.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    try {
      await serviceService.deleteService(id);
      toast({ title: 'Xóa dịch vụ thành công' });
      fetchServices();
    } catch (error) {
      toast({ title: 'Lỗi', description: error.message || 'Xóa dịch vụ thất bại.' });
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const isPositiveNumber = (value) => {
    return !isNaN(value) && Number(value) > 0;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý dịch vụ</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Tìm kiếm và lọc</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Từ khóa</label>
            <Input
              name="keyword"
              placeholder="Tên dịch vụ..."
              value={searchParams.keyword}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Shop ID</label>
            <Input
              name="shopId"
              placeholder="ID shop..."
              value={searchParams.shopId}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Danh mục</label>
            <Input
              name="categories"
              placeholder="Danh mục..."
              value={searchParams.categories}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Loại dịch vụ</label>
            <select
              name="serviceType"
              value={searchParams.serviceType}
              onChange={handleSearchChange}
              className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500/50 bg-white text-black"
            >
              <option value="">Tất cả</option>
              <option value="onsite">Tại chỗ</option>
              <option value="online">Trực tuyến</option>
              <option value="both">Cả hai</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Giá tối thiểu</label>
            <Input
              name="minPrice"
              type="number"
              placeholder="Giá tối thiểu..."
              value={searchParams.minPrice}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Giá tối đa</label>
            <Input
              name="maxPrice"
              type="number"
              placeholder="Giá tối đa..."
              value={searchParams.maxPrice}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Trạng thái</label>
            <select
              name="availability"
              value={searchParams.availability}
              onChange={handleSearchChange}
              className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500/50 bg-white text-black"
            >
              <option value="">Tất cả</option>
              <option value="available">Có sẵn</option>
              <option value="unavailable">Không có sẵn</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={fetchServices} className="w-full">
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Button onClick={openAddModal}>Thêm dịch vụ</Button>
      </div>

      {/* Service Form Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <p className="text-red-400 text-sm mb-2">{formError}</p>}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Tên dịch vụ"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                name="price"
                type="number"
                placeholder="Giá dịch vụ"
                value={form.price}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                name="duration"
                type="number"
                placeholder="Thời gian (phút)"
                value={form.duration}
                onChange={handleChange}
              />
              <Input
                name="maxBookings"
                type="number"
                placeholder="Số lượng đặt tối đa"
                value={form.maxBookings}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Loại dịch vụ</label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500/50 bg-white text-black"
                >
                  <option value="onsite">Tại chỗ</option>
                  <option value="online">Trực tuyến</option>
                  <option value="both">Cả hai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Trạng thái</label>
                <select
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500/50 bg-white text-black"
                >
                  <option value="available">Có sẵn</option>
                  <option value="unavailable">Không có sẵn</option>
                </select>
              </div>
            </div>

            <label className="block font-medium text-white">Danh mục</label>
            <div className="relative category-dropdown">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full justify-between"
              >
                <span>
                  {form.categoryId && form.categoryId.length > 0 
                    ? `${form.categoryId.length} danh mục đã chọn`
                    : "Chọn danh mục..."
                  }
                </span>
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="p-2">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.categoryId && form.categoryId.includes(cat._id)}
                          onChange={(e) => {
                            const currentSelected = form.categoryId || [];
                            if (e.target.checked) {
                              setForm({ 
                                ...form, 
                                categoryId: [...currentSelected, cat._id] 
                              });
                            } else {
                              setForm({ 
                                ...form, 
                                categoryId: currentSelected.filter(id => id !== cat._id) 
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected categories display */}
            {form.categoryId && form.categoryId.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.categoryId.map((catId) => {
                  const category = categories.find(cat => cat._id === catId);
                  return category ? (
                    <span key={catId} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      <span>{category.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            ...form,
                            categoryId: form.categoryId.filter(id => id !== catId)
                          });
                        }}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Images Section */}
            <div className="space-y-2">
              <label className="block font-medium text-white">Hình ảnh dịch vụ</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập link ảnh..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addImageUrl} disabled={!newImageUrl.trim()}>
                  Thêm
                </Button>
              </div>
              {form.images.length > 0 && (
                <div className="border border-gray-600 rounded p-3 bg-gray-800/50">
                  <p className="text-sm text-gray-300 mb-2">Ảnh đã thêm ({form.images.length}):</p>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {form.images.map((url, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-700 rounded">
                        <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'none';
                              }
                            }}
                          />
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs text-gray-400" style={{display: 'none'}}>
                            Lỗi
                          </div>
                        </div>
                        <span className="text-xs text-gray-300 flex-1 truncate" title={url}>{url}</span>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeImageUrl(index)}
                          className="flex-shrink-0"
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Requirements Section */}
            <div className="space-y-2">
              <label className="block font-medium text-white">Yêu cầu</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Thêm yêu cầu..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addRequirement} disabled={!newRequirement.trim()}>
                  Thêm
                </Button>
              </div>
              {form.requirements.length > 0 && (
                <div className="border border-gray-600 rounded p-3 bg-gray-800/50">
                  <p className="text-sm text-gray-300 mb-2">Yêu cầu ({form.requirements.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {form.requirements.map((req, index) => (
                      <span key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        <span>{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Includes Section */}
            <div className="space-y-2">
              <label className="block font-medium text-white">Bao gồm</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Thêm bao gồm..."
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addInclude} disabled={!newInclude.trim()}>
                  Thêm
                </Button>
              </div>
              {form.includes.length > 0 && (
                <div className="border border-gray-600 rounded p-3 bg-gray-800/50">
                  <p className="text-sm text-gray-300 mb-2">Bao gồm ({form.includes.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {form.includes.map((inc, index) => (
                      <span key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        <span>{inc}</span>
                        <button
                          type="button"
                          onClick={() => removeInclude(index)}
                          className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Excludes Section */}
            <div className="space-y-2">
              <label className="block font-medium text-white">Bỏ gồm</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Thêm bỏ gồm..."
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addExclude} disabled={!newExclude.trim()}>
                  Thêm
                </Button>
              </div>
              {form.excludes.length > 0 && (
                <div className="border border-gray-600 rounded p-3 bg-gray-800/50">
                  <p className="text-sm text-gray-300 mb-2">Bỏ gồm ({form.excludes.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {form.excludes.map((exc, index) => (
                      <span key={index} className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        <span>{exc}</span>
                        <button
                          type="button"
                          onClick={() => removeExclude(index)}
                          className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Input
              name="description"
              placeholder="Mô tả dịch vụ"
              value={form.description}
              onChange={handleChange}
            />

            <Input
              name="notes"
              placeholder="Ghi chú"
              value={form.notes}
              onChange={handleChange}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>{editingId ? 'Cập nhật' : 'Thêm dịch vụ'}</Button>
              <Button type="button" variant="ghost" onClick={() => { 
                setOpen(false); 
                setEditingId(null); 
                setForm({ 
                  name: '', 
                  description: '', 
                  price: '', 
                  duration: '', 
                  categoryId: '', 
                  images: [], 
                  serviceType: 'both',
                  availability: 'available',
                  maxBookings: '',
                  requirements: [],
                  includes: [],
                  excludes: [],
                  notes: '',
                  workingHours: {
                    monday: '09:00-18:00',
                    tuesday: '09:00-18:00',
                    wednesday: '09:00-18:00',
                    thursday: '09:00-18:00',
                    friday: '09:00-18:00',
                    saturday: '09:00-18:00',
                    sunday: '09:00-18:00'
                  }
                }); 
                setNewImageUrl('');
                setNewRequirement('');
                setNewInclude('');
                setNewExclude('');
              }}>Hủy</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Services Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Tên dịch vụ</th>
              <th className="px-4 py-2 text-left">Ảnh</th>
              <th className="px-4 py-2 text-left">Giá</th>
              <th className="px-4 py-2 text-left">Thời gian</th>
              <th className="px-4 py-2 text-left">Loại</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Danh mục</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-4">Đang tải...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-4">Chưa có dịch vụ nào</td></tr>
            ) : (
              services.map((service) => (
                <tr key={service._id} className="border-b border-gray-700">
                  <td className="px-4 py-2 font-semibold">{service.name}</td>
                  <td className="px-4 py-2">
                    {service.images && service.images.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center overflow-hidden">
                          <img 
                            src={service.images[0]} 
                            alt={service.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'none';
                              }
                            }}
                          />
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs text-gray-400" style={{display: 'none'}}>
                            No img
                          </div>
                        </div>
                        {service.images.length > 1 && (
                          <span className="text-xs text-gray-400">
                            +{service.images.length - 1} ảnh
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{service.price?.toLocaleString('vi-VN')} VND</td>
                  <td className="px-4 py-2">{service.duration} phút</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      service.serviceType === 'onsite' ? 'bg-blue-600 text-white' :
                      service.serviceType === 'offsite ' ? 'bg-red-600 text-white' :
                      'bg-purple-600 text-white'
                    }`}>
                      {service.serviceType === 'onsite' ? 'Tại chỗ' :
                       service.serviceType === 'offsite ' ? 'Tại nhà' : 'Cả hai'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      service.availability === 'available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {service.availability === 'available' ? 'Có sẵn' : 'Không có sẵn'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {Array.isArray(service.categories)
                      ? service.categories
                          .map(cat => cat.name)
                          .join(', ')
                      : ''}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => openEditModal(service)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(service._id)}>Xóa</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceManagement; 