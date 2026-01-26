import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import LoadingSpinner from "../components/GenerealUse/loadingSpinner";
import { apiKey } from "../config";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieManager";

const Favoriler = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = getCookie("accessToken");

  const headers = {
    "X-API-Key": apiKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      if (accessToken) {
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
          
          // 401 Unauthorized hatası kontrolü
          if (err.response?.status === 401) {
            setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
            // Token'ları temizle
            deleteCookie("accessToken");
            deleteCookie("refreshToken");
            deleteCookie("userId");
          } else {
            setError("Favori ürünler alınırken hata oluştu.");
          }
        } finally {
          setIsLoading(false);
        }
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
  if (!accessToken) {
    return (
      <>
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <p className="text-lg font-semibold mb-4">
            Lütfen giriş yapın ya da kaydolun
          </p>
          <div className="flex gap-4">
            <a
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Giriş Yap
            </a>
            <a
              href="/register"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Kaydol
            </a>
          </div>
        </div>
      </>
    );
  }
  const handleGoToLogin = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("userId");
    window.location.href = "/login";
  };

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    // 401 hatası için özel UI
    if (error.includes("Oturum süreniz dolmuş")) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="mx-[4%] md:mx-[8%]">
            <Header />
          </div>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Oturum Süresi Doldu
                </h2>
                <p className="text-red-600 mb-6">{error}</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoToLogin}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

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
