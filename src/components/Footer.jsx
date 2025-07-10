
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-white/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <span className="text-2xl font-bold gradient-text">ServiceHub</span>
            <p className="text-gray-300">
              Nền tảng kết nối dịch vụ hàng đầu Việt Nam. Tìm kiếm và cung cấp dịch vụ chất lượng cao.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-300 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-300 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-300 hover:text-pink-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <span className="text-lg font-semibold text-white">Liên kết nhanh</span>
            <div className="space-y-2">
              <Link to="/services" className="block text-gray-300 hover:text-white transition-colors">
                Dịch vụ
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">
                Về chúng tôi
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Liên hệ
              </Link>
              <Link to="/help" className="block text-gray-300 hover:text-white transition-colors">
                Trợ giúp
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <span className="text-lg font-semibold text-white">Danh mục</span>
            <div className="space-y-2">
              <Link to="/services?category=design" className="block text-gray-300 hover:text-white transition-colors">
                Thiết kế đồ họa
              </Link>
              <Link to="/services?category=web" className="block text-gray-300 hover:text-white transition-colors">
                Lập trình web
              </Link>
              <Link to="/services?category=marketing" className="block text-gray-300 hover:text-white transition-colors">
                Marketing
              </Link>
              <Link to="/services?category=content" className="block text-gray-300 hover:text-white transition-colors">
                Viết nội dung
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <span className="text-lg font-semibold text-white">Liên hệ</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">support@servicehub.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300">Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 ServiceHub. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
