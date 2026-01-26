import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import axios from "axios";
import "../../styles/landingPage_styles/header.css";
import incele from "../../assets/vectors/homepage_incele_white.svg";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookieManager";

const itemCard = ({ data }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false); // Beğenme durumunu takip etmek için
  const accessToken = getCookie("accessToken"); // Token'i al
  const apiKey = "fb10ca29411e8fa4725e11ca519b732de5c911769ff1956e84d4";

  const handleClick = () => {
    navigate("/order-page");
  };

  const rating = parseFloat(data.degerlendirme_puani);

  const renderStars = () => {
    let stars = [];
    const fullStars = Math.floor(rating); // Tam yıldız sayısı
    const hasHalfStar = rating % 1 >= 0.5; // Yarım yıldız kontrolü

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-icon" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="star-icon" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="star-icon" />);
    }

    return stars;
  };

  const handleLike = async (e) => {
    e.stopPropagation(); // Ürün sayfasına gitmeyi engelle

    console.log(data);
    if (!accessToken) {
      console.error("Token bulunamadı. Kullanıcı giriş yapmış mı?");
      return;
    }

    try {
      const userId = getCookie("userId"); // Kullanıcının ID'sini al
      const apiUrl = `https://34.22.218.90/api/users/kullanicilar/${userId}/`; // Kullanıcı ID'sine göre API isteği yapılacak
      const productId = data.urun_id; // Beğenilen ürünün ID'si

      // Beğenme durumu kontrolü
      const requestBody = liked
        ? { remove_favori_urunler: [productId] } // Eğer beğenildiyse, favoriden çıkar
        : { favori_urunler: [productId] }; // Eğer beğenilmediyse, favoriye ekle

      // API'ye PATCH isteği gönder
      await axios.patch(
        apiUrl,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      setLiked(!liked); // Beğenme durumunu değiştir
    } catch (error) {
      console.error("Ürün favorilere eklenmesi veya çıkarılması sırasında hata oluştu:", error);
    }
  };

  return (
    <div className="popular-box pointer">
      <div className="popular-image">
        <img src={data.kapak_gorseli} alt="" />
      </div>
      <div className="popular-name">{data.urun_adi}</div>
      <div className="popular-rating">
        <div className="star-container">{renderStars()}</div>
      </div>
      <div className="font-bold capitalize">
        1 {data.birimi} {data.fiyat} ₺
      </div>
      <div className="popular-expression">
        <p>{data.aciklama}</p>
      </div>
      <div className="itemcard2-bottom">
        <div className="popular-link">
          <p>Sepete Ekle</p>
          <img src={incele} alt="" />
        </div>
        <div className="itemcard2-like" onClick={handleLike}>
          {liked ? <FcLike size={24} /> : <CiHeart size={24} />}
        </div>
      </div>
    </div>
  );
};

export default itemCard;
