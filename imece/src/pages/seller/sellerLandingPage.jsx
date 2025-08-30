import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/GenerealUse/Header";
import { apiKey } from "../../config";

const SellerLandingPage = () => {
  const navigate = useNavigate();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalSales: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          navigate("/satici-login");
          return;
        }

        // Önce kullanıcı bilgisini al (landing page'deki gibi)
        const userApiUrl = "https://imecehub.com/api/users/kullanicilar/me/";
        const headers = {
          "X-API-Key": apiKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const userResponse = await axios.get(userApiUrl, { headers });
        const userId = userResponse.data.id;
        console.log("Kullanıcı ID:", userId);
        console.log("Kullanıcı bilgileri:", userResponse.data);

        localStorage.setItem("userId", userId);

        // Satıcı bilgilerini al
        const sellerResponse = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-info-full/",
          data: {
            kullanici_id: userId,
          },
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        });

        console.log("Satıcı bilgileri:", sellerResponse.data);

        // Satıcının ürünlerini al
        const productsResponse = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-products/",
          data: {
            kullanici_id: userId,
          },
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        });

        console.log("Satıcı ürünleri:", productsResponse.data);

        setSellerInfo(sellerResponse.data);
        setSellerProducts(productsResponse.data);

        // İstatistikleri hesapla
        const activeProducts = productsResponse.data.filter(
          (product) => product.urun_gorunurluluk === true
        ).length;
        setStats({
          totalProducts: productsResponse.data.length,
          activeProducts: activeProducts,
          totalSales: 0, // API'den gelecek
          monthlyRevenue: 0, // API'den gelecek
        });

        setLoading(false);
      } catch (error) {
        console.error("Satıcı bilgileri alınamadı:", error);
        console.error("Hata detayı:", error.response?.data);
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    navigate("/satici-login");
  };

  const handleAddProduct = () => {
    navigate("/Urun-Ekle-1");
  };

  const handleViewProfileFromHero = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/profile/satici-profili/${userId}`); // ProfilUreticiPage route'u
  };

  const handleViewProducts = () => {
    navigate("/products");
  };

  const handleViewOrders = () => {
    navigate("/seller/orders");
  };

  const handleViewFinancialDashboard = () => {
    navigate("/seller/financial-dashboard");
  };

  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileSettings = () => {
    setShowProfileModal(true);
  };

  const handleViewProfile = () => {
    setShowProfileModal(false);
    const userId = localStorage.getItem("userId");
    navigate(`/profile/satici-profili/${userId}`);
  };

  const handleEditProfile = () => {
    setShowProfileModal(false);
    // İleride profil düzenleme sayfasına yönlendirilecek
    console.log("Profil düzenleme sayfasına yönlendirilecek");
  };

  const closeModal = () => {
    setShowProfileModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Hoş geldin, {sellerInfo?.ad || "Satıcı"}!
            </h1>
            <p className="text-xl text-green-100 mb-8">
              İmece'de satış yapmaya devam et ve kazancını artır
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleAddProduct}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Yeni Ürün Ekle
              </button>
              <button
                onClick={handleViewProfileFromHero}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200"
              >
                Profilimi Görüntüle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={
                  sellerInfo?.profil_fotograf ||
                  "https://via.placeholder.com/80x80?text=Profil"
                }
                alt="Profil Fotoğrafı"
                className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
              />
              {sellerInfo?.imece_onay && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {sellerInfo?.magaza_adi || "Mağaza Adı"}
                </h2>
                {sellerInfo?.imece_onay && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    İmece Onaylı
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Meslek:</span>{" "}
                {sellerInfo?.profession || "Belirtilmemiş"}
              </p>
              {sellerInfo?.profil_tanitim_yazisi && (
                <p className="text-gray-700 italic">
                  "{sellerInfo.profil_tanitim_yazisi}"
                </p>
              )}
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {sellerInfo?.degerlendirme_puani || 0} / 5
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  •{" "}
                  {sellerInfo?.imece_onay_last_date
                    ? `Onay: ${new Date(
                        sellerInfo.imece_onay_last_date
                      ).toLocaleDateString("tr-TR")}`
                    : "Onay tarihi belirtilmemiş"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Ürün</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.activeProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Toplam Satış
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalSales}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₺{stats.monthlyRevenue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={handleAddProduct}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Yeni Ürün Ekle
                </h3>
                <p className="text-gray-600">
                  Mağazanıza yeni ürünler ekleyin ve satışlarınızı artırın
                </p>
              </div>
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={handleViewProducts}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ürünlerimi Görüntüle
                </h3>
                <p className="text-gray-600">
                  Mevcut ürünlerinizi yönetin ve güncelleyin
                </p>
              </div>
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
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={handleViewOrders}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Siparişlerim
                </h3>
                <p className="text-gray-600">
                  Siparişlerinizi takip edin ve kargo işlemlerini yönetin
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={handleViewFinancialDashboard}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Finansal Dashboard
                </h3>
                <p className="text-gray-600">
                  Satış raporlarınızı ve finansal durumunuzu takip edin
                </p>
              </div>
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={handleProfileSettings}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Profil Ayarları
                </h3>
                <p className="text-gray-600">
                  Profil bilgilerinizi düzenleyin ve güncelleyin
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Son Eklenen Ürünler
            </h2>
            <button
              onClick={handleViewProducts}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Tümünü Gör →
            </button>
          </div>

          {sellerProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerProducts.slice(0, 6).map((product, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={
                        product.kapak_gorseli ||
                        product.resim_url ||
                        "https://via.placeholder.com/300x200?text=Ürün+Resmi"
                      }
                      alt={product.urun_adi}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.urun_adi}
                  </h3>
                  <p className="text-green-600 font-bold mb-2">
                    ₺{product.urun_perakende_fiyati}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.urun_gorunurluluk
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.urun_gorunurluluk ? "Aktif" : "Pasif"}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stok: {product.stok_durumu}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Kategori: {product.kategori}</span>
                    <span>Puan: {product.degerlendirme_puani}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz ürün eklenmemiş
              </h3>
              <p className="text-gray-600 mb-4">
                İlk ürününüzü ekleyerek satışa başlayın!
              </p>
              <button
                onClick={handleAddProduct}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                İlk Ürünü Ekle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Profil Ayarları
              </h3>
              <div className="space-y-4">
                <button
                  onClick={handleViewProfile}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Profili Gör
                </button>
                <button
                  onClick={handleEditProfile}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Profili Düzenle
                </button>
                <button
                  onClick={closeModal}
                  className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 mx-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerLandingPage;
