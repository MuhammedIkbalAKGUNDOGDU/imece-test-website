import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/products.css";
import GrupAlimTekilAlim from "../components/landingPage/GrupAlimTekilAlim";
import Filter from "../components/GenerealUse/filter";
import MobileFilter from "../components/GenerealUse/mobileFilter";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import { products as mockProducts } from "../data/products"; // Mock veriyi import et

const Products = () => {
  const [products, setProducts] = useState([]);
  const apiUrl = "https://imecehub.com/api/products/urunler/";
  const apiKey =
    "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";

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
        // Hata durumunda mock veriyi kullanabilirsiniz
        setProducts(mockProducts);
      });
  }, []);

  return (
    <div className="products-body">
      <Header />
      <div className="grupalim-products">
        <GrupAlimTekilAlim />
      </div>
      <MobileFilter />
      <div className="products-products">
        <Filter />
        <div className="w-full max-w-[1400px] mx-auto px-4 md:mb-0 mb-28">
          {products.length > 0 ? (
            <ItemGrid items={products} cardType="card4" />
          ) : (
            <p>Ürün bulunamadı</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
