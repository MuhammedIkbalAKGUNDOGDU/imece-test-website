import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../../styles/landingPage_styles/header.css";
import logo from "../../assets/vectors/vite.svg";
import searchIcon from "../../assets/vectors/search.svg";

import { PiShoppingCartLight } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { CiShop } from "react-icons/ci";
import { CiMenuBurger } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";

const Header = () => {
  const navigate = useNavigate(); // Yönlendirme için
  const location = useLocation(); // Şu anki rotayı almak için

  return (
    <div className="container-header">
      <img
        onClick={() => navigate("/")}
        className="header-logo pointer clickable"
        src={logo}
        alt=""
      />
      <div className="searchbox">
        <img src={searchIcon} alt="" />
        <input type="text" placeholder="Arat.." />
      </div>
      <div
        className={`header-buttons header-homepage clickable pointer ${
          location.pathname === "/" ? "active" : ""
        }`}
        onClick={() => navigate("/")}
      >
        <div className="header-home-svg icon">
          <IoHomeOutline className="icon-svg" />
        </div>
        <p className="pointer">Anasayfa</p>
      </div>
      <div
        className={`header-buttons clickable pointer ${
          location.pathname === "/products" ? "active" : ""
        }`}
        onClick={() => navigate("/products")}
      >
        <div className="header-products-svg icon">
          <CiShop className="icon-svg" />
        </div>
        <p className="pointer">Ürünler</p>
      </div>
      <div
        className={`header-buttons clickable pointer ${
          location.pathname === "/favoriler" ? "active" : ""
        }`}
        onClick={() => navigate("/favoriler")}
      >
        <div className="header-products-svg icon">
          <CiHeart className="icon-svg" />
        </div>
        <p className="pointer">Favorilerim</p>
      </div>
      <div
        className={`header-buttons clickable pointer ${
          location.pathname === "/basket" ? "active" : ""
        }`}
        onClick={() => navigate("/basket")}
      >
        <div className="header-basket-svg icon">
          <PiShoppingCartLight className="icon-svg" />
        </div>
        <p className="pointer">Sepetim</p>
      </div>
      <div
        className={`header-buttons clickable pointer ${
          location.pathname === "/profile" ? "active" : ""
        }`}
        onClick={() => navigate("/profile")}
      >
        <div className="header-profile-svg icon">
          <CiUser className="icon-svg" />
        </div>
        <p className="pointer">Hesabım</p>
      </div>
      
    </div>
  );
};

export default Header;
