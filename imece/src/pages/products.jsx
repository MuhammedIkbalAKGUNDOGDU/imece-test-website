import React from "react";
import Header from "../components/GenerealUse/Header";
import "../styles/products.css";
import GrupAlimTekilAlim from "../components/landingPage/GrupAlimTekilAlim";
import Filter from "../components/GenerealUse/filter";
import ItemCard from "../components/GenerealUse/itemCard2";
const products = () => {
  return (
    <div className="products-body">
      <Header />
      <div className="grupalim-products">
        {" "}
        <GrupAlimTekilAlim />
      </div>
      <div className="products-products">
        <Filter />
        <div className="products-products-cards">
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
        </div>
      </div>
    </div>
  );
};

export default products;
