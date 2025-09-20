import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { campaignsService } from "../../services/campaignsAndStoriesService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const CampaignSlider = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        console.log("🎯 CampaignSlider: Kampanyalar yükleniyor...");
        setIsLoading(true);

        const response = await campaignsService.getAllCampaigns();
        console.log("📊 CampaignSlider API Response:", response);
        console.log("📊 CampaignSlider Response Type:", typeof response);
        console.log("📊 CampaignSlider Response Data:", response.data);
        console.log(
          "📊 CampaignSlider Response Data Type:",
          typeof response.data
        );
        console.log(
          "📊 CampaignSlider Response Data Is Array:",
          Array.isArray(response.data)
        );

        // Django'dan gelen veri yapısı: {message: "...", data: [...]}
        const data = response.data || [];
        console.log("📊 CampaignSlider Extracted Data:", data);
        console.log("📊 CampaignSlider Data Type:", typeof data);
        console.log("📊 CampaignSlider Data Is Array:", Array.isArray(data));
        console.log("📊 CampaignSlider Data Length:", data?.length);

        // Transform API data to match component structure
        const transformedCampaigns = Array.isArray(data)
          ? data.map((campaign) => {
              console.log(
                "🔄 CampaignSlider: Kampanya dönüştürülüyor:",
                campaign
              );
              console.log(
                "🔄 CampaignSlider: Campaign.banner raw value:",
                campaign.banner
              );
              console.log(
                "🔄 CampaignSlider: Campaign.banner type:",
                typeof campaign.banner
              );
              console.log(
                "🔄 CampaignSlider: Campaign.banner starts with /media/:",
                campaign.banner?.startsWith("/media/")
              );

              // Django'dan gelen banner dosya adını tam URL'ye çevir
              let bannerUrl;
              if (campaign.banner) {
                if (campaign.banner.startsWith("/media/")) {
                  bannerUrl = `https://imecehub.com${campaign.banner}`;
                  console.log(
                    "🔄 CampaignSlider: Media URL constructed:",
                    bannerUrl
                  );
                } else if (campaign.banner.startsWith("http")) {
                  bannerUrl = campaign.banner;
                  console.log("🔄 CampaignSlider: Full URL used:", bannerUrl);
                } else {
                  bannerUrl = `https://imecehub.com/media/${campaign.banner}`;
                  console.log(
                    "🔄 CampaignSlider: Media path constructed:",
                    bannerUrl
                  );
                }
              } else {
                bannerUrl = "https://picsum.photos/800/400?random=1";
                console.log("🔄 CampaignSlider: Default Picsum URL used");
              }

              console.log("🔄 CampaignSlider: Final bannerUrl:", bannerUrl);

              // Kampanya tipine göre renk belirle
              const getColorByType = (type) => {
                switch (type) {
                  case "discount":
                    return "from-red-500 to-pink-500";
                  case "new_product":
                    return "from-blue-500 to-cyan-500";
                  case "seasonal":
                    return "from-green-500 to-emerald-500";
                  case "flash_sale":
                    return "from-orange-500 to-red-500";
                  default:
                    return "from-purple-500 to-pink-500";
                }
              };

              return {
                id: campaign.id,
                title: campaign.title || "Kampanya",
                subtitle: campaign.subtitle || "",
                description: campaign.description || "",
                image: bannerUrl,
                buttonText: "Detayları Gör",
                color: getColorByType(campaign.campaign_type),
                campaign_type: campaign.campaign_type,
              };
            })
          : [];

        console.log(
          "✅ CampaignSlider: Dönüştürülmüş kampanyalar:",
          transformedCampaigns
        );
        setCampaigns(transformedCampaigns);
      } catch (err) {
        console.error("❌ CampaignSlider: Kampanyalar yüklenirken hata:", err);
        console.error("❌ CampaignSlider: Error response:", err.response?.data);
        console.error("❌ CampaignSlider: Error status:", err.response?.status);
        console.error("❌ CampaignSlider: Error message:", err.message);
        setError("Kampanyalar yüklenemedi");

        // Set empty data if API fails
        setCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCampaignClick = () => {
    // Navigate to campaigns page or specific campaign
    navigate("/campaigns");
  };

  if (isLoading) {
    return (
      <div className="campaign-slider-container">
        <div className="flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error && campaigns.length === 0) {
    return (
      <div className="campaign-slider-container">
        <div className="flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="campaign-slider-container">
        <div className="flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px]">
          <div className="text-center">
            <p className="text-gray-500">Henüz kampanya bulunmuyor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-slider-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
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

                  {/* Campaign Type */}
                  <div className="campaign-type">
                    <span className="type-badge">{campaign.campaign_type}</span>
                  </div>

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
