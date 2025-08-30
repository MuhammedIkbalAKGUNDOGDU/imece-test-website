import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiKey } from "../../config";
import Header from "../../components/GenerealUse/Header";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUnlistedProducts();
  }, []);

  const fetchUnlistedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "get",
        url: "https://imecehub.com/products/modarate/unlistedProducts/",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      });
      console.log("Unlisted Products:", response.data);

      // API'den gelen veriyi kontrol et
      if (response.status === 204) {
        setProducts([]);
        setMessage({
          type: "info",
          text: "Görünürlüğü kapalı ürün bulunamadı.",
        });
      } else {
        setProducts(response.data);
        setMessage({ type: "", text: "" });
      }
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
      setMessage({ type: "error", text: "Ürünler yüklenirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, productId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [productId]: true }));
      setMessage({ type: "", text: "" });

      let url = "";
      let method = "";

      switch (action) {
        case "delete":
          url = "https://imecehub.com/products/modarate/deleteProduct/";
          method = "delete";
          break;
        case "publish":
          url = "https://imecehub.com/products/modarate/publishProduct/";
          method = "post";
          break;
        case "unpublish":
          url = "https://imecehub.com/products/modarate/unPublishProduct/";
          method = "delete";
          break;
        default:
          return;
      }

      const response = await axios({
        method: method,
        url: url,
        data: {
          id: productId, // Backend API'si 'id' parametresi bekliyor
        },
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      });

      console.log(`${action} response:`, response.data);

      // API'den gelen mesajı kullan
      const responseMessage = response.data.message || response.data.error;
      setMessage({
        type: response.data.message ? "success" : "error",
        text: responseMessage,
      });

      // Ürün listesini güncelle
      fetchUnlistedProducts();
    } catch (error) {
      console.error(`${action} hatası:`, error);
      setMessage({
        type: "error",
        text: `İşlem sırasında hata oluştu: ${
          error.response?.data?.message || error.message
        }`,
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const getStatusBadge = (product) => {
    const isVisible = product.urun_gorunurluluk || product.is_visible;
    if (isVisible) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Yayında
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Yayında Değil
        </span>
      );
    }
  };

  const getActionButtons = (product) => {
    const isLoading = actionLoading[product.id || product.urun_id];

    return (
      <div className="flex space-x-2">
        {product.urun_gorunurluluk || product.is_visible ? (
          <button
            onClick={() =>
              handleAction("unpublish", product.id || product.urun_id)
            }
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "İşleniyor..." : "Yayından Kaldır"}
          </button>
        ) : (
          <button
            onClick={() =>
              handleAction("publish", product.id || product.urun_id)
            }
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "İşleniyor..." : "Yayınla"}
          </button>
        )}
        <button
          onClick={() => handleAction("delete", product.id || product.urun_id)}
          disabled={isLoading}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "İşleniyor..." : "Sil"}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-[4%] md:mx-[8%] mb-8">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-[4%] md:mx-[8%] mb-8">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ürün Yönetim Paneli
          </h1>
          <p className="text-gray-600">
            Ürünleri yayınlayın, yayından kaldırın veya silin
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : message.type === "info"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={fetchUnlistedProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Listeyi Yenile
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satıcı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product.id || product.urun_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={
                                product.kapak_gorseli
                                  ? `https://imecehub.com${product.kapak_gorseli}`
                                  : product.resim_url
                                  ? `https://imecehub.com${product.resim_url}`
                                  : "https://via.placeholder.com/64x64?text=Ürün"
                              }
                              alt={product.urun_adi || product.adi || "Ürün"}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.urun_adi ||
                                product.adi ||
                                "İsimsiz Ürün"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id || product.urun_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                        {product.satici || "N/A"}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                        ₺
                        {product.urun_perakende_fiyati ||
                          product.fiyat ||
                          "0.00"}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                        {product.stok_durumu || product.stok || "0"}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        {getStatusBadge(product)}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                        {getActionButtons(product)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <p className="text-lg font-medium">
                          Henüz ürün bulunmuyor
                        </p>
                        <p className="text-sm">Yönetilecek ürün yok</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Yayında</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    products.filter((p) => p.urun_gorunurluluk || p.is_visible)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Yayında Değil
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    products.filter(
                      (p) => !(p.urun_gorunurluluk || p.is_visible)
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
