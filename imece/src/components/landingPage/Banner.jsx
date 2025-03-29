import React from "react";
import "../../styles/landingPage_styles/banner.css";
import banner from "../../assets/images/banner.jfif";
const Banner = () => {
  return (
    <div className="container-banner ">
      <img src={banner} alt="" />
      <div className="banner-content">
        <div>
          {" "}
          <p className="banner-header">
            <span className="green">Sağlıklı</span> ürün{" "}
            <span className="green">Sağlıklı</span> yaşam
          </p>
        </div>
        <div>
          {" "}
          <p className="banner-text">
            <span className="green underlined">İmece</span>, satılan ürünlerin
            laboratuvar sonuçlarını takip eder ve sizlerle paylaşır.
          </p>
        </div>
        <div>
          <button className="banner-button clickable">Keşfet</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
