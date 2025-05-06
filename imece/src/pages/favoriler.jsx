import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import LoadingSpinner from "../components/GenerealUse/loadingSpinner";
import { apiKey } from "../config"; // veya "../constants" dosya ismine göre

const Favoriler = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "X-API-Key": apiKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // 1. Favori verilerini çek
        const res = await axios.get(
          "https://imecehub.com/api/users/favori-urunler/",
          { headers }
        );

        const urunIdList = res.data.map((item) => item.urun); // her item.urun bir ID

        setFavorites(urunIdList);

        // 2. Her urun_id için ayrı istek at
        const productRequests = urunIdList.map((urunId) =>
          axios.get(`https://imecehub.com/api/products/urunler/${urunId}/`, {
            headers,
          })
        );

        const responses = await Promise.all(productRequests);
        const productList = responses.map((res) => res.data);

        setProducts(productList);
      } catch (err) {
        console.error("Favori ürünler alınamadı:", err);
        setError("Favori ürünler alınırken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);


  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="products-body">
      <Header />
      <div className="w-full max-w-[1400px] mx-auto px-4 md:mb-0 mb-28 mt-20">
        {products.length > 0 ? (
          <ItemGrid items={products} cardType="card4" favorites={favorites} />
        ) : (
        <p>Favori ürün bulunamadı</p>
        )} 
      </div>
    </div>
  );
};

export default Favoriler;
