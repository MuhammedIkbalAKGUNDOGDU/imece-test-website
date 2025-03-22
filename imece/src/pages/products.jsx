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
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = "https://imecehub.com/api";
  const headers = {
    "X-API-Key": "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY",
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    try {
      const [productsRes, userRes] = await Promise.all([
        axios.get(`${apiUrl}/products/urunler/`, { headers }),
        axios.get(`${apiUrl}/users/kullanicilar/0`, { headers })
      ]);
      setProducts(productsRes.data);
      setFavorites(userRes.data.favori_urunler || []);
    } catch (err) {
      setError(err.message);
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async (productId) => {
    try {
      const newFavorites = favorites.includes(productId)
        ? favorites.filter(id => id !== productId)
        : [...favorites, productId];

      await axios.patch(
        `${apiUrl}/users/kullanicilar/0`,
        { favori_urunler: newFavorites },
        { headers }
      );
      setFavorites(newFavorites);
    } catch (err) {
      console.error("Favori güncelleme hatası:", err);
      setError("Favoriler güncellenirken bir hata oluştu");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

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
            <ItemGrid 
              items={products} 
              cardType="card4" 
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ) : (
            <p>Ürün bulunamadı</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
