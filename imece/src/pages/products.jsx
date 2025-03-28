import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/products.css";
import GrupAlimTekilAlim from "../components/landingPage/GrupAlimTekilAlim";
import Filter from "../components/GenerealUse/filter";
import MobileFilter from "../components/GenerealUse/mobileFilter";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import { products as mockProducts } from "../data/products";
import LoadingSpinner from "../components/GenerealUse/loadingSpinner"; // Yükleme animasyonu bileşeni

const Products = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey =
    "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "X-API-Key": apiKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const fetchUserAndData = async () => {
    try {
      const userRes = await axios.get(
        "https://imecehub.com/api/users/kullanicilar/me/",
        { headers }
      );
      const id = userRes.data.id;
      setUserId(id);

      const productsRes = await axios.get(
        "https://imecehub.com/api/products/urunler/",
        { headers }
      );
      setProducts(productsRes.data);

      const fullUserRes = await axios.get(
        `https://imecehub.com/api/users/kullanicilar/${id}/`,
        { headers }
      );
      setFavorites(fullUserRes.data.favori_urunler || []);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setError("Veriler alınırken bir hata oluştu.");
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async (productId) => {
    if (!userId) return;

    const isCurrentlyFavorite = favorites.includes(productId);

    try {
      const requestBody = isCurrentlyFavorite
        ? { remove_favori_urunler: [productId] }
        : { favori_urunler: [...favorites, productId] };

      await axios.patch(
        `https://imecehub.com/api/users/kullanicilar/${userId}/`,
        requestBody,
        { headers }
      );

      const updatedFavorites = isCurrentlyFavorite
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];

      setFavorites(updatedFavorites);
    } catch (err) {
      console.error(
        "Favori güncelleme hatası:",
        err.response?.data || err.message || err
      );
      setError("Favoriler güncellenirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchUserAndData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

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
