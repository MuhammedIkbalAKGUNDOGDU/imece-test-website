import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/GenerealUse/Header";

const SellerOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Örnek sipariş verileri
  const mockOrders = [
    {
      orderId: "11223344",
      createShipment: false,
      storeName: "imecehub.com",
      payment_method: "paid",
      amount: 150.0,
      amount_due: 0,
      subtotal: 150.0,
      currency: "TRY",
      shippingNotes: "Mümkünse öğleden sonra teslimat yapılsın.",
      packageSize: "small",
      packageCount: 2,
      packageWeight: 1.5,
      orderDate: "28/08/2025 16:23",
      status: "pending", // pending, shipped, delivered, cancelled
      senderName: "Sender Company",
      senderInformation: {
        senderAddressName: "havva karaca - None",
        senderId: "5",
        senderFullName: "havva karaca",
        senderMobile: "05466568475",
        senderEmail: "karacaerdem57235@gmail.com",
        senderCountry: "türkiye",
        senderCity: "rize",
        senderAddressLine:
          "adres satırı1, adres satırı2, deniz, ardeşen, rize, türkiye, 1111",
      },
      customer: {
        name: "erdem karaca",
        email: "karacaerdem572@gmail.com",
        mobile: "05466568475",
        address:
          "adres satırı1, adres satırı2, deniz, ardeşen, rize, türkiye, 1111",
        city: "rize",
        country: "türkiye",
      },
      items: [
        {
          productId: 5,
          name: "Organik Domates",
          price: 37.5,
          quantity: 4,
          serialnumber: "",
          sku: 5,
        },
      ],
    },
    {
      orderId: "11223345",
      createShipment: true,
      storeName: "imecehub.com",
      payment_method: "paid",
      amount: 89.9,
      amount_due: 0,
      subtotal: 89.9,
      currency: "TRY",
      shippingNotes: "",
      packageSize: "medium",
      packageCount: 1,
      packageWeight: 2.0,
      orderDate: "27/08/2025 14:15",
      status: "shipped",
      senderName: "Sender Company",
      senderInformation: {
        senderAddressName: "havva karaca - None",
        senderId: "5",
        senderFullName: "havva karaca",
        senderMobile: "05466568475",
        senderEmail: "karacaerdem57235@gmail.com",
        senderCountry: "türkiye",
        senderCity: "rize",
        senderAddressLine:
          "adres satırı1, adres satırı2, deniz, ardeşen, rize, türkiye, 1111",
      },
      customer: {
        name: "ayşe yılmaz",
        email: "ayse.yilmaz@gmail.com",
        mobile: "05321234567",
        address: "merkez mahallesi, no:15, istanbul, türkiye, 34000",
        city: "istanbul",
        country: "türkiye",
      },
      items: [
        {
          productId: 8,
          name: "Taze Elma",
          price: 89.9,
          quantity: 1,
          serialnumber: "",
          sku: 8,
        },
      ],
    },
    {
      orderId: "11223346",
      createShipment: true,
      storeName: "imecehub.com",
      payment_method: "paid",
      amount: 200.0,
      amount_due: 0,
      subtotal: 200.0,
      currency: "TRY",
      shippingNotes: "",
      packageSize: "large",
      packageCount: 3,
      packageWeight: 4.5,
      orderDate: "26/08/2025 09:30",
      status: "delivered",
      senderName: "Sender Company",
      senderInformation: {
        senderAddressName: "havva karaca - None",
        senderId: "5",
        senderFullName: "havva karaca",
        senderMobile: "05466568475",
        senderEmail: "karacaerdem57235@gmail.com",
        senderCountry: "türkiye",
        senderCity: "rize",
        senderAddressLine:
          "adres satırı1, adres satırı2, deniz, ardeşen, rize, türkiye, 1111",
      },
      customer: {
        name: "mehmet demir",
        email: "mehmet.demir@gmail.com",
        mobile: "05551234567",
        address: "cumhuriyet caddesi, no:25, ankara, türkiye, 06000",
        city: "ankara",
        country: "türkiye",
      },
      items: [
        {
          productId: 12,
          name: "Organik Muz",
          price: 100.0,
          quantity: 2,
          serialnumber: "",
          sku: 12,
        },
      ],
    },
  ];

  useEffect(() => {
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "pending":
        return order.status === "pending";
      case "shipped":
        return order.status === "shipped";
      case "delivered":
        return order.status === "delivered";
      case "cancelled":
        return order.status === "cancelled";
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Kargo Bekliyor";
      case "shipped":
        return "Kargolandı";
      case "delivered":
        return "Teslim Edildi";
      case "cancelled":
        return "İptal Edildi";
      default:
        return "Bilinmiyor";
    }
  };

  const handleCreateShipment = (orderId) => {
    // Kargo oluşturma işlemi burada yapılacak
    console.log("Kargo oluşturuluyor:", orderId);
    alert(`${orderId} numaralı sipariş için kargo oluşturuluyor...`);
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
                count: orders.filter((o) => o.status === "pending").length,
              },
              {
                id: "shipped",
                label: "Kargolanan",
                count: orders.filter((o) => o.status === "shipped").length,
              },
              {
                id: "delivered",
                label: "Teslim Edilen",
                count: orders.filter((o) => o.status === "delivered").length,
              },
              {
                id: "cancelled",
                label: "İptal Edilen",
                count: orders.filter((o) => o.status === "cancelled").length,
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
                      Sipariş #{order.orderId}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{order.orderDate}</p>
                    <p className="text-lg font-bold text-green-600">
                      ₺{order.amount.toFixed(2)}
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
                        <strong>Ad:</strong> {order.customer.name}
                      </p>
                      <p>
                        <strong>E-posta:</strong> {order.customer.email}
                      </p>
                      <p>
                        <strong>Telefon:</strong> {order.customer.mobile}
                      </p>
                      <p>
                        <strong>Adres:</strong> {order.customer.address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Kargo Bilgileri
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Paket Boyutu:</strong> {order.packageSize}
                      </p>
                      <p>
                        <strong>Paket Sayısı:</strong> {order.packageCount}
                      </p>
                      <p>
                        <strong>Ağırlık:</strong> {order.packageWeight} kg
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
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ₺{item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Adet: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
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
                    {order.status === "pending" && !order.createShipment && (
                      <button
                        onClick={() => handleCreateShipment(order.orderId)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Kargo Oluştur
                      </button>
                    )}
                    {order.createShipment && (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Kargo oluşturuldu
                      </span>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Detayları Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
