import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/products.css";
import Filter from "../components/GenerealUse/filter";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import { products as mockProducts } from "../data/products";
import LoadingSpinner from "../components/GenerealUse/loadingSpinner";
import { apiKey } from "../config";  // veya "../constants" dosya ismine göre

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    price: "",
    rating: null,
  });

  
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "X-API-Key": apiKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const userRes = await axios.get(
          "https://imecehub.com/api/users/kullanicilar/me/",
          { headers }
        );
        const id = userRes.data.id;
        setUserId(id);

        const [productsRes, favs] = await Promise.all([
          axios.get("https://imecehub.com/api/products/urunler/", {
            headers: {
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }),
          fetchFavorites(),
        ]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setFavorites(favs);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setError("Veriler alınırken bir hata oluştu.");
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndData();
  }, []);
  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        "https://imecehub.com/api/users/favori-urunler/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      const favs = res.data.map((item) => item.urun); // yalnızca ürün ID'lerini al

      return favs;
    } catch (error) {
      console.error("Favori ürünler alınamadı:", error);
      return [];
    }
  };

  const addFavorite = async (userId, productId, headers) => {
    try {
      await axios.post(
        "https://imecehub.com/api/users/favori-urunler/",
        {
          alici: userId,
          urun: productId,
        },
        { headers }
      );
      return true;
    } catch (error) {
      console.error(
        "Favori ekleme hatası:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const removeFavorite = async (userId, productId, headers) => {
    try {
      await axios.delete("https://imecehub.com/api/users/favori-urunler/", {
        data: {
          alici: userId,
          urun: productId,
        },
        headers,
      });
      return true;
    } catch (error) {
      console.error(
        "Favori silme hatası:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const handleFavoriteToggle = async (productId) => {
    if (!userId) return;

    const isCurrentlyFavorite = favorites.includes(productId);
    const success = isCurrentlyFavorite
      ? await removeFavorite(userId, productId, headers)
      : await addFavorite(userId, productId, headers);

    if (success) {
      const updatedFavorites = isCurrentlyFavorite
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];

      setFavorites(updatedFavorites);
    } else {
      setError("Favori işlemi sırasında bir hata oluştu.");
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];

      if (filters.categories.length > 0) {
        filtered = filtered.filter((product) =>
          filters.categories.includes(product.kategori)
        );
      }

      if (filters.price) {
        const [minPrice, maxPrice] = filters.price
          .split(" - ")
          .map((p) => parseInt(p.replace(" TL", ""), 10));
        filtered = filtered.filter(
          (product) => product.urun_perakende_fiyati >= minPrice && product.urun_perakende_fiyati <= maxPrice
        );
      }

      if (filters.rating !== null) {
        filtered = filtered.filter(
          (product) => product.degerlendirme_puani >= filters.rating
        );
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [filters, products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="products-body">
      <Header />
      <div className="products-products">
        <Filter onFilterChange={handleFilterChange} />
        <div className="w-full max-w-[1400px] mx-auto px-4 md:mb-0 mb-28">
          {filteredProducts.length > 0 ? (
            <ItemGrid
              items={filteredProducts}
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
