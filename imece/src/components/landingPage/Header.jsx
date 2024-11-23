import React from "react";
import "../../styles/landingPage_styles/header.css";
import logo from "../../assets//vectors/vite.svg";
import searchIcon from "../../assets/vectors/search.svg";
import basket from "../../assets/vectors/sepet.svg";
import profile from "../../assets/vectors/profil.svg";
import menu from "../../assets/vectors/menu.svg";
import urunler from "../../assets/vectors/urunler.svg";
import homepage from "../../assets/vectors/homePage.svg";

const Header = () => {
  return (
    <div className="container-header">
      <img className="header-logo pointer clickable pointer" src={logo} alt="" />
      <div className="searchbox">
        <img src={searchIcon} alt="" />
        <input type="text" placeholder="Arat.." />
      </div>
      <div className="header-buttons header-homepage clickable pointer">
        {" "}
        <img className="pointer" src={homepage} alt="" />
        <p className="pointer">Anasayfa</p>
      </div>
      <div className="header-buttons clickable pointer">
        {" "}
        <img className="pointer" src={urunler} alt="" />
        <p className="pointer">Ürünler</p>
      </div>
      <div className="header-buttons clickable pointer">
        {" "}
        <img className="pointer" src={basket} alt="" />
        <p className="pointer">Sepetin</p>
      </div>
      <div className="header-buttons clickable pointer ">
        {" "}
        <img className="pointer" src={profile} alt="" />
        <p className="pointer">Profilin</p>
      </div>
      <div className="header-buttons header-more clickable pointer ">
        {" "}
        <img className="pointer " src={menu} alt="" />
        <p className="pointer">Daha Fazlası</p>
      </div>
    </div>
  );
};

export default Header;
