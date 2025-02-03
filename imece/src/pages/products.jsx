import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/products.css";
import GrupAlimTekilAlim from "../components/landingPage/GrupAlimTekilAlim";
import Filter from "../components/GenerealUse/filter";
import ItemCard from "../components/GenerealUse/itemCard2";
import MobileFilter from "../components/GenerealUse/mobileFilter";

const Products = () => {
  const [products, setProducts] = useState([]);
  const apiUrl = "https://34.22.218.90/api/products/urunler/";
  const apiKey = "fb10ca29411e8fa4725e11ca519b732de5c911769ff1956e84d4";

  useEffect(() => {
    axios
      .get(apiUrl, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setProducts(response.data); // API'den gelen veriyi state'e at
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, []);

  console.log("selam",products);
  return (
    <div className="products-body">
      <Header />
      <div className="grupalim-products">
        <GrupAlimTekilAlim />
      </div>
      <MobileFilter />
      <div className="products-products">
        <Filter />
        <div className="products-products-cards">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ItemCard key={index} data={product} />
            ))
          ) : (
            <p>Ürün bulunamadı</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
