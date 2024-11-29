import React from "react";
import { useNavigate } from "react-router-dom"; // react-router-dom'dan useNavigate'i import et

import "../../styles/landingPage_styles/header.css";
import logo from "../../assets//vectors/vite.svg";
import searchIcon from "../../assets/vectors/search.svg";
import basket from "../../assets/vectors/sepet.svg";
import profile from "../../assets/vectors/profil.svg";
import menu from "../../assets/vectors/menu.svg";
import urunler from "../../assets/vectors/urunler.svg";
import homepage from "../../assets/vectors/homePage.svg";

const Header = () => {
  const navigate = useNavigate(); // Yönlendirme için useNavigate hook'u

  return (
    <div className="container-header">
      <img
        onClick={() => navigate("/")} // Anasayfa'ya yönlendirme
        className="header-logo pointer clickable pointer"
        src={logo}
        alt=""
      />
      <div className="searchbox">
        <img src={searchIcon} alt="" />
        <input type="text" placeholder="Arat.." />
      </div>
      <div
        className="header-buttons header-homepage clickable pointer"
        onClick={() => navigate("/")} // Anasayfa'ya yönlendirme
      >
        {" "}
        <img className="pointer" src={homepage} alt="" />
        <p className="pointer">Anasayfa</p>
      </div>
      <div
        className="header-buttons clickable pointer"
        onClick={() => navigate("/products")} // urunlere'ya yönlendirme
      >
        {" "}
        <img className="pointer" src={urunler} alt="" />
        <p className="pointer">Ürünler</p>
      </div>
      <div
        className="header-buttons clickable pointer"
        onClick={() => navigate("/basket")} // sepete'ya yönlendirme
      >
        {" "}
        <img className="pointer" src={basket} alt="" />
        <p className="pointer">Sepetin</p>
      </div>
      <div
        className="header-buttons clickable pointer "
        onClick={() => navigate("/profile")} // sepete'ya yönlendirme
      >
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
