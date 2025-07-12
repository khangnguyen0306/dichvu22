import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext.jsx';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, ShoppingBag, BarChart2, DollarSign } from 'lucide-react';
import { Helmet } from 'react-helmet';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceForm from '@/components/ServiceForm.jsx';
import { useToast } from "@/components/ui/use-toast";

const revenueData = [
  { name: 'Tháng 1', DoanhThu: 4000000 },
  { name: 'Tháng 2', DoanhThu: 3000000 },
  { name: 'Tháng 3', DoanhThu: 5000000 },
  { name: 'Tháng 4', DoanhThu: 4780000 },
  { name: 'Tháng 5', DoanhThu: 5890000 },
  { name: 'Tháng 6', DoanhThu: 6390000 },
];

const ordersData = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', date: '2025-07-10', total: 1500000, status: 'Hoàn thành' },
    { id: 'ORD002', customer: 'Trần Thị B', date: '2025-07-09', total: 800000, status: 'Hoàn thành' },
    { id: 'ORD003', customer: 'Lê Văn C', date: '2025-07-08', total: 2500000, status: 'Đang xử lý' },
    { id: 'ORD004', customer: 'Phạm Thị D', date: '2025-07-07', total: 4500000, status: 'Đã hủy' },
];

const Dashboard = () => {
  const { services, currentUser, addService, updateService, deleteService } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { toast } = useToast();

  const sellerServices = services.filter(s => s.seller === currentUser.name);

  const handleSave = (serviceData) => {
    if (editingService) {
      updateService({ ...serviceData, id: editingService.id });
      toast({ title: "Thành công", description: "Dịch vụ đã được cập nhật." });
    } else {
      addService(serviceData);
      toast({ title: "Thành công", description: "Dịch vụ mới đã được thêm." });
    }
    setShowForm(false);
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleDelete = (serviceId) => {
    deleteService(serviceId);
    toast({ title: "Thành công", description: "Dịch vụ đã được xóa." });
  };

  return (
    <>
      <Helmet>
        <title>Bảng Điều Khiển - URGENT</title>
        <meta name="description" content="Quản lý dịch vụ, xem thống kê và theo dõi hiệu suất cửa hàng của bạn." />
      </Helmet>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-blue-400">Bảng Điều Khiển Cửa Hàng</h1>

        {showForm && (
            <ServiceForm
              service={editingService}
              onSubmit={handleSave}
              onCancel={() => { setShowForm(false); setEditingService(null); }}
            />
        )}

        <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="services"><ShoppingBag className="mr-2 h-4 w-4" />Dịch Vụ</TabsTrigger>
                <TabsTrigger value="orders"><BarChart2 className="mr-2 h-4 w-4" />Đơn Hàng</TabsTrigger>
                <TabsTrigger value="revenue"><DollarSign className="mr-2 h-4 w-4" />Doanh Thu</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Quản Lý Dịch Vụ</CardTitle>
                        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                            <PlusCircle className="mr-2" /> Thêm Mới
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="p-4">Tên Dịch Vụ</th>
                                        <th className="p-4">Giá</th>
                                        <th className="p-4 text-right">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellerServices.map(service => (
                                        <tr key={service.id} className="border-b border-gray-700">
                                            <td className="p-4">{service.name}</td>
                                            <td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</td>
                                            <td className="p-4 flex space-x-2 justify-end">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                                                    <Edit className="h-5 w-5 text-blue-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
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

            <TabsContent value="orders">
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Quản Lý Đơn Hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="p-4">Mã Đơn</th>
                                        <th className="p-4">Khách Hàng</th>
                                        <th className="p-4">Ngày</th>
                                        <th className="p-4">Tổng Tiền</th>
                                        <th className="p-4">Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersData.map(order => (
                                        <tr key={order.id} className="border-b border-gray-700">
                                            <td className="p-4 text-blue-400">{order.id}</td>
                                            <td className="p-4">{order.customer}</td>
                                            <td className="p-4">{order.date}</td>
                                            <td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    order.status === 'Hoàn thành' ? 'bg-green-500/20 text-green-300' :
                                                    order.status === 'Đang xử lý' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="revenue">
                <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Thống Kê Doanh Thu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">Tổng Doanh Thu</p>
                                <p className="text-3xl font-bold">150,000,000₫</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">Tổng Đơn Hàng</p>
                                <p className="text-3xl font-bold">125</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <p className="text-gray-400">Dịch Vụ Đang Bán</p>
                                <p className="text-3xl font-bold">{sellerServices.length}</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="name" stroke="#A0AEC0" />
                                <YAxis stroke="#A0AEC0" tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}/>
                                <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="DoanhThu" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;