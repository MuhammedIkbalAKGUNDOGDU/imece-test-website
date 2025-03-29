import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/products.css";
import Filter from "../components/GenerealUse/filter";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import { products as mockProducts } from "../data/products";
import LoadingSpinner from "../components/GenerealUse/loadingSpinner";

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
      setFilteredProducts(productsRes.data);

      const fullUserRes = await axios.get(
        `https://imecehub.com/api/users/kullanicilar/${id}/`,
        { headers }
      );
      setFavorites(fullUserRes.data.favori_urunler || []);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setError("Veriler alınırken bir hata oluştu.");
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndData();
  }, []);

  console.log(products);
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
          (product) => product.fiyat >= minPrice && product.fiyat <= maxPrice
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
