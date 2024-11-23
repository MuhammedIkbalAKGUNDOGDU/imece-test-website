import React from "react";
import "../../styles/landingPage_styles/aliciAndSaticiOl.css";
import alici from "../../assets/images/aliciOl.png";
import satici from "../../assets/images/saticiOl.png";

const AliciAndSaticiOl = () => {
  return (
    <div className="alicisatici-container">
      <div className="alicisatici-inner-container clickable">
        <img src={alici} alt="" />
        <p className="alicisatici-title">
          <span className="green">Alıcı</span> olarak kayıt ol
        </p>
      </div>
      <div className="alicisatici-inner-container clickable">
        <img src={satici} alt="" />
        <p className="alicisatici-title">
          <span className="green">Satıcı</span> olarak kayıt ol
        </p>
      </div>
    </div>
  );
};

export default AliciAndSaticiOl;
