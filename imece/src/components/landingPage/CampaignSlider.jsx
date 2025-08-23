import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const CampaignSlider = () => {
  const navigate = useNavigate();

  // Campaign data - later will come from API
  const campaigns = [
    {
      id: 1,
      title: "Yeni Sezon İndirimi",
      subtitle: "%50'ye varan indirimler",
      description: "En yeni ürünlerde büyük fırsatlar",
      image: "https://picsum.photos/800/400?random=1",
      buttonText: "Alışverişe Başla",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "Grup Alım Avantajı",
      subtitle: "Birlikte al, daha ucuza al",
      description: "Arkadaşlarınla birlikte alışveriş yap",
      image: "https://picsum.photos/800/400?random=2",
      buttonText: "Grup Oluştur",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      title: "Flash Satış",
      subtitle: "Sadece bugün geçerli",
      description: "24 saat boyunca özel fiyatlar",
      image: "https://picsum.photos/800/400?random=3",
      buttonText: "Hemen Katıl",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 4,
      title: "Yeni Üye Kampanyası",
      subtitle: "İlk alışverişe özel",
      description: "Yeni üyelere özel %25 indirim",
      image: "https://picsum.photos/800/400?random=4",
      buttonText: "Üye Ol",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 5,
      title: "Sezon Sonu",
      subtitle: "Son fırsatlar",
      description: "Sezon sonu ürünlerde büyük indirim",
      image: "https://picsum.photos/800/400?random=5",
      buttonText: "Fırsatları Kaçırma",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const handleCampaignClick = () => {
    // Navigate to homepage for now
    navigate("/");
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-2 sm:px-4 my-4 sm:my-6 md:my-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="slide"
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        grabCursor={true}
        touchRatio={1}
        touchAngle={45}
        resistance={true}
        resistanceRatio={0.85}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
            navigation: false,
            pagination: { clickable: true },
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
            navigation: true,
            pagination: { clickable: true },
          },
        }}
        className="campaign-swiper h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]"
      >
        {campaigns.map((campaign) => (
          <SwiperSlide key={campaign.id}>
            <div className="campaign-slide">
              {/* Background Image */}
              <img src={campaign.image} alt={campaign.title} />

              {/* Gradient Overlay */}
              <div className="campaign-overlay"></div>

              {/* Content */}
              <div className="campaign-content">
                <div className="campaign-text">
                  {/* Badge */}
                  <div className="campaign-badge">
                    <span>Kampanya</span>
                  </div>

                  {/* Title */}
                  <h2 className="campaign-title">{campaign.title}</h2>

                  {/* Subtitle */}
                  <h3 className="campaign-subtitle">{campaign.subtitle}</h3>

                  {/* Description */}
                  <p className="campaign-description">{campaign.description}</p>

                  {/* Button */}
                  <button
                    className={`campaign-button bg-gradient-to-r ${campaign.color}`}
                    onClick={handleCampaignClick}
                  >
                    {campaign.buttonText}
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CampaignSlider;
