import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { toast } from '../components/ui/use-toast';
import productService from '../service/productService';
import categoryService from '../service/categoryService';

const ShopAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', categoryId: '' });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts();
      setProducts(res.data || res);
    } catch (error) {
      toast({ title: 'Lỗi', description: error.message || 'Không thể tải sản phẩm.' });
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
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setForm({ name: '', price: '', description: '', categoryId: '' });
    setEditingId(null);
    setOpen(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: Array.isArray(product.categories) ? product.categories : [product.categoryId || product.category || '']
    });
    setEditingId(product.id || product._id);
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedCategories = Array.isArray(form.categoryId) ? form.categoryId : form.categoryId ? [form.categoryId] : [];
    if (!form.name || !form.price || selectedCategories.length === 0) {
      toast({ title: 'Vui lòng nhập đầy đủ tên, giá và chọn danh mục' });
      return;
    }
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        categories: selectedCategories,
      };
      delete payload.categoryId;
      if (editingId !== null && editingId !== undefined && editingId !== '') {
        await productService.updateProduct(editingId, payload);
        toast({ title: 'Cập nhật sản phẩm thành công' });
      } else {
        await productService.createProduct(payload);
        toast({ title: 'Thêm sản phẩm thành công' });
      }
      setOpen(false);
      setForm({ name: '', price: '', description: '', categoryId: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      toast({ title: 'Lỗi', description: error.message || 'Thao tác thất bại.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await productService.deleteProduct(id);
      toast({ title: 'Xóa sản phẩm thành công' });
      fetchProducts();
    } catch (error) {
      toast({ title: 'Lỗi', description: error.message || 'Xóa sản phẩm thất bại.' });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Quản trị sản phẩm</h1>
      <div className="mb-4">
        <Button onClick={openAddModal}>Thêm sản phẩm</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId !== null ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Tên sản phẩm"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              name="price"
              type="number"
              placeholder="Giá sản phẩm"
              value={form.price}
              onChange={handleChange}
            />
            <label className="block font-medium text-gray-700">Danh mục</label>
            <select
              name="categoryId"
              multiple
              value={form.categoryId instanceof Array ? form.categoryId : form.categoryId ? [form.categoryId] : []}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(o => o.value);
                setForm({ ...form, categoryId: options });
              }}
              className="w-full p-2 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500/50 bg-white text-black"
              required
            >
              <option value="" disabled>-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
              ))}
            </select>
            <Input
              name="description"
              placeholder="Mô tả sản phẩm"
              value={form.description}
              onChange={handleChange}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>{editingId ? 'Cập nhật' : 'Thêm sản phẩm'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setOpen(false); setEditingId(null); setForm({ name: '', price: '', description: '', categoryId: '' }); }}>Hủy</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Tên sản phẩm</th>
              <th className="px-4 py-2 text-left">Giá</th>
              <th className="px-4 py-2 text-left">Danh mục</th>
              <th className="px-4 py-2 text-left">Mô tả</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">Chưa có sản phẩm nào</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700">
                  <td className="px-4 py-2 font-semibold">{product.name}</td>
                  <td className="px-4 py-2">{product.price?.toLocaleString()} VND</td>
                  <td className="px-4 py-2">
                    {Array.isArray(product.categories)
                      ? product.categories
                          .map(cat =>
                            typeof cat === 'object' && cat !== null
                              ? cat.name
                              : categories.find(c => (c.id || c._id) === cat)?.name
                          )
                          .filter(Boolean)
                          .join(', ')
                      : categories.find(c => (c.id || c._id) === (product.categoryId || product.category))?.name || ''}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-400">{product.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => openEditModal(product)}>Sửa</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id || product._id)}>Xóa</Button>
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

export default ShopAdmin; 