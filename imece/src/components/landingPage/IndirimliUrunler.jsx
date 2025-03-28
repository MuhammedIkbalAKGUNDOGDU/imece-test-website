import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landingPage_styles/indirimliurunler.css";
import indirimli from "../../assets/images/indirimli.jfif";

const IndirimliUrunler = () => {
  const navigate = useNavigate();

  return (
    <div className="indirimli-container-0">
      <div
        className="indirimli-container clickable pointer"
        onClick={() => navigate("/products")}
      >
        <p>
          <span className="green">İndirimli</span> ürünler
        </p>
        <img src={indirimli} alt="İndirimli Ürünler" />
      </div>
      <div
        className="indirimli-container clickable pointer"
        onClick={() => navigate("/products")}
      >
        <p>
          <span className="green">Bizim</span> seçtiklerimiz
        </p>
        <img src={indirimli} alt="Tavsiye Ettiklerimiz" />
      </div>
    </div>
  );
};

export default IndirimliUrunler;
