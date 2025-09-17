import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Package, Calendar, MapPin, User, CreditCard } from "lucide-react";
import { apiKey } from "../../config";

const OrderDetailModal = ({ isOpen, onClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    if (!orderId || !accessToken) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        "https://imecehub.com/api/logistics/siparis/get-order-by-id/",
        {
          siparis_id: orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      setOrderDetails(response.data);
    } catch (err) {
      setError("Sipariş detayları alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const getOrderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "beklemede":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            Beklemede
          </span>
        );
      case "hazirlaniyor":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Hazırlanıyor
          </span>
        );
      case "kargoda":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            Kargoda
          </span>
        );
      case "teslim_edildi":
      case "teslim edildi":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Teslim Edildi
          </span>
        );
      case "iptal":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            İptal
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {status || "Bilinmiyor"}
          </span>
        );
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProductClick = async (product) => {
    try {
      // Ürün ID'sini al - farklı veri yapılarını kontrol et
      let productId = product.urun_id || product.id;

      // Eğer urun_bilgileri objesi varsa, ondan ID'yi al
      if (!productId && product.urun_bilgileri) {
        productId = product.urun_bilgileri.urun_id;
      }

      if (!productId) {
        return;
      }

      // Loading durumunu başlat
      setLoadingProductId(productId);

      // API'den tam ürün bilgilerini al
      const response = await axios.get(
        `https://imecehub.com/api/products/urunler/${productId}/`,
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // Modal'ı kapat
      onClose();

      // Order page'e tam ürün bilgileri ile yönlendir
      navigate("/order-page", { state: { product: response.data } });
    } catch (error) {
      // Hata durumunda mevcut ürün verisi ile yönlendir
      onClose();
      navigate("/order-page", { state: { product: product } });
    } finally {
      // Loading durumunu temizle
      setLoadingProductId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Sipariş Detayları
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-700">
                Sipariş detayları yükleniyor...
              </p>
              <p className="mt-2 text-sm text-gray-500">Lütfen bekleyin</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchOrderDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tekrar Dene
              </button>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Sipariş Özeti */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Sipariş #{orderDetails.siparis_id || orderId}
                      </h3>
                      <p className="text-gray-600">
                        {orderDetails.siparis_verilme_tarihi &&
                          new Date(
                            orderDetails.siparis_verilme_tarihi
                          ).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                  {getOrderStatusBadge(orderDetails.durum)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {orderDetails.toplam_fiyat}₺
                    </p>
                    <p className="text-sm text-gray-500">Toplam Tutar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">
                      {orderDetails.urunler?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500">Ürün Sayısı</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">
                      {orderDetails.durum || "Bilinmiyor"}
                    </p>
                    <p className="text-sm text-gray-500">Durum</p>
                  </div>
                </div>
              </div>

              {/* Alıcı Bilgileri */}
              {(orderDetails.alici_ad_soyad ||
                orderDetails.alici_email ||
                orderDetails.alici_telefon ||
                orderDetails.alici_adres ||
                orderDetails.alici_tc ||
                orderDetails.alici_vergi_no ||
                orderDetails.alici ||
                orderDetails.musteri ||
                orderDetails.kullanici) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Alıcı Bilgileri
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {orderDetails.alici_ad_soyad &&
                      orderDetails.alici_ad_soyad.trim() && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Ad Soyad</p>
                          <p className="text-gray-700 font-medium">
                            {orderDetails.alici_ad_soyad}
                          </p>
                        </div>
                      )}
                    {orderDetails.alici_email && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">E-posta</p>
                        <p className="text-gray-700">
                          {orderDetails.alici_email}
                        </p>
                      </div>
                    )}
                    {orderDetails.alici_telefon && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Telefon</p>
                        <p className="text-gray-700">
                          {orderDetails.alici_telefon}
                        </p>
                      </div>
                    )}
                    {orderDetails.alici_adres && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Adres</p>
                        <p className="text-gray-700">
                          {orderDetails.alici_adres}
                        </p>
                      </div>
                    )}
                    {orderDetails.alici_tc && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          TC Kimlik No
                        </p>
                        <p className="text-gray-700">{orderDetails.alici_tc}</p>
                      </div>
                    )}
                    {orderDetails.alici_vergi_no && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Vergi No</p>
                        <p className="text-gray-700">
                          {orderDetails.alici_vergi_no}
                        </p>
                      </div>
                    )}
                    {orderDetails.alici &&
                      typeof orderDetails.alici === "object" && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Alıcı Detayları
                          </p>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                              {JSON.stringify(orderDetails.alici, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    {orderDetails.musteri &&
                      typeof orderDetails.musteri === "object" && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Müşteri Detayları
                          </p>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                              {JSON.stringify(orderDetails.musteri, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    {orderDetails.kullanici &&
                      typeof orderDetails.kullanici === "object" && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Kullanıcı Detayları
                          </p>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                              {JSON.stringify(orderDetails.kullanici, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Fatura Adresi */}
              {orderDetails.fatura_adresi_string && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Fatura Adresi
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {orderDetails.fatura_adresi_string}
                  </p>
                </div>
              )}

              {/* Ürünler */}
              {orderDetails.urunler && orderDetails.urunler.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Ürünler
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {orderDetails.urunler.map((urun, index) => {
                      // Ürün ID'sini al - farklı veri yapılarını kontrol et
                      let productId = urun.urun_id || urun.id;
                      if (!productId && urun.urun_bilgileri) {
                        productId = urun.urun_bilgileri.urun_id;
                      }

                      const isLoading = loadingProductId === productId;

                      return (
                        <div
                          key={index}
                          onClick={() => !isLoading && handleProductClick(urun)}
                          className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                            isLoading
                              ? "bg-blue-50 cursor-wait"
                              : "bg-gray-50 cursor-pointer hover:bg-gray-100 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            {/* Ürün Fotoğrafı */}
                            {(urun.kapak_gorseli ||
                              urun.urun_bilgileri?.kapak_gorseli) && (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={
                                    urun.kapak_gorseli ||
                                    urun.urun_bilgileri?.kapak_gorseli
                                  }
                                  alt={
                                    urun.urun_adi ||
                                    urun.urun_bilgileri?.urun_adi ||
                                    "Ürün"
                                  }
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {urun.urun_adi ||
                                  urun.name ||
                                  urun.urun_bilgileri?.urun_adi ||
                                  `Ürün ${index + 1}`}
                              </h4>
                              {(urun.aciklama ||
                                urun.urun_bilgileri?.aciklama) && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {urun.aciklama ||
                                    urun.urun_bilgileri?.aciklama}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {urun.miktar && (
                                  <span>Miktar: {urun.miktar}</span>
                                )}
                                {urun.birim && <span>Birim: {urun.birim}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {urun.fiyat && (
                              <p className="text-lg font-bold text-gray-800">
                                {urun.fiyat}₺
                              </p>
                            )}
                            {urun.toplam_fiyat &&
                              urun.toplam_fiyat !== urun.fiyat && (
                                <p className="text-sm text-gray-500">
                                  Toplam: {urun.toplam_fiyat}₺
                                </p>
                              )}
                            <div className="mt-2">
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-blue-600 text-sm font-medium">
                                    Yükleniyor...
                                  </span>
                                </div>
                              ) : (
                                <span className="text-blue-600 text-sm font-medium hover:underline">
                                  İncele →
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ek Bilgiler */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Ek Bilgiler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Sipariş ID</p>
                    <p className="font-medium text-gray-800">
                      {orderDetails.siparis_id || orderId}
                    </p>
                  </div>
                  {orderDetails.siparis_verilme_tarihi && (
                    <div>
                      <p className="text-gray-500">Sipariş Tarihi</p>
                      <p className="font-medium text-gray-800">
                        {new Date(
                          orderDetails.siparis_verilme_tarihi
                        ).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  )}
                  {orderDetails.teslim_tarihi && (
                    <div>
                      <p className="text-gray-500">Teslim Tarihi</p>
                      <p className="font-medium text-gray-800">
                        {new Date(
                          orderDetails.teslim_tarihi
                        ).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  )}
                  {orderDetails.kargo_takip_no && (
                    <div>
                      <p className="text-gray-500">Kargo Takip No</p>
                      <p className="font-medium text-gray-800">
                        {orderDetails.kargo_takip_no}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Sipariş detayları bulunamadı</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
