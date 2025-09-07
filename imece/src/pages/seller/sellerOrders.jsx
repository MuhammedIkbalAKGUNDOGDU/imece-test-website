import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/GenerealUse/Header";
import { apiKey } from "../../config";

const SellerOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // API Base URL
  const API_BASE_URL = "https://imecehub.com/api";

  // Satıcı ID'sini localStorage'dan al
  const getSellerId = () => {
    const userId = localStorage.getItem("userId");
    return userId ? parseInt(userId) : null;
  };

  // API headers'ını hazırla
  const getHeaders = () => {
    const accessToken = localStorage.getItem("accessToken");
    return {
      "X-API-Key": apiKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  };

  // Satıcının tüm siparişlerini getir
  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const sellerId = getSellerId();
      if (!sellerId) {
        setError("Satıcı ID bulunamadı. Lütfen giriş yapın.");
        setLoading(false);
        return;
      }

      // Tüm siparişleri detaylı olarak al
      const response = await axios.post(
        `${API_BASE_URL}/logistics/siparis-lojistik/satici-siparisler/`,
        {
          satici_id: sellerId,
        },
        {
          headers: getHeaders(),
        }
      );

      console.log("Tüm siparişler (detaylı):", response.data);

      // API'den gelen veriyi doğrudan kullan, orderId ekle
      const ordersWithOrderId = (response.data || []).map((order) => ({
        ...order,
        orderId: order.siparis_id, // UI için orderId ekle
      }));

      setOrders(ordersWithOrderId);
    } catch (error) {
      console.error("Siparişler getirilirken hata:", error);
      setError("Siparişler yüklenirken bir hata oluştu.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Belirli bir siparişin detaylarını göster (zaten yüklenmiş)
  const fetchOrderDetails = (orderId) => {
    // Mevcut orders listesinden siparişi bul
    const existingOrder = orders.find(
      (order) => order.orderId === orderId || order.siparis_id === orderId
    );

    if (existingOrder) {
      // Detaylar zaten yüklenmiş, direkt göster
      console.log("Sipariş detayları:", existingOrder);
      setOrderDetails(existingOrder);
      setShowOrderDetails(true);
    } else {
      console.error("Sipariş bulunamadı:", orderId);
      setError("Sipariş detayları bulunamadı.");
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    // API'den gelen durum değerini kontrol et
    const orderStatus =
      order.items && order.items.length > 0
        ? order.items[0].durum
        : order.status;

    switch (activeTab) {
      case "pending":
        return orderStatus === "BEKLEMEDE" || orderStatus === "pending";
      case "shipped":
        return orderStatus === "KARGOLANDI" || orderStatus === "shipped";
      case "delivered":
        return orderStatus === "TESLİM EDİLDİ" || orderStatus === "delivered";
      case "cancelled":
        return orderStatus === "İPTAL EDİLDİ" || orderStatus === "cancelled";
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "BEKLEMEDE":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
      case "KARGOLANDI":
        return "bg-blue-100 text-blue-800";
      case "delivered":
      case "TESLİM EDİLDİ":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "İPTAL EDİLDİ":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
      case "BEKLEMEDE":
        return "Kargo Bekliyor";
      case "shipped":
      case "KARGOLANDI":
        return "Kargolandı";
      case "delivered":
      case "TESLİM EDİLDİ":
        return "Teslim Edildi";
      case "cancelled":
      case "İPTAL EDİLDİ":
        return "İptal Edildi";
      default:
        return status || "Bilinmiyor";
    }
  };

  const handleCreateShipment = (orderId) => {
    // Kargo oluşturma işlemi burada yapılacak
    console.log("Kargo oluşturuluyor:", orderId);
    alert(`${orderId} numaralı sipariş için kargo oluşturuluyor...`);
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrder(orderId);
    fetchOrderDetails(orderId);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setOrderDetails(null);
    setSelectedOrder(null);
  };

  const handleBackToLanding = () => {
    navigate("/seller/landing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hata Oluştu
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSellerOrders}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Tekrar Dene
          </button>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Siparişlerim</h1>
            <p className="text-gray-600 mt-2">
              Siparişlerinizi takip edin ve kargo işlemlerini yönetin
            </p>
          </div>
          <button
            onClick={handleBackToLanding}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            ← Ana Sayfaya Dön
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-1 mb-8">
          <div className="flex space-x-1">
            {[
              {
                id: "pending",
                label: "Kargo Bekleyen",
                count: orders.filter((o) => {
                  const status =
                    o.items && o.items.length > 0 ? o.items[0].durum : o.status;
                  return status === "BEKLEMEDE" || status === "pending";
                }).length,
              },
              {
                id: "shipped",
                label: "Kargolanan",
                count: orders.filter((o) => {
                  const status =
                    o.items && o.items.length > 0 ? o.items[0].durum : o.status;
                  return status === "KARGOLANDI" || status === "shipped";
                }).length,
              },
              {
                id: "delivered",
                label: "Teslim Edilen",
                count: orders.filter((o) => {
                  const status =
                    o.items && o.items.length > 0 ? o.items[0].durum : o.status;
                  return status === "TESLİM EDİLDİ" || status === "delivered";
                }).length,
              },
              {
                id: "cancelled",
                label: "İptal Edilen",
                count: orders.filter((o) => {
                  const status =
                    o.items && o.items.length > 0 ? o.items[0].durum : o.status;
                  return status === "İPTAL EDİLDİ" || status === "cancelled";
                }).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-white text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === "pending" && "Kargo bekleyen sipariş bulunmuyor"}
                {activeTab === "shipped" && "Kargolanan sipariş bulunmuyor"}
                {activeTab === "delivered" &&
                  "Teslim edilen sipariş bulunmuyor"}
                {activeTab === "cancelled" && "İptal edilen sipariş bulunmuyor"}
              </h3>
              <p className="text-gray-600">
                Bu kategoride henüz sipariş bulunmuyor.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-md p-6"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sipariş #{order.orderId || order.siparis_id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.items && order.items.length > 0
                          ? order.items[0].durum
                          : order.status
                      )}`}
                    >
                      {getStatusText(
                        order.items && order.items.length > 0
                          ? order.items[0].durum
                          : order.status
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {order.siparis_verilme_tarihi ||
                        (order.items && order.items.length > 0
                          ? order.items[0].tahmini_teslimat_tarihi
                          : order.orderDate)}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ₺
                      {order.items && order.items.length > 0
                        ? order.items[0].fiyat
                        : order.amount
                        ? order.amount.toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Müşteri Bilgileri
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Ad:</strong>{" "}
                        {order.musteri_bilgisi?.musteri_adi || "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>E-posta:</strong>{" "}
                        {order.musteri_bilgisi?.e_posta || "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Telefon:</strong>{" "}
                        {order.musteri_bilgisi?.telefon || "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Adres:</strong>{" "}
                        {order.teslimat_adresi_bilgisi?.adres_satiri_1 ||
                          "Bilinmiyor"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Kargo Bilgileri
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Lojistik Seçeneği:</strong>{" "}
                        {order.items && order.items.length > 0
                          ? order.items[0].lojistik_secenegi
                            ? "Evet"
                            : "Hayır"
                          : "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Ağırlık:</strong>{" "}
                        {order.items && order.items.length > 0
                          ? order.items[0].siparis_agirlik || "Belirtilmemiş"
                          : order.packageWeight || "Bilinmiyor"}{" "}
                        kg
                      </p>
                      <p>
                        <strong>Tahmini Teslimat:</strong>{" "}
                        {order.items && order.items.length > 0
                          ? order.items[0].tahmini_teslimat_tarihi
                          : "Bilinmiyor"}
                      </p>
                      {order.shippingNotes && (
                        <p>
                          <strong>Notlar:</strong> {order.shippingNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Ürünler</h4>
                  <div className="space-y-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.urun_adi || item.name || "Ürün Adı"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Sipariş Item ID:{" "}
                              {item.siparis_item_id || item.sku || "N/A"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ₺{item.fiyat || item.price || "0.00"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Adet: {item.miktar || item.quantity || "0"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">
                        Ürün bilgileri bulunamadı.
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Ödeme Durumu:</strong>{" "}
                      {order.payment_method === "paid" ? "Ödendi" : "Bekliyor"}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    {(() => {
                      const orderStatus =
                        order.items && order.items.length > 0
                          ? order.items[0].durum
                          : order.status;
                      return (orderStatus === "BEKLEMEDE" ||
                        orderStatus === "pending") &&
                        !order.createShipment ? (
                        <button
                          onClick={() =>
                            handleCreateShipment(
                              order.orderId || order.siparis_id
                            )
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          Kargo Oluştur
                        </button>
                      ) : order.createShipment ? (
                        <span className="text-green-600 text-sm font-medium">
                          ✓ Kargo oluşturuldu
                        </span>
                      ) : null;
                    })()}
                    <button
                      onClick={() =>
                        handleViewDetails(order.orderId || order.siparis_id)
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Detayları Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sipariş Detayları Modal */}
      {showOrderDetails && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sipariş Detayları #{selectedOrder}
                </h2>
                <button
                  onClick={handleCloseOrderDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Sipariş Detayları İçeriği */}
              <div className="space-y-6">
                {/* Genel Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Sipariş Bilgileri
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Sipariş ID:</strong>{" "}
                        {orderDetails.siparis_id ||
                          orderDetails.orderId ||
                          selectedOrder}
                      </p>
                      <p>
                        <strong>Durum:</strong>{" "}
                        {orderDetails.items && orderDetails.items.length > 0
                          ? orderDetails.items[0].durum
                          : orderDetails.status || "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Tarih:</strong>{" "}
                        {orderDetails.siparis_verilme_tarihi ||
                          orderDetails.created_at ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Toplam:</strong> ₺
                        {orderDetails.items && orderDetails.items.length > 0
                          ? orderDetails.items[0].fiyat
                          : orderDetails.total_amount || "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Müşteri Bilgileri
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Ad:</strong>{" "}
                        {orderDetails.musteri_bilgisi?.musteri_adi ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>E-posta:</strong>{" "}
                        {orderDetails.musteri_bilgisi?.e_posta || "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Telefon:</strong>{" "}
                        {orderDetails.musteri_bilgisi?.telefon || "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Adres Başlığı:</strong>{" "}
                        {orderDetails.teslimat_adresi_bilgisi?.adres_baslik ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Adres Satırı 1:</strong>{" "}
                        {orderDetails.teslimat_adresi_bilgisi?.adres_satiri_1 ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Adres Satırı 2:</strong>{" "}
                        {orderDetails.teslimat_adresi_bilgisi?.adres_satiri_2 ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>İl/İlçe:</strong>{" "}
                        {orderDetails.teslimat_adresi_bilgisi?.il &&
                        orderDetails.teslimat_adresi_bilgisi?.ilce
                          ? `${orderDetails.teslimat_adresi_bilgisi.il}/${orderDetails.teslimat_adresi_bilgisi.ilce}`
                          : "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Mahalle:</strong>{" "}
                        {orderDetails.teslimat_adresi_bilgisi?.mahalle ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Posta Kodu:</strong>{" "}
                        {orderDetails.teslimat_adresi_bilgisi?.posta_kodu ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Ülke:</strong>{" "}
                        {orderDetails.teslimat_adresi_bilgisi?.ulke ||
                          "Bilinmiyor"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ürünler */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Ürünler</h3>
                  {orderDetails.items && orderDetails.items.length > 0 ? (
                    <div className="space-y-3">
                      {orderDetails.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.urun_adi || item.product_name || "Ürün Adı"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Sipariş Item ID:{" "}
                              {item.siparis_item_id || item.sku || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Durum: {item.durum || "Bilinmiyor"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Ağırlık: {item.siparis_agirlik || "Belirtilmemiş"}{" "}
                              kg
                            </p>
                            <p className="text-sm text-gray-600">
                              Lojistik:{" "}
                              {item.lojistik_secenegi ? "Evet" : "Hayır"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ₺{item.fiyat || item.price || "0.00"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Adet: {item.miktar || item.quantity || "0"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Teslimat:{" "}
                              {item.tahmini_teslimat_tarihi || "Belirtilmemiş"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Ürün bilgileri bulunamadı.</p>
                  )}
                </div>

                {/* Kargo Bilgileri */}
                {orderDetails.shipping_info && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Kargo Bilgileri
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Kargo Firması:</strong>{" "}
                        {orderDetails.shipping_info.company || "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Takip Numarası:</strong>{" "}
                        {orderDetails.shipping_info.tracking_number ||
                          "Bilinmiyor"}
                      </p>
                      <p>
                        <strong>Durum:</strong>{" "}
                        {orderDetails.shipping_info.status || "Bilinmiyor"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseOrderDetails}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Kapat
                </button>
                {(() => {
                  const orderStatus =
                    orderDetails.items && orderDetails.items.length > 0
                      ? orderDetails.items[0].durum
                      : orderDetails.status;
                  return orderStatus === "BEKLEMEDE" ||
                    orderStatus === "pending" ? (
                    <button
                      onClick={() => handleCreateShipment(selectedOrder)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Kargo Oluştur
                    </button>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
