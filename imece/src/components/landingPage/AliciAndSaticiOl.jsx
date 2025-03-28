import React from "react";
import "../../styles/landingPage_styles/aliciAndSaticiOl.css";
import alici from "../../assets/images/aliciOl.png";
import satici from "../../assets/images/saticiOl.png";
import { useNavigate } from "react-router-dom";

const AliciAndSaticiOl = () => {
  const navigate = useNavigate();

  return (
    <div className="alicisatici-container">
      <div
        onClick={() => navigate("/register")}
        className="alicisatici-inner-container clickable"
      >
        <img src={alici} alt="" />
        <p className="alicisatici-title">
          <span className="green">Alıcı</span> olarak kayıt ol
        </p>
      </div>
      <div
        onClick={() => navigate("/register-seller")}
        className="alicisatici-inner-container clickable"
      >
        <img src={satici} alt="" />
        <p className="alicisatici-title">
          <span className="green">Satıcı</span> olarak kayıt ol
        </p>
      </div>
    </div>
  );
};

export default AliciAndSaticiOl;
