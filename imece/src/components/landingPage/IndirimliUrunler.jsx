import React from "react";
import "../../styles/landingPage_styles/indirimliurunler.css";
import indirimli from "../../assets/images/indirimli.jfif";
const IndırımliUrunler = () => {
  return (
    <div className="indirimli-container-0">
      <div className="indirimli-container">
        <p>
          <span className="green">İndirimli</span> ürünler
        </p>
        <img src={indirimli} alt="indirimli Urunler" />
      </div>
      <div className="indirimli-container">
        <p>
          <span className="green">Bizim</span> seçtiklerimiz
        </p>
        <img src={indirimli} alt="Tavsiye Ettiklerimiz" />
      </div>
    </div>
  );
};

export default IndırımliUrunler;
