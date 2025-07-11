import React, { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataContext.jsx';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import userService from '../service/userService';
import categoryService from '../service/categoryService';

const AdminDashboard = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getAllUsers = async () => {
        try {
            setIsLoading(true);
            const params = {};
            if (filterRole) params.role = filterRole;
            if (searchKeyword.trim()) params.keyword = searchKeyword.trim();
            
            const response = await userService.getUsers(params);
            // response.data là mảng user
            setUsers(response.data);
        } catch (error) {
            toast({ title: "Lỗi", description: error.message || "Không thể tải danh sách người dùng." });
        } finally {
            setIsLoading(false);
        }
    }

    const getAllCategories = async () => {
        try {
            const response = await categoryService.getCategories();
            console.log(response.data);
            setCategories(response.data);
        } catch (error) {
            toast({ title: "Lỗi", description: error.message || "Không thể tải danh sách danh mục." });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearch = () => {
        getAllUsers();

    };

    const handleResetFilter = () => {
        setSearchKeyword('');
        setFilterRole('');
    };

    useEffect(() => {
        getAllUsers();
        getAllCategories();
    }, []);

    useEffect(() => {
        if (!searchKeyword && !filterRole) {
            getAllUsers();
        }
    }, [searchKeyword, filterRole]);

    // User Management
    const handleUserUpdate = (e) => {
        e.preventDefault();
        const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
        setUsers(updatedUsers);
        setEditingUser(null);
        toast({ title: "Thành công", description: "Thông tin người dùng đã được cập nhật." });
    };

    const deleteUser = (userId) => {
        setUsers(users.filter(u => u.id !== userId));
        toast({ title: "Thành công", description: "Người dùng đã được xóa." });
    };

    // Category Management
    const handleCategorySave = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) { 
                // Update
                const result = await categoryService.updateCategory(editingCategory._id, { 
                    name: newCategoryName.trim(),
                    description: newCategoryDescription.trim()
                });
                console.log(result);
                // Refresh categories list
                getAllCategories();
                toast({ title: "Thành công", description: "Danh mục đã được cập nhật." });
            } else { 
                // Add
                const result = await categoryService.createCategory({ 
                    name: newCategoryName.trim(),
                    description: newCategoryDescription.trim()
                });
                console.log(result);
                // Refresh categories list
                getAllCategories();
                toast({ title: "Thành công", description: "Danh mục mới đã được thêm." });
            }
        } catch (error) {
            toast({ title: "Lỗi", description: error.message || "Thao tác thất bại." });
        }
        setEditingCategory(null);
        setNewCategoryName('');
        setNewCategoryDescription('');
    };

    const deleteCategory = async (catId) => {
        try {
            const result = await categoryService.deleteCategory(catId);
            console.log(result);
            // Refresh categories list
            getAllCategories();
            toast({ title: "Thành công", description: "Danh mục đã được xóa." });
        } catch (error) {
            toast({ title: "Lỗi", description: error.message || "Xóa danh mục thất bại." });
        }
    };

    const startEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
        setNewCategoryDescription(category.description || '');
    };

    return (
        <>
            <Helmet>
                <title>Bảng Điều Khiển Quản Trị - DịchVụPro</title>
                <meta name="description" content="Quản lý người dùng và danh mục dịch vụ trên toàn bộ nền tảng." />
            </Helmet>
            <div className="space-y-8">
                <h1 className="text-4xl font-bold text-blue-400">Bảng Điều Khiển Quản Trị</h1>

                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                        <TabsTrigger value="users"><User className="mr-2 h-4 w-4" />Quản Lý Người Dùng</TabsTrigger>
                        <TabsTrigger value="categories"><Tag className="mr-2 h-4 w-4" />Quản Lý Danh Mục</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Danh sách người dùng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Search và Filter */}
                                <div className="mb-6 flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm theo tên, email..."
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={filterRole}
                                            onChange={(e) => setFilterRole(e.target.value)}
                                            className="p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white"
                                        >
                                            <option value="">Tất cả vai trò</option>
                                            <option value="admin">Admin</option>
                                            <option value="shop">Shop</option>
                                            <option value="customer">Customer</option>
                                        </select>
                                        <Button 
                                            onClick={handleSearch}
                                            className="bg-blue-600 hover:bg-blue-700 px-6"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
                                        </Button>
                                        <Button 
                                            onClick={handleResetFilter}
                                            variant="outline" 
                                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                        >
                                            Đặt lại
                                        </Button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="p-4 text-center">STT</th>
                                                <th className="p-4">Tên đăng nhập</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Họ</th>
                                                <th className="p-4">Tên</th>
                                                <th className="p-4 text-center">Vai trò</th>
                                                <th className="p-4 text-right">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, idx) => (
                                                <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/30 transition">
                                                    <td className="p-4 text-center font-semibold text-gray-400">{idx + 1}</td>
                                                    <td className="p-4 font-medium text-blue-300">{user.username}</td>
                                                    <td className="p-4 text-gray-200">{user.email}</td>
                                                    <td className="p-4 text-gray-200">{user.lastName}</td>
                                                    <td className="p-4 text-gray-200">{user.firstName}</td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                                            ${user.role === 'admin' ? 'bg-blue-600 text-white' : user.role === 'seller' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}`}>{user.role}</span>
                                                    </td>
                                                    <td className="p-4 flex space-x-2 justify-end">
                                                        <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                                                            <Edit className="h-5 w-5 text-blue-400" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => deleteUser(user._id)}>
                                                            <Trash2 className="h-5 w-5 text-red-400" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="categories">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">Danh sách loại dịch vụ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCategorySave} className="space-y-4 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Tên danh mục *</label>
                                            <input 
                                                value={newCategoryName} 
                                                onChange={e => setNewCategoryName(e.target.value)} 
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white" 
                                                placeholder="Nhập tên danh mục" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-300 block mb-2">Mô tả</label>
                                            <input 
                                                value={newCategoryDescription} 
                                                onChange={e => setNewCategoryDescription(e.target.value)} 
                                                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition text-white" 
                                                placeholder="Nhập mô tả danh mục" 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                            {editingCategory ? 'Cập nhật' : 'Thêm'}
                                        </Button>
                                        {editingCategory && (
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="border-gray-600 text-gray-300 hover:bg-gray-700" 
                                                onClick={() => { 
                                                    setEditingCategory(null); 
                                                    setNewCategoryName(''); 
                                                    setNewCategoryDescription(''); 
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                        )}
                                    </div>
                                </form>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="p-4">Tên Danh Mục</th>
                                                <th className="p-4">Mô Tả</th>
                                                <th className="p-4 text-right">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map(cat => (
                                                <tr key={cat._id} className="border-b border-gray-700">
                                                    <td className="p-4">{cat.name}</td>
                                                    <td className="p-4 text-gray-300">{cat.description || 'Không có mô tả'}</td>
                                                    <td className="p-4 flex space-x-2 justify-end">
                                                        <Button variant="ghost" size="icon" onClick={() => startEditCategory(cat)}>
                                                            <Edit className="h-5 w-5 text-blue-400" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat._id)}>
                                                            <Trash2 className="h-5 w-5 text-red-400" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default AdminDashboard;