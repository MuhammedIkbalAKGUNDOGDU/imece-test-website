import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/landingpage.css";
import Banner from "../components/landingPage/Banner";
import goBottom from "../assets/vectors/goBottom.svg";
import AliciAndSaticiOl from "../components/landingPage/AliciAndSaticiOl";
import Footer from "../components/GenerealUse/Footer";
import Saticilar from "../components/landingPage/Saticilar";
import Categries from "../components/landingPage/Categries";
import IndirimliUrunler from "../components/landingPage/IndirimliUrunler";
import GrupAlimTekilAlim from "../components/landingPage/GrupAlimTekilAlim";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import { products } from "../data/products"; // Ürünleri içe aktar

const LandingPage = () => {
  const apiUrl = "https://34.22.218.90/api/users/kullanicilar/me/";
  const accesToken = localStorage.getItem("accessToken");
  const apiKey = "fb10ca29411e8fa4725e11ca519b732de5c911769ff1956e84d4";

  const [items, setItems] = useState([]); // Popüler ürünler için state

  useEffect(() => {
    // API'den kullanıcı bilgisi çekme
    const fetchUserData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            "X-API-Key": apiKey,
            Authorization: `Bearer ${accesToken}`,
            "Content-Type": "application/json",
          },
        });
        localStorage.setItem("userId", response.data.id);
      } catch (error) {
        console.error("Kullanıcı bilgisi alınırken hata oluştu:", error.message);
      }
    };

    fetchUserData();
    setItems(products); // Popüler ürünleri yükle

  }, [apiUrl, accesToken]);

  console.log("User ID:", localStorage.getItem("userId"));

  return (
    <div>
      <div className="landingPage">
        <Header />
        <Banner />

        {/* Aşağı Kaydır Butonu */}
        <div className="flex justify-center">
          <img
            className="clickable pointer landingPageGoBottom"
            src={goBottom}
            alt="Aşağı Kaydır"
          />
        </div>

        {/* Sayfa Bileşenleri */}
        <AliciAndSaticiOl />
        <Saticilar />
        <Categries />
        <GrupAlimTekilAlim />

        {/* Popüler Ürünler */}
        <div className="container mx-auto py-8">
          <h2 className="text-2xl font-bold mb-6 text-left">Popüler Ürünler</h2>
          <ItemGrid items={items} />
        </div>

        <IndirimliUrunler />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
