import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import Layout from '@/components/Layout.jsx';
import Home from '@/pages/Home.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import VerifyEmail from '@/pages/VerifyEmail.jsx';
import ForgotPassword from '@/pages/ForgotPassword.jsx';
import Services from '@/pages/Services.jsx';
import ServiceDetail from '@/pages/ServiceDetail.jsx';
import BookingDetail from '@/pages/BookingDetail.jsx';
import BookingPaymentSuccess from '@/pages/BookingPaymentSuccess.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import Profile from '@/pages/Profile.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import AdminStatistics from '@/pages/AdminStatistics.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import AboutUs from '@/pages/AboutUs.jsx';
import Contact from '@/pages/Contact.jsx';
import { Toaster } from "@/components/ui/toaster";
import ShopAdmin from './pages/ShopAdmin';
import ShopBookingManagement from './pages/ShopBookingManagement';
import Packages from './pages/Packages';
import PaymentSuccess from './pages/PaymentSuccess';
import ShopDetail from './pages/ShopDetail';
import FAQ from '@/pages/FAQ';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-email/:token" element={<VerifyEmail />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<AboutUs />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="faq" element={<FAQ />} />
                            <Route path="terms" element={<Terms />} />
                            <Route path="privacy" element={<Privacy />} />
                            <Route path="services" element={<Services />} />
                            <Route path="services/:serviceId" element={<ServiceDetail />} />
                            <Route path="booking/:serviceId" element={<BookingDetail />} />
                            <Route path="packages" element={<Packages />} />
                            <Route path="payment-success" element={<PaymentSuccess />} />
                            <Route path="shop/:shopId" element={<ShopDetail />} />
                            <Route path="booking-payment-success" element={<BookingPaymentSuccess />} />
                            <Route path="profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="dashboard" element={
                                <ProtectedRoute roles={['seller']}>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="admin" element={
                                <ProtectedRoute roles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="admin/statistics" element={
                                <ProtectedRoute roles={['admin']}>
                                    <AdminStatistics />
                                </ProtectedRoute>
                            } />
                            <Route path="shop-admin" element={
                                <ProtectedRoute roles={['shop']}>
                                    <ShopAdmin />
                                </ProtectedRoute>
                            } />
                            <Route path="shop-booking-management" element={
                                <ProtectedRoute roles={['shop']}>
                                    <ShopBookingManagement />
                                </ProtectedRoute>
                            } />
                        </Route>
                    </Routes>
                </Router>
                <Toaster />
            </DataProvider>
        </AuthProvider>
    );
}

export default App;