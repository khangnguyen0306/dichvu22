import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button } from '@/components/ui/button';

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Dịch vụ tận nơi, nhanh chóng',
    description: 'Đặt lịch dịch vụ chuyên nghiệp, phục vụ tận nhà chỉ với vài cú click.',
    cta: 'Khám phá ngay',
    link: '/services',
  },
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    title: 'Chuyên gia uy tín',
    description: 'Đội ngũ chuyên gia được kiểm duyệt, đảm bảo chất lượng dịch vụ.',
    cta: 'Xem chuyên gia',
    link: '/about',
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    title: 'Ưu đãi hấp dẫn',
    description: 'Nhiều chương trình khuyến mãi, ưu đãi dành cho khách hàng mới.',
    cta: 'Nhận ưu đãi',
    link: '/packages',
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
};

const SliderBanner = () => (
  <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg mb-12">
    <Slider {...settings}>
      {banners.map((banner, idx) => (
        <div key={idx}>
          <div className="relative h-72 md:h-96 flex items-center justify-center bg-gray-900">
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="relative z-10 text-center px-6">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{banner.title}</h2>
              <p className="text-lg md:text-2xl text-gray-100 mb-6 drop-shadow-lg">{banner.description}</p>
              <a href={banner.link}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg font-semibold rounded-full shadow-lg">
                  {banner.cta}
                </Button>
              </a>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
);

export default SliderBanner; 