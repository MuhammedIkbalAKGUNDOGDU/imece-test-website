import React from "react";
import Header from "../components/landingPage/Header";
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
  return (
    <div className="landingPage">
      <Header />
      <Banner />
      <div style={{ justifyContent: "center", display: "flex" }}>
        <img className="clickable pointer landingPageGoBottom" src={goBottom} alt="" />
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
