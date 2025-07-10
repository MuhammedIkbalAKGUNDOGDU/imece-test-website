import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import LoadingSpinner from "../components/GenerealUse/loadingSpinner";
import { apiKey } from "../config";

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
    const fetchUserAndFavorites = async () => {
      try {
        const userRes = await axios.get(
          "https://imecehub.com/api/users/kullanicilar/me/",
          { headers }
        );
        const id = userRes.data.id;
        setUserId(id);

        const res = await axios.get(
          "https://imecehub.com/api/users/favori-urunler/",
          { headers }
        );

        const urunIdList = res.data.map((item) => item.urun);
        setFavorites(urunIdList);

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

    fetchUserAndFavorites();
  }, []);

  const addFavorite = async (userId, productId) => {
    try {
      await axios.post(
        "https://imecehub.com/api/users/favori-urunler/",
        { alici: userId, urun: productId },
        { headers }
      );
      return true;
    } catch (err) {
      console.error("Favori ekleme hatası:", err.message);
      return false;
    }
  };

  const removeFavorite = async (userId, productId) => {
    try {
      await axios.post(
        "https://imecehub.com/users/delete-favourite/",
        { alici_id: userId, urun_id: productId },
        { headers }
      );
      return true;
    } catch (err) {
      console.error("Favori silme hatası:", err.message);
      return false;
    }
  };

  const handleFavoriteToggle = async (productId) => {
    if (!userId) return;

    const isFav = favorites.includes(productId);
    const success = isFav
      ? await removeFavorite(userId, productId)
      : await addFavorite(userId, productId);

    if (success) {
      const updated = isFav
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];
      setFavorites(updated);

      // Favoriden kaldırıldıysa ürünler listesinden de çıkar
      if (isFav) {
        setProducts((prev) =>
          prev.filter(
            (product) =>
              product.urun_id !== productId && product.id !== productId
          )
        );
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="products-body">
      <Header />
      <div className="w-full max-w-[1400px] mx-auto px-4 md:mb-0 mb-28 mt-20">
        {products.length > 0 ? (
          <ItemGrid
            items={products}
            cardType="card4"
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ) : (
          <p>Favori ürün bulunamadı</p>
        )}
      </div>
    </div>
  );
};

export default Favoriler;
