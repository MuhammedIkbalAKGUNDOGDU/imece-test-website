import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiKey } from "../../config";
import { getCookie, setCookie } from "../../utils/cookieManager";
import { X, Trash2, Upload, Image as ImageIcon } from "lucide-react";

export default function SellerProductsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);

  const [sellerProducts, setSellerProducts] = useState([]);
  const [pendingApprovalProducts, setPendingApprovalProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // active | pending | all

  // Product actions (edit / deactivate)
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false); // Modal loading state
  
  const [editForm, setEditForm] = useState({
    urun_adi: "",
    aciklama: "",
    stok_durumu: "",
    urun_perakende_fiyati: "",
    urun_min_fiyati: "",
  });
  
  // Gallery & Cover Image States
  const [galleryImages, setGalleryImages] = useState([]);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deactivatingIds, setDeactivatingIds] = useState(() => new Set());

  const accessToken = getCookie("accessToken");

  const getAuthHeaders = () => ({
    "X-API-Key": apiKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const getProductId = (product) => product?.urun_id ?? product?.id;

  const updateProductInLists = (updatedProduct) => {
    const updatedId = getProductId(updatedProduct);
    if (updatedId == null) return;

    const apply = (arr) =>
      Array.isArray(arr)
        ? arr.map((p) => {
            const pid = getProductId(p);
            return pid === updatedId ? { ...p, ...updatedProduct } : p;
          })
        : arr;

    setSellerProducts((prev) => apply(prev));
    setPendingApprovalProducts((prev) => apply(prev));
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (!accessToken) {
        navigate("/satici-login");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const headers = getAuthHeaders();

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

        setCookie("userId", userId);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeEditModal();
      }
    };

    if (isEditModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditModalOpen]);

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
  const passiveProductsCount = useMemo(
    () => sellerProducts.filter((p) => p?.urun_gorunurluluk === false).length,
    [sellerProducts]
  );

  const visibleList = useMemo(() => {
    if (activeTab === "active") return activeProducts;
    if (activeTab === "pending") return pendingApprovalProducts;
    return sellerProducts;
  }, [activeTab, activeProducts, pendingApprovalProducts, sellerProducts]);

  const fetchProductDetails = async (urunId) => {
    setIsFetchingDetails(true);
    try {
      const response = await axios.get(
        `https://imecehub.com/api/products/urunler/${urunId}/`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (err) {
      console.error("Ürün detay hatası:", err);
      // Detay çekilemezse existing data ile devam etmeye çalışacağız
      // veya hata gösterebiliriz. Şimdilik silent fail veya alert.
      return null;
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const openEditModal = async (product) => {
    const urunId = getProductId(product);
    if (!urunId) return;

    setEditingProduct(product);
    setEditError(null);
    setNewCoverImage(null);
    setCoverImagePreview(null);
    
    // Formu önce eldeki verilerle doldur (hızlı açılış)
    setEditForm({
      urun_adi: product?.urun_adi || "",
      aciklama: product?.aciklama || product?.urun_aciklama || "",
      stok_durumu:
        product?.stok_durumu != null ? String(product.stok_durumu) : "",
      urun_perakende_fiyati:
        product?.urun_perakende_fiyati != null
          ? String(product.urun_perakende_fiyati)
          : "",
      urun_min_fiyati:
        product?.urun_min_fiyati != null ? String(product.urun_min_fiyati) : "",
    });
    
    setIsEditModalOpen(true);
    
    // Detayları çek (resimler için)
    const details = await fetchProductDetails(urunId);
    if (details) {
      setEditForm((prev) => ({
        ...prev,
        // Backend güncel verisi varsa onu kullan
        urun_adi: details.urun_adi || prev.urun_adi,
        aciklama: details.aciklama || prev.aciklama,
        stok_durumu: details.stok_durumu != null ? String(details.stok_durumu) : prev.stok_durumu,
        urun_perakende_fiyati: details.urun_perakende_fiyati || prev.urun_perakende_fiyati,
      }));
      setGalleryImages(details.images || []);
    } else {
      setGalleryImages([]);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditError(null);
    setIsSavingEdit(false);
  };

  // Gallery Actions
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Urun ID kontrol
    const urunId = getProductId(editingProduct);
    if (!urunId) return;

    setIsUploadingGallery(true);
    try {
      // Her dosya için ayrı istek atıyoruz ya da backend çoklu destekliyorsa (rehberde "image" keyleri)
      // Rehbere göre: image (file1), image (file2) şeklinde aynı key ile gönderilebiliyor.
      const formData = new FormData();
      formData.append("urun", urunId);
      files.forEach(file => {
        formData.append("image", file);
      });
      // opsiyonel: formData.append("aciklama", "...");

      const response = await axios.post(
        "https://imecehub.com/api/products/urunimage/",
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // Başarılı dönerse listeye ekle
      // Dönüt formatı: { durum: "BASARILI", resimler: [...] }
      if (response.data?.resimler) {
        setGalleryImages(prev => [...prev, ...response.data.resimler]);
        alert("Resimler başarıyla yüklendi.");
      } else {
         // Fallback: reload details
         const details = await fetchProductDetails(urunId);
         if (details?.images) setGalleryImages(details.images);
      }
    } catch (err) {
      console.error("Resim yükleme hatası:", err);
      alert("Resim yüklenirken hata oluştu.");
    } finally {
      setIsUploadingGallery(false);
      // Inputu temizle
      e.target.value = "";
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!window.confirm("Bu resmi silmek istediğinize emin misiniz?")) return;
    
    try {
      await axios.delete(
        `https://imecehub.com/api/products/urunimage/${imageId}/`,
        { headers: getAuthHeaders() }
      );
      // Listeden çıkar
      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      console.error("Resim silme hatası:", err);
      alert("Resim silinemedi.");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const urunId = getProductId(editingProduct);
    if (!urunId) return;

    setIsSavingEdit(true);
    setEditError(null);

    try {
      let payload;
      let isFormData = false;

      // Eğer kapak görseli değiştiyse FormData kullanmalıyız
      if (newCoverImage) {
        isFormData = true;
        payload = new FormData();
        if (editForm.urun_adi?.trim()) payload.append("urun_adi", editForm.urun_adi.trim());
        payload.append("aciklama", editForm.aciklama ?? "");
        if (editForm.stok_durumu !== "") payload.append("stok_durumu", editForm.stok_durumu);
        if (editForm.urun_perakende_fiyati !== "") payload.append("urun_perakende_fiyati", editForm.urun_perakende_fiyati);
        if (editForm.urun_min_fiyati !== "") payload.append("urun_min_fiyati", editForm.urun_min_fiyati);
        
        payload.append("kapak_gorseli", newCoverImage);
      } else {
        // Sadece JSON yeterli
        payload = {};
        if (editForm.urun_adi?.trim()) payload.urun_adi = editForm.urun_adi.trim();
        payload.aciklama = editForm.aciklama ?? "";
        if (editForm.stok_durumu !== "") payload.stok_durumu = Number(editForm.stok_durumu);
        if (editForm.urun_perakende_fiyati !== "")
          payload.urun_perakende_fiyati = Number(editForm.urun_perakende_fiyati);
        if (editForm.urun_min_fiyati !== "")
          payload.urun_min_fiyati = Number(editForm.urun_min_fiyati);
      }

      const headers = getAuthHeaders();
      if (isFormData) headers["Content-Type"] = "multipart/form-data";

      const response = await axios.patch(
        `https://imecehub.com/api/products/urunler/${urunId}/`,
        payload,
        { headers }
      );

      // API genelde güncel ürünü döndürür
      const updated = response.data?.data || response.data;
      // Eğer JSON dönen veri, gönderdiğimiz kapak resmini içermiyorsa manuel eklemeye gerek yok, 
      // liste yenilenecek veya pasife düşecek.
      
      updateProductInLists({ ...editingProduct, ...updated });
      closeEditModal();
      alert("Ürün başarıyla güncellendi ve onaya gönderildi (Pasif duruma alındı).");
      
      // Listeleri yenilemek mantıklı olabilir çünkü ürün pasife düştü
      // window.location.reload(); // veya fetchAll() çağırılabilir ama şimdilik manuel state update yeterli.
    } catch (err) {
      console.error("Ürün güncelleme hatası:", err.response?.data || err);
      const status = err.response?.status;
      if (status === 403) {
        setEditError("Bu ürünü güncelleme yetkiniz yok (403).");
      } else {
        setEditError(
          err.response?.data?.mesaj ||
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Ürün güncellenirken bir hata oluştu."
        );
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeactivate = async (product) => {
    const urunId = getProductId(product);
    if (!urunId) return;

    if (product?.urun_gorunurluluk === false) {
      alert("Bu ürün zaten pasif.");
      return;
    }

    const ok = window.confirm("Bu ürünü pasife almak istiyor musunuz?");
    if (!ok) return;

    setDeactivatingIds((prev) => new Set(prev).add(String(urunId)));
    try {
      const response = await axios.post(
        `https://imecehub.com/api/products/urunler/${urunId}/pasife-al/`,
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data?.durum === "BASARILI") {
        updateProductInLists({ ...product, urun_gorunurluluk: false });
        alert(response.data?.mesaj || "Ürün pasife alındı.");
      } else {
        alert(response.data?.mesaj || "Ürün pasife alınamadı.");
      }
    } catch (err) {
      console.error("Ürün pasife alma hatası:", err.response?.data || err);
      const status = err.response?.status;
      if (status === 403) {
        alert("Bu ürünü pasife alma yetkiniz yok (403).");
      } else {
        alert(
          err.response?.data?.mesaj ||
            err.response?.data?.detail ||
            "Ürün pasife alınırken bir hata oluştu."
        );
      }
    } finally {
      setDeactivatingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(String(urunId));
        return copy;
      });
    }
  };

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
          <div className="ml-auto px-3 py-2 text-xs text-gray-500 self-center">
            Pasif: {passiveProductsCount}
          </div>
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

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(product);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      disabled={
                        product?.urun_gorunurluluk === false ||
                        deactivatingIds.has(String(getProductId(product)))
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeactivate(product);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold ${
                        product?.urun_gorunurluluk === false
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : deactivatingIds.has(String(getProductId(product)))
                          ? "bg-gray-300 text-white cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      title={
                        product?.urun_gorunurluluk === false
                          ? "Ürün zaten pasif"
                          : "Ürünü pasife al"
                      }
                    >
                      {deactivatingIds.has(String(getProductId(product)))
                        ? "Pasife alınıyor..."
                        : "Pasife Al"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <div>
                <p className="text-sm text-gray-500">Ürün Düzenle</p>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {editingProduct?.urun_adi || "Ürün"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              {editError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {editError}
                </div>
              )}
              
              {/* Passive Warning */}
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
                <strong>Dikkat:</strong> Ürün bilgilerini veya kapak fotoğrafını güncellediğinizde ürün 
                otomatik olarak pasife alınır ve tekrar onay süreci başlar.
              </div>

              {/* Cover Image Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapak Fotoğrafı
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                    <img 
                      src={coverImagePreview || editingProduct?.kapak_gorseli || editingProduct?.resim_url || "https://via.placeholder.com/150"} 
                      alt="Kapak" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="coverImageInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverImageChange}
                    />
                    <label 
                      htmlFor="coverImageInput"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Değiştir
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 600x600 piksel önerilir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ürün Adı
                  </label>
                  <input
                    name="urun_adi"
                    value={editForm.urun_adi}
                    onChange={(e) => setEditForm(prev => ({...prev, urun_adi: e.target.value}))}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Ürün adı"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    name="aciklama"
                    value={editForm.aciklama}
                    onChange={(e) => setEditForm(prev => ({...prev, aciklama: e.target.value}))}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 min-h-[80px] focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Ürün açıklaması"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stok_durumu"
                    value={editForm.stok_durumu}
                    onChange={(e) => setEditForm(prev => ({...prev, stok_durumu: e.target.value}))}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    name="urun_perakende_fiyati"
                    value={editForm.urun_perakende_fiyati}
                    onChange={(e) => setEditForm(prev => ({...prev, urun_perakende_fiyati: e.target.value}))}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    name="urun_min_fiyati"
                    value={editForm.urun_min_fiyati}
                    onChange={(e) => setEditForm(prev => ({...prev, urun_min_fiyati: e.target.value}))}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="(opsiyonel)"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              {/* Gallery Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Ürün Galerisi</h4>
                  <div>
                    <input
                      type="file"
                      id="galleryInput"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                    <label
                      htmlFor="galleryInput"
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer border border-blue-200 transition ${isUploadingGallery ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUploadingGallery ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Resim Ekle
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {isFetchingDetails ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                     Galeri yükleniyor...
                  </div>
                ) : galleryImages.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Henüz galeri görseli eklenmemiş.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {galleryImages.map((img) => (
                      <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={img.image} 
                          alt="Galeri" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-700"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isSavingEdit}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className={`px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 ${
                    isSavingEdit
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSavingEdit && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSavingEdit ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

