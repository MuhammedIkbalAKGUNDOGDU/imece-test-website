import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiKey } from "../../config";

export default function SellerProductsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);

  const [sellerProducts, setSellerProducts] = useState([]);
  const [pendingApprovalProducts, setPendingApprovalProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // active | pending | all

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAll = async () => {
      if (!accessToken) {
        navigate("/satici-login");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const headers = {
          "X-API-Key": apiKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const userResponse = await axios.get(
          "https://imecehub.com/api/users/kullanicilar/me/",
          { headers }
        );
        const role = userResponse.data?.rol;
        const userId = userResponse.data?.id;

        if (role !== "satici") {
          navigate("/");
          return;
        }

        localStorage.setItem("userId", userId);
        setUserInfo(userResponse.data);

        const sellerResponse = await axios.get(
          "https://imecehub.com/api/users/kullanicilar/satici_profili/",
          { headers }
        );
        setSellerInfo(sellerResponse.data);

        // Satıcının tüm ürünleri (mevcut kullanım ile aynı)
        const productsResponse = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-products/",
          data: { kullanici_id: userId },
          headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        });
        setSellerProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);

        // Onay bekleyen / pasif ürünler (yeni endpoint)
        const pendingResponse = await axios.get(
          "https://imecehub.com/api/products/urunler/pasif-onay-bekleyen/",
          { headers }
        );
        if (pendingResponse.data?.durum === "BASARILI") {
          setPendingApprovalProducts(pendingResponse.data?.urunler || []);
        } else {
          setPendingApprovalProducts([]);
        }
      } catch (err) {
        console.error("SellerProductsPage error:", err);
        setError(
          err.response?.data?.mesaj ||
            err.response?.data?.detail ||
            "Ürünler yüklenirken bir hata oluştu."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [accessToken, navigate]);

  const formatDateTR = (dateStr) => {
    if (!dateStr) return "-";
    const dt = new Date(dateStr);
    if (Number.isNaN(dt.getTime())) return String(dateStr);
    return dt.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const activeProducts = useMemo(
    () => sellerProducts.filter((p) => p?.urun_gorunurluluk === true),
    [sellerProducts]
  );
  const passiveProducts = useMemo(
    () => sellerProducts.filter((p) => p?.urun_gorunurluluk === false),
    [sellerProducts]
  );

  const visibleList = useMemo(() => {
    if (activeTab === "active") return activeProducts;
    if (activeTab === "pending") return pendingApprovalProducts;
    return sellerProducts;
  }, [activeTab, activeProducts, pendingApprovalProducts, sellerProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ürünlerim</h1>
            <p className="text-red-700">{error}</p>
            <div className="mt-4">
              <button
                onClick={() => navigate("/seller/landing")}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Satıcı Paneline Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ürünlerim</h1>
            <p className="text-sm text-gray-600 mt-1">
              {sellerInfo?.magaza_adi || userInfo?.username || "Satıcı"} •{" "}
              {sellerProducts.length} ürün
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/seller/landing")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
            >
              Geri
            </button>
            <button
              onClick={() => navigate("/Urun-Ekle-1")}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Yeni Ürün Ekle
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              activeTab === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Yayındaki Ürünler ({activeProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              activeTab === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Onay Bekleyen ({pendingApprovalProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tümü ({sellerProducts.length})
          </button>
        </div>

        {/* Grid */}
        {visibleList.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Bu bölümde ürün yok
            </h3>
            <p className="text-gray-600 mt-1">
              Ürün ekleyerek mağazanıza içerik ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleList.map((product, index) => (
              <div
                key={product?.urun_id || product?.id || index}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/order-page", { state: { product } })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/order-page", { state: { product } });
                  }
                }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <div className="w-full h-48 bg-gray-100">
                  <img
                    src={
                      product?.kapak_gorseli ||
                      product?.resim_url ||
                      "https://via.placeholder.com/600x400?text=Ürün+Resmi"
                    }
                    alt={product?.urun_adi || "Ürün"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product?.urun_adi || "Ürün"}
                    </h3>
                    <span
                      className={`shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                        product?.urun_gorunurluluk
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product?.urun_gorunurluluk ? "Yayında" : "Pasif"}
                    </span>
                  </div>

                  {product?.urun_perakende_fiyati != null && (
                    <p className="text-green-700 font-bold mt-2">
                      ₺{product.urun_perakende_fiyati}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Tarih: {formatDateTR(product?.urun_ekleme_tarihi)}</span>
                    {product?.stok_durumu != null && (
                      <span>Stok: {product.stok_durumu}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

