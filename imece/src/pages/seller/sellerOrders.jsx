import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/GenerealUse/Header";
import { apiKey } from "../../config";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookieManager";

const SellerOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({
    weight: "",      // KG
    length: "",      // CM
    width: "",       // CM
    height: "",      // CM
    shippingNotes: "",
    serviceType: "dropToOffice",  // "dropToOffice" veya "pickupFromAddress"
    pickupLocationCode: "",       // Seçilen depo kodu
    senderAddressId: null,        // Seçilen deponun ID'si
    hsCode: "",                   // HS Kodu
  });
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [pickupLocationsLoading, setPickupLocationsLoading] = useState(false);
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);
  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    pickup_code: "",
    address: "",
    city: "",
    district: "",
    phone: "",
    is_default: false,
  });
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  
  // Kargo Seçimi State'leri
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [deliveryOptionsLoading, setDeliveryOptionsLoading] = useState(false);
  const [selectedDeliveryOptionId, setSelectedDeliveryOptionId] = useState(null);
  const [isDeliverySelectionStep, setIsDeliverySelectionStep] = useState(false);

  // API Base URL
  const API_BASE_URL = "https://imecehub.com/api";

  // Satıcı ID'sini localStorage'dan al
  const getSellerId = () => {
    const userId = getCookie("userId");
    return userId ? parseInt(userId) : null;
  };

  // API headers'ını hazırla
  const getHeaders = () => {
    const accessToken = getCookie("accessToken");
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

      // Tarihe göre sırala (en yeni en üstte)
      const sortedOrders = ordersWithOrderId.sort((a, b) => {
        const dateA = new Date(a.siparis_verilme_tarihi || a.created_at || 0);
        const dateB = new Date(b.siparis_verilme_tarihi || b.created_at || 0);
        return dateB - dateA;
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Siparişler getirilirken hata:", error);
      setError("Siparişler yüklenirken bir hata oluştu.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Satıcının pickup location'larını getir
  const fetchPickupLocations = async () => {
    try {
      setPickupLocationsLoading(true);
      
      const response = await axios.get(
        `${API_BASE_URL}/logistics/pickup-locations/`,
        {
          headers: getHeaders(),
        }
      );

      console.log("Pickup Locations:", response.data);
      setPickupLocations(response.data || []);
      
      // Varsayılan depoyu/adresi otomatik seç
      const defaultLocation = (response.data || []).find(loc => loc.is_default) || (response.data || [])[0];
      
      if (defaultLocation) {
        setShipmentForm(prev => ({
          ...prev,
          // Her zaman varsayılan gönderici adresi olarak seç
          senderAddressId: defaultLocation.id,
          // Eğer adresten alım seçiliyse, varsayılan olarak bu depoyu seç
          ...(prev.serviceType === "pickupFromAddress" ? { pickupLocationCode: defaultLocation.pickup_code } : {})
        }));
      }
    } catch (error) {
      console.error("Pickup locations getirilirken hata:", error);
      setPickupLocations([]);
    } finally {
      setPickupLocationsLoading(false);
    }
  };

  // Belirli bir siparişin detaylarını getir (Lojistik verileri dahil)
  const fetchOrderDetails = async (orderId) => {
    try {
      const sellerId = getSellerId();
      if (!sellerId) return;

      const response = await axios.post(
        `${API_BASE_URL}/logistics/siparis-lojistik/get-siparis/`,
        {
          order_id: orderId,
          satici_id: sellerId,
        },
        {
          headers: getHeaders(),
        }
      );

      console.log("Sipariş detayı (lojistik):", response.data);
      setOrderDetails(response.data);
      setShowOrderDetails(true);
    } catch (error) {
      console.error("Sipariş detayları getirilirken hata:", error);
      
      // Fallback: Listeden bul
      const existingOrder = orders.find(
        (o) => o.orderId === orderId || o.siparis_id === orderId
      );
      if (existingOrder) {
        setOrderDetails(existingOrder);
        setShowOrderDetails(true);
      }
    }
  };

  useEffect(() => {
    fetchSellerOrders();
    fetchPickupLocations();
  }, []);

  const orderTabs = [
    { id: "pending", label: "Barkod Bekleyen", statuses: ["BEKLEMEDE", "HATA", "KARGO_HATASI", "pending"] },
    { id: "waiting_pickup", label: "Kargolanmayı Bekleyen", statuses: ["KARGOLANMAYI_BEKLIYOR", "KARGOYA_TESLIMI_BEKLIYOR"] },
    { id: "shipped", label: "Kargolanan", statuses: ["KARGOLANDI", "shipped"] },
    { id: "delivered", label: "Tamamlanan", statuses: ["TAMAMLANDI", "TESLİM EDİLDİ", "delivered"] },
    { id: "cancelled", label: "İptal / İade", statuses: ["IPTAL", "İPTAL EDİLDİ", "GERI_ODENDI", "cancelled"] },
  ];

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.items && order.items.length > 0 ? order.items[0].durum : order.status;
    const currentTab = orderTabs.find(t => t.id === activeTab);
    return currentTab ? currentTab.statuses.includes(orderStatus) : true;
  });

  const getTabCount = (statuses) => {
    return orders.filter(o => {
      const status = o.items && o.items.length > 0 ? o.items[0].durum : o.status;
      return statuses.includes(status);
    }).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BEKLEMEDE":
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "KARGOLANMAYI_BEKLIYOR":
      case "KARGOYA_TESLIMI_BEKLIYOR":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "KARGOLANDI":
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "TAMAMLANDI":
      case "delivered":
      case "TESLİM EDİLDİ":
        return "bg-green-100 text-green-800";
      case "IPTAL":
      case "İPTAL EDİLDİ":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "HATA":
      case "KARGO_HATASI":
        return "bg-red-50 text-red-700 border border-red-100";
      case "GERI_ODENDI":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "BEKLEMEDE":
      case "pending":
        return "Beklemede";
      case "KARGOYA_TESLIMI_BEKLIYOR":
        return "Kargoya Teslimi Bekliyor";
      case "KARGOLANMAYI_BEKLIYOR":
        return "Kargolanmayı Bekliyor";
      case "KARGOLANDI":
      case "shipped":
        return "Kargolandı";
      case "TAMAMLANDI":
      case "delivered":
      case "TESLİM EDİLDİ":
        return "Tamamlandı";
      case "IPTAL":
      case "İPTAL EDİLDİ":
      case "cancelled":
        return "İptal";
      case "HATA":
        return "Hata";
      case "GERI_ODENDI":
        return "Geri Ödendi";
      case "KARGO_HATASI":
        return "Kargo Hatası";
      default:
        return status || "Bilinmiyor";
    }
  };

  const handleCreateShipment = (orderId) => {
    setSelectedOrder(orderId);
    setShowShipmentForm(true);
    // Depoları yükle
    fetchPickupLocations();
  };

  // 1. Validasyon
  const validateShipmentForm = () => {
    if (!shipmentForm.weight || parseFloat(shipmentForm.weight) <= 0) return "Ağırlık bilgisi gereklidir ve 0'dan büyük olmalıdır.";
    if (!shipmentForm.length || parseFloat(shipmentForm.length) <= 0) return "Uzunluk bilgisi gereklidir ve 0'dan büyük olmalıdır.";
    if (!shipmentForm.width || parseFloat(shipmentForm.width) <= 0) return "Genişlik bilgisi gereklidir ve 0'dan büyük olmalıdır.";
    if (!shipmentForm.height || parseFloat(shipmentForm.height) <= 0) return "Yükseklik bilgisi gereklidir ve 0'dan büyük olmalıdır.";
    if (!shipmentForm.hsCode) return "HS Kodu (GTİP) gereklidir.";
    
    if (!getSellerId()) return "Satıcı ID bulunamadı. Lütfen giriş yapın.";
    if (!shipmentForm.senderAddressId) return "Lütfen bir gönderici adresi seçin.";
    
    if (shipmentForm.serviceType === "pickupFromAddress" && !shipmentForm.pickupLocationCode) {
      return "Lütfen teslim alınacak depoyu seçin.";
    }
    return null;
  };

  // 2. Kargo seçeneklerini getir
  const fetchDeliveryOptions = async () => {
    const errorMsg = validateShipmentForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      setDeliveryOptionsLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${API_BASE_URL}/logistics/siparis-lojistik/get-delivery-options/`,
        {
          order_id: selectedOrder,
          satici_id: getSellerId(),
          weight: parseFloat(shipmentForm.weight),
          length: parseFloat(shipmentForm.length),
          width: parseFloat(shipmentForm.width),
          height: parseFloat(shipmentForm.height),
          senderAddressId: shipmentForm.senderAddressId,
        },
        { headers: getHeaders() }
      );
      
      console.log("Kargo Seçenekleri Response:", response.data);
      const options = response.data.options || response.data.data || (Array.isArray(response.data) ? response.data : []);
      setDeliveryOptions(options);
      
      if (options.length > 0) {
        setIsDeliverySelectionStep(true);
      } else {
        setError("Uygun kargo seçeneği bulunamadı.");
      }

    } catch (error) {
       console.error("Kargo seçenekleri hatası:", error);
       setError("Kargo firmaları yüklenirken hata oluştu: " + (error.response?.data?.message || error.message));
    } finally {
       setDeliveryOptionsLoading(false);
    }
  };

  // 3. Kargoyu oluştur (Final)
  const createSellerShipment = async () => {
    try {
      setShipmentLoading(true);
      setError(null);

      const sellerId = getSellerId();
      
      const payload = {
          order_id: selectedOrder,
          satici_id: sellerId,
          satici_onayladi: true,
          shippingNotes: shipmentForm.shippingNotes,
          weight: parseFloat(shipmentForm.weight),
          length: parseFloat(shipmentForm.length),
          width: parseFloat(shipmentForm.width),
          height: parseFloat(shipmentForm.height),
          serviceType: shipmentForm.serviceType,
          senderAddressId: shipmentForm.senderAddressId,
          hsCode: shipmentForm.hsCode,
          ...(shipmentForm.serviceType === "pickupFromAddress" && {
            pickupLocationCode: shipmentForm.pickupLocationCode,
          }),
          ...(selectedDeliveryOptionId && {
             selectedDeliveryOptionId: selectedDeliveryOptionId
          })
       };

      const response = await axios.post(
        `${API_BASE_URL}/logistics/siparis-lojistik/create-seller-shipment/`,
        payload,
        { headers: getHeaders() }
      );

      console.log("Kargo oluşturma yanıtı:", response.data);
      
      alert(selectedDeliveryOptionId 
        ? "Kargo etiketi başarıyla oluşturuldu! Etiketi sipariş detaylarından yazdırabilirsiniz." 
        : `${selectedOrder} numaralı sipariş için kargo başarıyla oluşturuldu!`);
      
      handleCloseShipmentForm(); 
      fetchSellerOrders(); 

    } catch (error) {
      console.error("Kargo oluşturma hatası:", error);
      setError("Kargo oluşturulurken hata: " + (error.response?.data?.message || error.message));
    } finally {
      setShipmentLoading(false);
    }
  };

  const handleShipmentFormSubmit = async () => {
    if (!isDeliverySelectionStep) {
      await fetchDeliveryOptions();
    } else {
      await createSellerShipment();
    }
  };

  const handleAddWarehouseSubmit = async (e) => {
    e.preventDefault();
    try {
      setWarehouseLoading(true);
      setError(null);

      // Otomatik pickup code oluştur eğer boşsa
      const formData = { ...warehouseForm };
      if (!formData.pickup_code) {
        formData.pickup_code = `WH-${Date.now()}`;
      }

      await axios.post(
        `${API_BASE_URL}/logistics/pickup-locations/`,
        formData,
        {
          headers: getHeaders(),
        }
      );

      // Başarılı
      alert("Depo başarıyla eklendi!");
      setShowAddWarehouseModal(false);
      setWarehouseForm({
        name: "",
        pickup_code: "",
        address: "",
        city: "",
        district: "",
        phone: "",
        is_default: false,
      });

      // Listeyi yenile
      fetchPickupLocations();
      
    } catch (error) {
      console.error("Depo ekleme hatası:", error);
      alert("Depo eklenirken bir hata oluştu: " + (error.response?.data?.message || error.message));
    } finally {
      setWarehouseLoading(false);
    }
  };

  const handleCloseShipmentForm = () => {
    setShowShipmentForm(false);
    setShipmentForm({
      weight: "",
      length: "",
      width: "",
      height: "",
      shippingNotes: "",
      serviceType: "dropToOffice",
      pickupLocationCode: "",
      senderAddressId: null,
      hsCode: "",
    });
    setError(null);
    setIsDeliverySelectionStep(false);
    setDeliveryOptions([]);
    setSelectedDeliveryOptionId(null);
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

        {/* Status Dropdown */}
        <div className="mb-8 flex justify-start">
          <div className="relative inline-block text-left w-full sm:w-72">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-xl bg-white shadow-sm border font-medium text-gray-700 appearance-none cursor-pointer"
            >
              {orderTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label} ({getTabCount(tab.statuses)})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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
                      const item0 = order.items?.[0] || {};
                      const orderStatus = item0.durum || order.status;
                      
                      const hasShipment = ["KARGOLANMAYI_BEKLIYOR", "KARGOYA_TESLIMI_BEKLIYOR", "KARGOLANDI", "shipped"].includes(orderStatus) || order.createShipment || item0.tracking_number || item0.label_url;

                      if (hasShipment) {
                        return (
                          <div className="flex flex-col items-end space-y-1 text-right">
                            {orderStatus === "KARGOYA_TESLIMI_BEKLIYOR" && (
                              <span className="text-[9px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-200 mb-1 leading-tight max-w-[120px]">
                                📍 Barkodu yazdır ve şubeye teslim et
                              </span>
                            )}
                            {item0.label_url || order.label_url ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(item0.label_url || order.label_url, "_blank");
                                }}
                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium flex items-center space-x-1"
                              >
                                <span>🖨️ Barkod Yazdır</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 animate-pulse">
                                ⏳ Hazırlanıyor...
                              </span>
                            )}
                            {(item0.tracking_number || order.tracking_number) && (
                              <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 max-w-[120px] truncate">
                                {item0.tracking_number || order.tracking_number}
                              </span>
                            )}
                          </div>
                        );
                      }

                      return ["BEKLEMEDE", "pending", "HATA", "KARGO_HATASI"].includes(orderStatus) ? (
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

                {/* Kargo Bilgileri (Yeni Yapı) */}
                {orderDetails.items?.[0] && ["KARGOLANMAYI_BEKLIYOR", "KARGOYA_TESLIMI_BEKLIYOR", "KARGOLANDI", "shipped"].includes(orderDetails.items[0].durum) && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                      <span className="mr-2">📦</span> Kargo Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600 font-medium">Kargo Firması</p>
                        <p className="font-bold text-gray-900">{orderDetails.items[0].carrier_name || "Belirleniyor..."}</p>
                      </div>
                      <div>
                        <p className="text-blue-600 font-medium">Takip Numarası</p>
                        <p className="font-bold text-gray-900">{orderDetails.items[0].tracking_number || "Hazırlanıyor..."}</p>
                      </div>
                      <div>
                        <p className="text-blue-600 font-medium">Statü</p>
                        <p className="font-bold text-gray-900">{getStatusText(orderDetails.items[0].durum)}</p>
                      </div>
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
                  const item0 = orderDetails.items?.[0] || {};
                  const orderStatus = item0.durum || orderDetails.status;
                  
                  const hasShipment = ["KARGOLANMAYI_BEKLIYOR", "KARGOYA_TESLIMI_BEKLIYOR", "KARGOLANDI", "shipped"].includes(orderStatus) || orderDetails.createShipment || item0.tracking_number || item0.label_url;

                  if (hasShipment) {
                    return (
                      <div className="flex items-center space-x-3">
                         {orderStatus === "KARGOYA_TESLIMI_BEKLIYOR" && (
                           <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold animate-pulse shadow-lg bg-opacity-90">
                             � Barkodu yazdır ve şubeye teslim et
                           </div>
                         )}
                         {(item0.label_url || orderDetails.label_url) ? (
                           <button
                             onClick={() => window.open(item0.label_url || orderDetails.label_url, "_blank")}
                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-bold shadow-md shadow-blue-100"
                           >
                             <span>🖨️ Barkodu Yazdır</span>
                           </button>
                         ) : (
                           <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 text-sm font-medium animate-pulse">
                             ⏳ Barkod hazırlanıyor...
                           </div>
                         )}
                      </div>
                    );
                  }

                  return ["BEKLEMEDE", "pending", "HATA", "KARGO_HATASI"].includes(orderStatus) ? (
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

      {/* Kargo Oluşturma Formu Modal */}
      {showShipmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Kargo Oluştur - Sipariş #{selectedOrder}
                </h2>
                <button
                  onClick={handleCloseShipmentForm}
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

              <div className="space-y-6">
                {!isDeliverySelectionStep ? (
                  <>
                {/* Gönderici Adresi Seçimi - Her zaman görünür */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gönderici Adresi / Depo <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Fatura ve irsaliye üzerinde görünecek gönderici adresi.
                  </p>
                  {pickupLocationsLoading ? (
                    <div className="text-sm text-gray-500">Adresler yükleniyor...</div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={shipmentForm.senderAddressId || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value ? parseInt(e.target.value) : null;
                          setShipmentForm({
                            ...shipmentForm,
                            senderAddressId: selectedId
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="">Adres Seçiniz</option>
                        {pickupLocations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} ({loc.city}/{loc.district})
                          </option>
                        ))}
                      </select>
                      <button
                         type="button"
                         onClick={() => setShowAddWarehouseModal(true)}
                         className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
                         title="Yeni Adres Ekle"
                       >
                         +
                       </button>
                    </div>
                  )}
                  {pickupLocations.length === 0 && !pickupLocationsLoading && (
                     <div className="mt-2 text-sm text-red-500">
                       Kayıtlı adresiniz bulunmuyor. Lütfen yeni bir adres ekleyin.
                     </div>
                  )}
                </div>

                {/* Aynı Şehir Uyarısı */}
                {(() => {
                  const selectedSenderAddress = pickupLocations.find(loc => loc.id === shipmentForm.senderAddressId);
                  const senderCity = selectedSenderAddress?.city;
                  const receiverCity = orderDetails?.teslimat_adresi_bilgisi?.il;
                  const isSameCity = senderCity && receiverCity && 
                                     senderCity.toLowerCase().trim() === receiverCity.toLowerCase().trim();
                  
                  return isSameCity ? (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="text-amber-600 text-xl mt-0.5">⚠️</div>
                        <div>
                          <h4 className="font-semibold text-amber-900 mb-1">Aynı Şehir İçi Teslimat</h4>
                          <p className="text-sm text-amber-800">
                            Gönderici ve alıcı adresi aynı şehirde ({senderCity}). 
                            Aynı şehir içi teslimat için lütfen bizimle iletişime geçin.
                          </p>
                          <p className="text-xs text-amber-700 mt-2">
                            📞 Müşteri hizmetleri ile görüşerek özel teslimat seçeneklerini değerlendirebilirsiniz.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Teslimat Tipi Seçimi */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teslimat Tipi
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="dropToOffice"
                        checked={shipmentForm.serviceType === "dropToOffice"}
                        onChange={(e) =>
                          setShipmentForm({
                            ...shipmentForm,
                            serviceType: e.target.value,
                            pickupLocationCode: "", // Şubeye teslimde depo kodu temizle
                          })
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        🏢 Şubeye Teslim Edin
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="pickupFromAddress"
                        checked={shipmentForm.serviceType === "pickupFromAddress"}
                        onChange={(e) => {
                          setShipmentForm({
                            ...shipmentForm,
                            serviceType: e.target.value,
                          });
                          // Varsayılan depoyu seçmeyi dene
                          if (pickupLocations.length > 0) {
                            const defaultLoc = pickupLocations.find(
                              (loc) => loc.is_default
                            );
                            if (defaultLoc) {
                              setShipmentForm((prev) => ({
                                ...prev,
                                serviceType: e.target.value,
                                pickupLocationCode: defaultLoc.pickup_code,
                              }));
                            }
                          }
                        }}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        🚚 Depodan Teslim Alınsın
                      </span>
                    </label>
                  </div>

                  {/* Depo Seçimi - Sadece "Adresten Alım" seçiliyse göster */}
                  {shipmentForm.serviceType === "pickupFromAddress" && (
                    <div className="mt-4 animate-fadeIn">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teslim Alınacak Depo <span className="text-red-500">*</span>
                      </label>
                      {pickupLocationsLoading ? (
                        <div className="text-sm text-gray-500">
                          Depolar yükleniyor...
                        </div>
                      ) : pickupLocations.length > 0 ? (
                        <select
                          value={shipmentForm.pickupLocationCode}
                          onChange={(e) =>
                            setShipmentForm({
                              ...shipmentForm,
                              pickupLocationCode: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        >
                          <option value="">Depo Seçiniz</option>
                          {pickupLocations.map((loc) => (
                            <option key={loc.id} value={loc.pickup_code}>
                              {loc.name} ({loc.city}/{loc.district})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <div className="text-sm text-red-500">
                            Kayıtlı depo bulunamadı. Lütfen profil ayarlarından depo
                            ekleyin.
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAddWarehouseModal(true)}
                            className="text-sm text-green-600 hover:text-green-800 font-medium underline text-left"
                          >
                            + Yeni Depo Ekle
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Ağırlık */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ağırlık (KG) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={shipmentForm.weight}
                    onChange={(e) =>
                      setShipmentForm({
                        ...shipmentForm,
                        weight: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Örn: 2.5"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paketin toplam ağırlığını kilogram cinsinden girin
                  </p>
                </div>

                {/* Boyutlar - Grid Layout */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Uzunluk */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uzunluk (CM) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={shipmentForm.length}
                      onChange={(e) =>
                        setShipmentForm({
                          ...shipmentForm,
                          length: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="40"
                      required
                    />
                  </div>

                  {/* Genişlik */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genişlik (CM) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={shipmentForm.width}
                      onChange={(e) =>
                        setShipmentForm({
                          ...shipmentForm,
                          width: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="30"
                      required
                    />
                  </div>

                  {/* Yükseklik */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yükseklik (CM) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={shipmentForm.height}
                      onChange={(e) =>
                        setShipmentForm({
                          ...shipmentForm,
                          height: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="20"
                      required
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 -mt-2">
                  📦 Paket boyutlarını santimetre cinsinden girin
                </p>

                {/* HS Kodu */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HS Kodu (GTİP) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shipmentForm.hsCode}
                    onChange={(e) =>
                      setShipmentForm({
                        ...shipmentForm,
                        hsCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Örn: 6109.10"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gümrük işlemleri için gerekli olan ürün kategorizasyon kodu
                  </p>
                </div>

                {/* Kargo Notları */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kargo Notları
                  </label>
                  <textarea
                    value={shipmentForm.shippingNotes}
                    onChange={(e) =>
                      setShipmentForm({
                        ...shipmentForm,
                        shippingNotes: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Kargo için özel notlarınızı yazın (opsiyonel)"
                  />
                </div>

                {/* Özet Bilgiler */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Kargo Özeti
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Sipariş ID:</strong> {selectedOrder}
                    </p>
                    <p>
                      <strong>Teslimat Tipi:</strong>{" "}
                      {shipmentForm.serviceType === "dropToOffice"
                        ? "Şubeye Teslim"
                        : "Depodan Alım"}
                    </p>
                    {shipmentForm.serviceType === "pickupFromAddress" &&
                      shipmentForm.pickupLocationCode && (
                        <p>
                          <strong>Depo:</strong>{" "}
                          {
                            pickupLocations.find(
                              (l) => l.pickup_code === shipmentForm.pickupLocationCode
                            )?.name
                          }
                        </p>
                      )}
                    <p>
                      <strong>Ağırlık:</strong> {shipmentForm.weight} KG
                    </p>
                    <p>
                      <strong>Uzunluk:</strong> {shipmentForm.length} CM
                    </p>
                    <p>
                      <strong>Genişlik:</strong> {shipmentForm.width} CM
                    </p>
                    <p>
                      <strong>Yükseklik:</strong> {shipmentForm.height} CM
                    </p>
                    {shipmentForm.shippingNotes && (
                      <p>
                        <strong>Notlar:</strong> {shipmentForm.shippingNotes}
                      </p>
                    )}
                  </div>
                </div>
                  </>
                ) : (
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Kargo Firması Seçin</h3>
                     
                     {deliveryOptionsLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                           <p>Fiyatlar hesaplanıyor...</p>
                        </div>
                     ) : deliveryOptions.length === 0 ? (
                        <div className="text-center text-red-500 py-4 border rounded-lg bg-red-50">
                           Seçenek bulunamadı. Lütfen bilgileri kontrol edip tekrar deneyin.
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                           {deliveryOptions.map((option, index) => (
                              <div
                                 key={option.deliveryOptionId || option.id || option.code || index}
                                 onClick={() => setSelectedDeliveryOptionId(option.deliveryOptionId || option.id)}
                                 className={`
                                    relative border rounded-lg p-4 cursor-pointer transition-all duration-200
                                    flex items-center justify-between
                                    ${selectedDeliveryOptionId === (option.deliveryOptionId || option.id)
                                       ? 'border-green-600 bg-green-50 ring-2 ring-green-200' 
                                       : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'}
                                 `}
                              >
                                 <div className="flex items-center space-x-4">
                                    {option.logo || option.logo_url ? (
                                       <img src={option.logo || option.logo_url} alt={option.deliveryOptionName || option.name} className="w-12 h-12 object-contain bg-white rounded p-1 border" />
                                    ) : (
                                       <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl">📦</div>
                                    )}
                                    <div>
                                       <h4 className="font-bold text-gray-900">{option.deliveryOptionName || option.name || option.kargo_firmasi || option.company || "Kargo Firması"}</h4>
                                       <p className="text-xs text-gray-500">
                                         {(() => {
                                           const time = option.avgDeliveryTime || option.tahmini_teslimat || option.estimated_delivery;
                                           if (!time) return "1-3 İş Günü";
                                           if (time === "1to3WorkingDays") return "1-3 İş Günü";
                                           if (time === "1to7WorkingDays") return "1-7 İş Günü";
                                           if (time.includes("to")) {
                                             const parts = time.replace("WorkingDays", "").split("to");
                                             return `${parts[0]}-${parts[1]} İş Günü`;
                                           }
                                           return time;
                                         })()}
                                       </p>
                                    </div>
                                 </div>
                                 
                                 <div className="text-right">
                                    <div className="text-lg font-bold text-green-700">
                                       {option.price ? `${parseFloat(option.price).toFixed(2)} TL` : "Ücretsiz"}
                                    </div>
                                 </div>
                                 
                                 {selectedDeliveryOptionId === (option.deliveryOptionId || option.id) && (
                                    <div className="absolute top-2 right-2 text-green-600">
                                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseShipmentForm}
                  disabled={shipmentLoading || deliveryOptionsLoading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
                >
                  İptal
                </button>
                
                {isDeliverySelectionStep && (
                   <button
                     onClick={() => setIsDeliverySelectionStep(false)}
                     disabled={shipmentLoading}
                     className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50 border border-gray-300 rounded-lg hover:bg-gray-50"
                   >
                     Geri
                   </button>
                )}

                <button
                  onClick={handleShipmentFormSubmit}
                  disabled={shipmentLoading || deliveryOptionsLoading || (isDeliverySelectionStep && !selectedDeliveryOptionId)}
                  className={`px-6 py-2 rounded-lg text-white transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2 ${
                    isDeliverySelectionStep && !selectedDeliveryOptionId 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {(shipmentLoading || deliveryOptionsLoading) && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>
                    {shipmentLoading || deliveryOptionsLoading
                      ? "İşleniyor..."
                      : isDeliverySelectionStep 
                        ? "Seçimi Onayla ve Oluştur" 
                        : "Devam Et / Fiyatları Gör"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Depo Ekleme Modalı */}
      {showAddWarehouseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Yeni Depo Ekle
                </h2>
                <button
                  onClick={() => setShowAddWarehouseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddWarehouseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depo Adı <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={warehouseForm.name}
                    onChange={e => setWarehouseForm({...warehouseForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Örn: Kadıköy Depo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows="2"
                    value={warehouseForm.address}
                    onChange={e => setWarehouseForm({...warehouseForm, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Açık adres giriniz"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İl <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={warehouseForm.city}
                      onChange={e => setWarehouseForm({...warehouseForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İlçe <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={warehouseForm.district}
                      onChange={e => setWarehouseForm({...warehouseForm, district: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={warehouseForm.phone}
                    onChange={e => setWarehouseForm({...warehouseForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="05551234567"
                  />
                </div>

                 <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={warehouseForm.is_default}
                    onChange={e => setWarehouseForm({...warehouseForm, is_default: e.target.checked})}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                    Varsayılan Depo Olarak Ayarla
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddWarehouseModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={warehouseLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {warehouseLoading ? 'Ekleniyor...' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
