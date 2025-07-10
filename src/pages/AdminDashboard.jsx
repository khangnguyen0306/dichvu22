import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext.jsx';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
    const { users, setUsers, categories, setCategories } = useData();
    const [editingUser, setEditingUser] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const { toast } = useToast();

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
    const handleCategorySave = (e) => {
        e.preventDefault();
        if (editingCategory.id) { // Update
            setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: newCategoryName } : c));
            toast({ title: "Thành công", description: "Danh mục đã được cập nhật." });
        } else { // Add
            setCategories([...categories, { id: Date.now(), name: newCategoryName }]);
            toast({ title: "Thành công", description: "Danh mục mới đã được thêm." });
        }
        setEditingCategory(null);
        setNewCategoryName('');
    };
    const deleteCategory = (catId) => {
        setCategories(categories.filter(c => c.id !== catId));
        toast({ title: "Thành công", description: "Danh mục đã được xóa." });
    };

    const startEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
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
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="p-4">Tên</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Vai trò</th>
                                                <th className="p-4 text-right">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id} className="border-b border-gray-700">
                                                    <td className="p-4">{user.name}</td>
                                                    <td className="p-4">{user.email}</td>
                                                    <td className="p-4">
                                                        {editingUser?.id === user.id ? (
                                                            <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="p-1 bg-gray-600 rounded">
                                                                <option value="user">User</option>
                                                                <option value="seller">Seller</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        ) : user.role}
                                                    </td>
                                                    <td className="p-4 flex space-x-2 justify-end">
                                                        {editingUser?.id === user.id ? (
                                                            <>
                                                                <Button size="sm" onClick={handleUserUpdate}>Lưu</Button>
                                                                <Button size="sm" variant="ghost" onClick={() => setEditingUser(null)}>Hủy</Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                                                                    <Edit className="h-5 w-5 text-blue-400" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => deleteUser(user.id)}>
                                                                    <Trash2 className="h-5 w-5 text-red-400" />
                                                                </Button>
                                                            </>
                                                        )}
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
                                <CardTitle className="text-white">Danh sách danh mục</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCategorySave} className="flex gap-2 mb-6">
                                    <input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-grow p-2 bg-gray-700 rounded" placeholder={editingCategory ? "Chỉnh sửa tên danh mục..." : "Thêm danh mục mới..."} required />
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{editingCategory ? 'Cập nhật' : 'Thêm'}</Button>
                                    {editingCategory && <Button type="button" variant="ghost" onClick={() => { setEditingCategory(null); setNewCategoryName(''); }}>Hủy</Button>}
                                </form>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="p-4">Tên Danh Mục</th>
                                                <th className="p-4 text-right">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map(cat => (
                                                <tr key={cat.id} className="border-b border-gray-700">
                                                    <td className="p-4">{cat.name}</td>
                                                    <td className="p-4 flex space-x-2 justify-end">
                                                        <Button variant="ghost" size="icon" onClick={() => startEditCategory(cat)}>
                                                            <Edit className="h-5 w-5 text-blue-400" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}>
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