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

  const fetchFavorites = async () => {
    try {
      const userRes = await axios.get(
        "https://imecehub.com/api/users/kullanicilar/me/",
        { headers }
      );
      const id = userRes.data.id;
      setUserId(id);

      const fullUserRes = await axios.get(
        `https://imecehub.com/api/users/kullanicilar/${id}/`,
        { headers }
      );
      const userFavorites = fullUserRes.data.favori_urunler || [];
      setFavorites(userFavorites);

      const productsRes = await axios.get(
        "https://imecehub.com/api/products/urunler/",
        { headers }
      );
      const allProducts = productsRes.data;

      const favoriteProducts = allProducts.filter((product) =>
        userFavorites.includes(product.urun_id)
      );
      setProducts(favoriteProducts);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setError("Veriler alınırken bir hata oluştu.");
      setProducts(
        mockProducts.filter((product) => favorites.includes(product.id))
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
