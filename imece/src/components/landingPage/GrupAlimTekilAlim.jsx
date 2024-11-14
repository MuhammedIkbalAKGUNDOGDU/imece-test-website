import React from "react";
import grup from "../../assets/images/grupalim.jpg";
import tekil from "../../assets/images/tekilalim.jpg";
import "../../styles/landingPage_styles/grupTekil.css";
const GrupAlimTekilAlim = () => {
  return (
    <div className="grup-tekil-container">
      <div className="grup-tekil-button-container">
        <img
          className="grup-tekil-button clickable pointer"
          src={grup}
          alt=""
        />

        <p className="grup-metin">Grup alım için <span className="green">tıkla</span></p>
      </div>

      <div className="grup-tekil-button-container">
        <img
          className="grup-tekil-button clickable pointer"
          src={tekil}
          alt=""
        />
        <p className="grup-metin">
          Tekil alım için <span className="green">tıkla</span>
        </p>
      </div>
    </div>
  );
};

export default GrupAlimTekilAlim;
