import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/landingpage.css";
import Banner from "../components/landingPage/Banner";
import goBottom from "../assets/vectors/goBottom.svg";
import AliciAndSaticiOl from "../components/landingPage/AliciAndSaticiOl";
import Footer from "../components/GenerealUse/Footer";
import Saticilar from "../components/landingPage/Saticilar";
import Populars from "../components/landingPage/Populars";
import Categries from "../components/landingPage/Categries";
import IndirimliUrunler from "../components/landingPage/IndirimliUrunler";
import GrupAlimTekilAlim from "../components/landingPage/GrupAlimTekilAlim";

const landingPage = () => {
  const apiUrl = "https://34.22.218.90/api/users/kullanicilar/me/";
  const accesToken = localStorage.getItem("accessToken");
  const apiKey = "fb10ca29411e8fa4725e11ca519b732de5c911769ff1956e84d4";

  // State tanımlamaları

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            "X-API-Key": apiKey,
            Authorization: `Bearer ${accesToken}`,
            "Content-Type": "application/json",
          },
        });
        localStorage.setItem("userId", response.data.id); // Veriyi al ve state'e ata
      } catch (error) {
        console.log(error.message);
      } finally {
      }
    };

    fetchCategories();
  }, [apiUrl, accesToken]); // API URL ve token değiştiğinde yeniden çalışsın

  console.log(localStorage.getItem("userId"));

  return (
    <div className="landingPage">
      <Header />
      <Banner />
      <div style={{ justifyContent: "center", display: "flex" }}>
        <img
          className="clickable pointer landingPageGoBottom"
          src={goBottom}
          alt=""
        />
      </div>
      <AliciAndSaticiOl />
      <Saticilar />
      <Categries />
      <GrupAlimTekilAlim />
      <Populars />
      <IndirimliUrunler />
      <Footer />
    </div>
  );
};

export default landingPage;
