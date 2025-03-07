import React from "react";
import "../../styles/landingPage_styles/populars.css";
import star from "../../assets/vectors/star.svg";
import incele from "../../assets/vectors/homepage_incele.svg";
import Card from "../GenerealUse/itemCard";
const Populars = () => {
  return (
    <div className="pupolars-container">
      <p className="popular-title text-left">Popüler Ürünler</p>
      <div className="populars-list">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Populars;
