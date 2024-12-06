import React from "react";
import star from "../../assets/vectors/star.svg";
import incele from "../../assets/vectors/homepage_incele_white.svg";
import like from "../../assets/vectors/favourite.svg";
import "../../styles/landingPage_styles/header.css";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const itemCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/order-page"); 
  };

  return (
    <div onClick={handleClick} className="popular-box  pointer">
      {/* burada bulunan css claslarının popular ile baslayanlari popular.css dosyasında bulunuyor*/}

      <div className="popular-image">
        <img
          src="https://s3-alpha-sig.figma.com/img/ebab/4772/fece3f97244726a20a8e0f7945edd37e?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oq3Gpu9gMnqe~p3NRjPbVQnBSqK5vHexROMkh2yewhm5USW4Z-rexMj87Lxr0qr3aeGuIR0rI8z9KKidZyo68Gf47P-1uuR7VbkhkaKlgyKVeyfR5v8SB4waL~5wnqxzzBokyGpK-dGfVDO6T0sxYlLxh0o5EafLQ-pbrV5PIEn70xYDCKucMpE3aXVCf~NqLG7d3QvH3cMU7JPNqw2osWZUDCTpT61W4FqMzCjuU5qPx7zWcdVrwneIX9f5hMdp-WV7GxZGVVPn85cMaSNhsBfnFsHohZWh7oHlj5-tAqL8-w5OQhjN6G6ABRKjRtTNHVMQx4r0hNr5NsjRJfI1aQ__"
          alt=""
        />
      </div>
      <div className="popular-name">Lorem, ipsum.</div>
      <div className="popular-rating">
        <div className="star-container">
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStar className="star-icon" />
          <FaStarHalf className="star-icon" />
        </div>
      </div>
      <div className="popular-expression">
        <p>Ürün hakkında bilgi içerikli metin..............</p>
      </div>
      <div className="itemcard2-bottom">
        <div className="popular-link">
          <p> Sepete Ekle</p>
          <img src={incele} alt="" />
        </div>
        <div className="itemcard2-like">
          <img src={like} alt="" />
        </div>
      </div>
    </div>
  );
};

export default itemCard;
