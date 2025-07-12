import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Đã gửi tin nhắn!",
      description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
    });
    e.target.reset();
  };

  return (
    <>
      <Helmet>
        <title>Liên Hệ - URGENT</title>
        <meta name="description" content="Liên hệ với URGENT để được hỗ trợ, giải đáp thắc mắc hoặc hợp tác." />
      </Helmet>
      <div className="space-y-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 px-4 bg-gradient-to-b from-blue-900/30 to-gray-900 rounded-lg"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Liên Hệ Với <span className="text-blue-400">Chúng Tôi</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn lòng lắng nghe. Hãy gửi cho chúng tôi một tin nhắn và chúng tôi sẽ liên lạc lại với bạn.
          </p>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6">Gửi Tin Nhắn</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Tên của bạn</Label>
                  <Input id="name" type="text" placeholder="Nguyễn Văn A" className="mt-2 bg-gray-700 border-gray-600" required />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" placeholder="bạn@email.com" className="mt-2 bg-gray-700 border-gray-600" required />
                </div>
              </div>
              <div>
                <Label htmlFor="subject" className="text-gray-300">Chủ đề</Label>
                <Input id="subject" type="text" placeholder="Về vấn đề bạn quan tâm" className="mt-2 bg-gray-700 border-gray-600" required />
              </div>
              <div>
                <Label htmlFor="message" className="text-gray-300">Tin nhắn</Label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Viết tin nhắn của bạn ở đây..."
                  className="mt-2 w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition resize-none"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                <Send className="mr-2 h-5 w-5" /> Gửi
              </Button>
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-6">Thông Tin Liên Hệ</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:support@dichvupro.com" className="text-gray-300 hover:text-blue-400">support@dichvupro.com</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Điện thoại</p>
                    <a href="tel:+84123456789" className="text-gray-300 hover:text-blue-400">+84 123 456 789</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Địa chỉ</p>
                    <p className="text-gray-300">123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-64">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=106.690,10.770,106.710,10.780&layer=mapnik"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;