
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Menu, X, User, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!"
    });
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold gradient-text"
            >
              ServiceHub
            </motion.div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/services" className="text-white hover:text-blue-300 transition-colors">
              Dịch vụ
            </Link>
            <Link to="/terms" className="text-white hover:text-blue-300 transition-colors">
              Điều khoản
            </Link>
     
        
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-white hover:text-blue-300 transition-colors">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-white hover:text-blue-300 transition-colors">
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-t-lg">
                      <Settings className="w-4 h-4 mr-2" />
                      Hồ sơ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 rounded-b-lg"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            <div className="space-y-4">
              <Link to="/services" className="block text-white hover:text-blue-300 transition-colors">
                Dịch vụ
              </Link>
              <Link to="/faq" className="block text-white hover:text-blue-300 transition-colors">
                FAQ
              </Link>
              <Link to="/terms" className="block text-white hover:text-blue-300 transition-colors">
                Điều khoản
              </Link>
              <Link to="/privacy" className="block text-white hover:text-blue-300 transition-colors">
                Bảo mật
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block text-white hover:text-blue-300 transition-colors">
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block text-white hover:text-blue-300 transition-colors">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="block text-white hover:text-blue-300 transition-colors">
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-white hover:text-blue-300 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-white hover:text-blue-300 transition-colors      ">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="block text-white hover:text-blue-300 transition-colors">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
