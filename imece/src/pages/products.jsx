import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/GenerealUse/Header";
import "../styles/products.css";
import Filter from "../components/GenerealUse/filter";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import { products as mockProducts } from "../data/products";
import LoadingSpinner from "../components/GenerealUse/loadingSpinner";
import { apiKey } from "../config"; // veya "../constants" dosya ismine göre
import { getCookie, setCookie, deleteCookie } from "../utils/cookieManager";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    price: "",
    rating: null,
  });

  const accessToken = getCookie("accessToken");

  const headers = {
    "X-API-Key": apiKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const handleSessionExpired = () => {
    // Local storage'ı temizle
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("user");

    // State'leri temizle
    setProducts([]);
    setFilteredProducts([]);
    setFavorites([]);
    setUserId(null);
    setError(null);

    // Modal'ı göster
    setShowSessionExpiredModal(true);
  };

  const handleModalConfirm = () => {
    setShowSessionExpiredModal(false);
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        if (accessToken) {
          try {
            const userRes = await axios.get(
              "https://imecehub.com/api/users/kullanicilar/me/",
              { headers }
            );
            const id = userRes.data.id;
            setUserId(id);
          } catch (userError) {
            // Me endpoint'inde hata varsa oturum sona ermiş demektir
            console.error("Kullanıcı bilgileri alınamadı:", userError);
            handleSessionExpired();
            return;
          }
        }

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
    if (accessToken) {
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
      await axios.post(
        "https://imecehub.com/users/delete-favourite/",
        {
          alici_id: userId,
          urun_id: productId,
        },
        { headers }
      );
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
          (product) =>
            product.urun_perakende_fiyati >= minPrice &&
            product.urun_perakende_fiyati <= maxPrice
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

      {/* Oturum Sonu Modal */}
      {showSessionExpiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Oturum Sona Erdi
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Lütfen tekrar giriş yapın. Hesabınızın oturumu sonlanmıştır.
              </p>
              <button
                onClick={handleModalConfirm}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Giriş Sayfasına Git
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
