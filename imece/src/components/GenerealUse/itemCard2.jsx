import React from "react";
import star from "../../assets/vectors/star.svg";
import incele from "../../assets/vectors/homepage_incele_white.svg";
import like from "../../assets/vectors/favourite.svg";
import "../../styles/landingPage_styles/header.css";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa6";
import { useState } from "react";

const itemCard = ({ data }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false); // Beğenme durumunu takip etmek için
  const accessToken = localStorage.getItem("accessToken"); // Token'i al
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

    if (!accessToken) {
      console.error("Token bulunamadı. Kullanıcı giriş yapmış mı?");
      return;
    }

    try {
      const apiUrl = `https://34.22.218.90/api/users/kullanicilar/${data.id}/`; // data.id gönderilecek

      await axios.patch(
        apiUrl,
        {}, // PATCH isteği için veri gerekmez (sadece ID gidiyor)
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Token ekleniyor
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      setLiked(!liked); // Beğenme durumunu değiştir
    } catch (error) {
      console.error("Ürün beğenme işlemi sırasında hata oluştu:", error);
    }
  };

  return (
    <div  className="popular-box  pointer">
      {/* burada bulunan css claslarının popular ile baslayanlari popular.css dosyasında bulunuyor*/}

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
          <p> Sepete Ekle</p>
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
