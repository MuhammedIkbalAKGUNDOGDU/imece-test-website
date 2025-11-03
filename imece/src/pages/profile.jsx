import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import { apiKey } from "../config";
import "../styles/profile.css";
import AddressModal from "../components/profileComponents/AddressModal";
import OrderDetailModal from "../components/profileComponents/OrderDetailModal";
import {
  User,
  Package,
  Settings,
  Users,
  MapPin,
  Star,
  ShoppingBag,
  Bell,
  LogOut,
  ChevronRight,
  Edit,
  Plus,
  X,
  Upload,
} from "lucide-react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [currentMenu, setCurrentMenu] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    telno: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const apiUrl = "https://imecehub.com/api/users/kullanicilar/me/";

  // Menü yapısı
  const menuItems = [
    { id: "profile", label: "Profilim", icon: User, color: "text-blue-600" },
    {
      id: "orders",
      label: "Siparişlerim",
      icon: Package,
      color: "text-green-600",
    },
    {
      id: "groups",
      label: "Dahil Olduğum Gruplar",
      icon: Users,
      color: "text-purple-600",
    },
    {
      id: "addresses",
      label: "Adreslerim",
      icon: MapPin,
      color: "text-orange-600",
    },
    {
      id: "reviews",
      label: "Değerlendirmelerim",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: Settings,
      color: "text-gray-600",
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });
        setUserData(response.data);
        setPhotoError(false); // Fotoğraf hatasını sıfırla
        setError(null);
      } catch (err) {
        console.error("Veri çekme hatası:", err);

        // 401 Unauthorized hatası kontrolü
        if (err.response?.status === 401) {
          setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
          // Token'ları temizle
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } else {
          setError("Kullanıcı bilgileri alınamadı");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Sadece accessToken varsa ve userData yoksa çek
    if (accessToken && !userData) {
      fetchUserData();
    }
  }, [accessToken, userData]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleGoToLogin = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleEditProfile = () => {
    // Mevcut bilgileri form'a yükle
    setEditProfileForm({
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      email: userData?.email || "",
      telno: userData?.telno || "",
    });
    setPhotoPreview(userData?.profil_fotograf || null);
    setProfilePhoto(null);
    setShowEditProfileModal(true);
  };

  const handleEditProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = async () => {
    // Kullanıcıya onay sor
    if (
      !window.confirm("Profil fotoğrafını silmek istediğinizden emin misiniz?")
    ) {
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      // Fotoğrafı silmek için boş değer veya null gönderebiliriz
      // API'nin silme endpoint'ini kontrol etmek gerekebilir
      formData.append("profil_fotograf", "");

      const response = await axios.patch(
        "https://imecehub.com/api/users/kullanicilar/update_me/",
        formData,
        {
          headers: {
            "X-API-Key": apiKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data) {
        // State'leri temizle
        setProfilePhoto(null);
        setPhotoPreview(null);

        // Kullanıcı bilgilerini yeniden yükle
        const userResponse = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });
        setUserData(userResponse.data);
        setPhotoError(false); // Fotoğraf hatasını sıfırla
        alert("Profil fotoğrafı başarıyla silindi.");
      }
    } catch (error) {
      console.error("Profil fotoğrafı silme hatası:", error);
      alert("Profil fotoğrafı silinirken bir hata oluştu.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "X-API-Key": apiKey,
        Authorization: `Bearer ${accessToken}`,
        // Content-Type header'ı FormData kullanıldığında otomatik ayarlanır
      };

      // FormData oluştur (multipart/form-data için)
      const formData = new FormData();

      // Basit alanları ekle
      if (editProfileForm.first_name)
        formData.append("first_name", editProfileForm.first_name);
      if (editProfileForm.last_name)
        formData.append("last_name", editProfileForm.last_name);
      if (editProfileForm.email)
        formData.append("email", editProfileForm.email);
      if (editProfileForm.telno)
        formData.append("telno", editProfileForm.telno);

      // Profil fotoğrafı varsa ekle
      if (profilePhoto) {
        formData.append("profil_fotograf", profilePhoto);
      }

      const response = await axios.patch(
        "https://imecehub.com/api/users/kullanicilar/update_me/",
        formData,
        { headers }
      );

      console.log("Profil güncelleme yanıtı:", response.data);

      if (response.data) {
        alert("Profil başarıyla güncellendi.");
        // Kullanıcı bilgilerini yeniden yükle
        const userResponse = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });
        setUserData(userResponse.data);
        setPhotoError(false); // Fotoğraf hatasını sıfırla
        setShowEditProfileModal(false);
      }
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      console.error("Hata detayı:", error.response?.data);
      alert(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Profil güncellenirken bir hata oluştu."
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const closeEditProfileModal = () => {
    setShowEditProfileModal(false);
    setProfilePhoto(null);
    setPhotoPreview(null);
  };

  const renderContent = () => {
    switch (currentMenu) {
      case "profile":
        return <ProfileContent user={userData} onEdit={handleEditProfile} />;
      case "orders":
        return <OrdersContent />;
      case "groups":
        return <GroupsContent />;
      case "addresses":
        return <AddressesContent />;
      case "reviews":
        return <ReviewsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <div>Sayfa bulunamadı</div>;
    }
  };

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Giriş Yapın
            </h2>
            <p className="text-gray-600 mb-6">
              Profil bilgilerinizi görüntülemek için giriş yapın
            </p>
            <div className="flex gap-4">
              <a
                href="/login"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-center"
              >
                Giriş Yap
              </a>
              <a
                href="/register"
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-center"
              >
                Kaydol
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
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
    <div className="min-h-screen bg-gray-50 profile-container">
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 profile-sidebar">
              {/* Kullanıcı Bilgileri */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center user-avatar overflow-hidden relative">
                  {userData?.profil_fotograf && !photoError ? (
                    <img
                      src={userData.profil_fotograf}
                      alt="Profil fotoğrafı"
                      className="w-full h-full object-cover"
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {userData?.first_name || "Kullanıcı"}{" "}
                  {userData?.last_name || ""}
                </h2>
                <p className="text-gray-500 text-sm">{userData?.email}</p>
                {userData?.rol && (
                  <p className="text-gray-400 text-xs mt-1">
                    {userData.rol === "satici" ? "Satıcı" : "Alıcı"}
                  </p>
                )}
              </div>

              {/* Menü */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentMenu(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 menu-item ${
                        currentMenu === item.id
                          ? "active"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </button>
                  );
                })}
              </nav>

              {/* Çıkış Butonu */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ İçerik */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 profile-content fade-in w-full">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Profil Bilgilerini Düzenle
              </h2>
              <button
                onClick={closeEditProfileModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProfile} className="p-6">
              <div className="space-y-4">
                {/* Profil Fotoğrafı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profil Fotoğrafı
                  </label>
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={photoPreview}
                        alt="Profil fotoğrafı"
                        className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-0 hover:bg-opacity-50 rounded-full transition-all duration-200 group">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removePhoto();
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200"
                          title="Fotoğrafı Sil"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <label
                          htmlFor="profile-photo-change"
                          className="opacity-0 group-hover:opacity-100 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-200 cursor-pointer"
                          title="Fotoğrafı Değiştir"
                        >
                          <Upload className="w-4 h-4" />
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                          id="profile-photo-change"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">
                        Profil fotoğrafı yükleyin
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="profile-photo-upload"
                      />
                      <label
                        htmlFor="profile-photo-upload"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
                      >
                        Fotoğraf Seç
                      </label>
                    </div>
                  )}
                  {profilePhoto && (
                    <p className="text-sm text-gray-500 mt-2">
                      Yeni fotoğraf: {profilePhoto.name}
                    </p>
                  )}
                  {photoPreview && !profilePhoto && (
                    <p className="text-xs text-gray-400 mt-2">
                      Fotoğrafın üzerine gelerek değiştirebilir veya
                      silebilirsiniz
                    </p>
                  )}
                </div>

                {/* İsim Soyisim */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={editProfileForm.first_name}
                      onChange={handleEditProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Adınızı girin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={editProfileForm.last_name}
                      onChange={handleEditProfileInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Soyadınızı girin"
                    />
                  </div>
                </div>

                {/* E-posta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editProfileForm.email}
                    onChange={handleEditProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    name="telno"
                    value={editProfileForm.telno}
                    onChange={handleEditProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="05331231212"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditProfileModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? "Güncelleniyor..." : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Alt bileşenler
const ProfileContent = ({ user, onEdit }) => (
  <div>
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Profil Bilgilerim</h1>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
      >
        <Edit className="w-4 h-4" />
        Profili Düzenle
      </button>
    </div>
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Ad Soyad</p>
          <p className="font-medium">
            {user?.first_name || "Belirtilmemiş"} {user?.last_name || ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">E-posta</p>
          <p className="font-medium">{user?.email || "Belirtilmemiş"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Telefon</p>
          <p className="font-medium">{user?.telno || "Belirtilmemiş"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Rol</p>
          <p className="font-medium">
            {user?.rol === "satici"
              ? "Satıcı"
              : user?.rol === "alici"
              ? "Alıcı"
              : "Belirtilmemiş"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Bakiye</p>
          <p className="font-medium">
            {user?.bakiye ? `${user.bakiye}₺` : "0₺"}
          </p>
        </div>
      </div>

      {user?.alici_profili?.adres && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
          <div>
            <p className="text-sm text-gray-500">Adres (Alıcı Profili)</p>
            <p className="font-medium">{user.alici_profili.adres}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Durum</p>
          <p className="font-medium">
            {user?.is_online ? (
              <span className="text-green-600">Çevrimiçi</span>
            ) : (
              <span className="text-gray-500">Çevrimdışı</span>
            )}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

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

  const fetchOrders = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 1. Kullanıcının tüm siparişlerini getir
      const allOrdersResponse = await axios.get(
        "https://imecehub.com/api/logistics/siparis/get-users-order/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // 2. Belirli bir sipariş detayını getir (mevcut siparişlerden birini kullan)
      if (allOrdersResponse.data && allOrdersResponse.data.length > 0) {
        const firstOrderId = allOrdersResponse.data[0].siparis_id;
        try {
          const specificOrderResponse = await axios.post(
            "https://imecehub.com/api/logistics/siparis/get-order-by-id/",
            {
              siparis_id: firstOrderId,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-API-Key": apiKey,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (specificOrderError) {
          // Belirli sipariş API'si test edildi
        }
      }

      // Sipariş verilerini işle
      let ordersData = allOrdersResponse.data;

      // Eğer string ise JSON parse et
      if (typeof allOrdersResponse.data === "string") {
        try {
          ordersData = JSON.parse(allOrdersResponse.data);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          setError("Veri formatı hatalı");
          return;
        }
      }

      // Eğer object ise ve orders property'si varsa onu al
      if (
        ordersData &&
        typeof ordersData === "object" &&
        !Array.isArray(ordersData)
      ) {
        if (ordersData.siparisler) {
          ordersData = ordersData.siparisler;
        } else if (ordersData.orders) {
          ordersData = ordersData.orders;
        } else if (ordersData.results) {
          ordersData = ordersData.results;
        } else if (ordersData.data) {
          ordersData = ordersData.data;
        }
      }

      // Array değilse boş array yap
      if (!Array.isArray(ordersData)) {
        console.warn("Orders data is not an array:", ordersData);
        ordersData = [];
      }

      setOrders(ordersData);
    } catch (err) {
      setError("Sipariş bilgileri alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h1>
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h1>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 empty-state">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 empty-state-icon" />
          <p className="text-gray-500">Henüz siparişiniz bulunmuyor</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders
            .sort((a, b) => (b.siparis_id || 0) - (a.siparis_id || 0))
            .map((order, index) => (
              <div
                key={index}
                onClick={() => handleOrderClick(order.siparis_id)}
                className="p-6 border border-gray-200 rounded-lg group-card hover:shadow-md transition-shadow duration-200 cursor-pointer hover:border-blue-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Sipariş #{order.siparis_id}
                      </h3>
                      {getOrderStatusBadge(order.durum)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Toplam Tutar</p>
                        <p className="font-semibold text-green-600 text-lg">
                          {order.toplam_fiyat}₺
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 mb-1">Sipariş Tarihi</p>
                        <p className="font-medium text-gray-800">
                          {new Date(
                            order.siparis_verilme_tarihi
                          ).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    {order.alici_ad_soyad && order.alici_ad_soyad.trim() && (
                      <div className="mt-3">
                        <p className="text-gray-500 text-sm mb-1">Alıcı</p>
                        <p className="font-medium text-gray-800">
                          {order.alici_ad_soyad}
                        </p>
                      </div>
                    )}

                    {order.fatura_adresi_string && (
                      <div className="mt-3">
                        <p className="text-gray-500 text-sm mb-1">
                          Fatura Adresi
                        </p>
                        <p className="text-gray-700 text-sm">
                          {order.fatura_adresi_string}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
      />
    </div>
  );
};

const GroupsContent = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  const fetchGroups = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://imecehub.com/products/groups/list/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // Eğer HTML döndüyse, bu bir hata
      if (
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE html>")
      ) {
        console.error("Server returned HTML instead of JSON");
        setError("API endpoint bulunamadı veya erişim hatası");
        return;
      }

      // Normal JSON response
      let groupsData = response.data;
      if (typeof response.data === "string") {
        try {
          groupsData = JSON.parse(response.data);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          setError("Veri formatı hatalı");
          return;
        }
      }

      // joined_groups property'sini al
      if (groupsData && groupsData.joined_groups) {
        groupsData = groupsData.joined_groups;
      }

      // Array değilse boş array yap
      if (!Array.isArray(groupsData)) {
        console.warn("Groups data is not an array:", groupsData);
        groupsData = [];
      }

      setGroups(groupsData);
      setHasFetched(true);
    } catch (err) {
      console.error("Grup verileri alınırken hata:", err);
      console.error("Error response:", err.response?.data);
      setError("Grup bilgileri alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Sadece bir kez çek
    if (!hasFetched && accessToken) {
      fetchGroups();
    }
  }, [accessToken, hasFetched]);

  const handleLeaveGroup = async (groupId) => {
    if (window.confirm("Bu gruptan çıkmak istediğinizden emin misiniz?")) {
      try {
        console.log("Gruptan çıkma isteği gönderiliyor...");
        console.log("Group ID:", groupId);
        console.log("Request body:", { group_id: groupId });

        // POST metodu ile deneyelim - URL'yi düzelttik
        const response = await axios.post(
          "https://imecehub.com/products/groups/leave/",
          { group_id: groupId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Başarılı response:", response.data);

        // Grup listesini yenile
        fetchGroups();
        alert("Gruptan başarıyla çıktınız");
      } catch (err) {
        console.error("Gruptan çıkma hatası:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Error message:", err.message);
        console.error("Full error object:", err);

        // Daha detaylı hata mesajı
        let errorMessage = "Gruptan çıkarken bir hata oluştu";
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.status === 403) {
          errorMessage = "Sadece alıcılar gruplardan çıkabilir";
        } else if (err.response?.status === 404) {
          errorMessage = "Grup bulunamadı";
        } else if (err.response?.status === 400) {
          errorMessage = "Geçersiz istek formatı";
        } else if (err.response?.status === 405) {
          errorMessage = "Bu işlem için uygun HTTP metodu bulunamadı";
        }

        alert(errorMessage);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "aktif":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium status-badge status-active">
            Aktif
          </span>
        );
      case "completed":
      case "tamamlandı":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium status-badge status-completed">
            Tamamlandı
          </span>
        );
      case "pending":
      case "beklemede":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium status-badge">
            Beklemede
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium status-badge">
            {status || "Aktif"}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dahil Olduğum Gruplar
          </h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dahil Olduğum Gruplar
          </h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dahil Olduğum Gruplar
        </h1>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12 empty-state">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 empty-state-icon" />
          <p className="text-gray-500">Henüz bir gruba dahil değilsiniz</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {groups.map((group, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg group-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {group.group_name || group.name || group.title || "Grup"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {group.product_name && `${group.product_name} • `}
                    {group.amount_joined || 0} adet katıldınız
                    {group.group_capacity_left &&
                      ` • ${group.group_capacity_left} yer kaldı`}
                    {group.current_price && ` • ${group.current_price}₺`}
                  </p>
                  {group.group_visible === false && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Bu grup gizli
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {getStatusBadge(group.status)}
                  <button
                    onClick={() => handleLeaveGroup(group.group_id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Gruptan Çık"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddressesContent = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  // addresses'in array olduğundan emin ol
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  const fetchAddresses = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://imecehub.com/users/list-addresses/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // Adres verilerini konsola yazdır
      console.log("Adreslerim API Response:", response.data);
      console.log("Response type:", typeof response.data);
      console.log("Is Array:", Array.isArray(response.data));
      console.log(
        "Response keys:",
        response.data ? Object.keys(response.data) : "No data"
      );

      // API'den gelen veriyi kontrol et ve array'e çevir
      let addressesData = response.data;

      // Eğer string ise JSON parse et
      if (typeof response.data === "string") {
        try {
          addressesData = JSON.parse(response.data);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          setError("Veri formatı hatalı");
          return;
        }
      }

      // Eğer object ise ve addresses property'si varsa onu al
      if (
        addressesData &&
        typeof addressesData === "object" &&
        !Array.isArray(addressesData)
      ) {
        if (addressesData.adresler) {
          addressesData = addressesData.adresler;
        } else if (addressesData.addresses) {
          addressesData = addressesData.addresses;
        } else if (addressesData.results) {
          addressesData = addressesData.results;
        } else if (addressesData.data) {
          addressesData = addressesData.data;
        }
      }

      // Array değilse boş array yap
      if (!Array.isArray(addressesData)) {
        console.warn("Addresses data is not an array:", addressesData);
        addressesData = [];
      }

      setAddresses(addressesData);
    } catch (err) {
      console.error("Adres verileri alınırken hata:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      setError("Adres bilgileri alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    // Silinecek adresi bul
    const addressToDelete = safeAddresses.find((addr) => addr.id === addressId);

    // Eğer bu varsayılan adres ise uyarı ver
    if (addressToDelete && addressToDelete.varsayilan_adres) {
      const hasOtherAddresses = safeAddresses.length > 1;

      if (hasOtherAddresses) {
        const confirmDelete = window.confirm(
          "Bu adres varsayılan adresiniz. Silmek istediğinizden emin misiniz?\n\n" +
            "Önce başka bir adresi varsayılan yapmanız önerilir."
        );

        if (!confirmDelete) {
          return;
        }
      } else {
        alert(
          "Bu varsayılan adresiniz ve başka adresiniz bulunmuyor. Önce yeni bir adres ekleyin."
        );
        return;
      }
    } else {
      // Normal adres silme onayı
      if (!window.confirm("Bu adresi silmek istediğinizden emin misiniz?")) {
        return;
      }
    }

    try {
      await axios.delete("https://imecehub.com/users/delete-address/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        data: {
          adres_id: addressId,
        },
      });
      // Adres listesini yenile
      fetchAddresses();
      alert("Adres başarıyla silindi");
    } catch (err) {
      console.error("Adres silme hatası:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage =
        err.response?.data?.error || "Adres silinirken bir hata oluştu";
      alert(errorMessage);
    }
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (isEditing && editingAddress) {
        // Güncelleme - PUT metodu
        const updateData = {
          adres_id: editingAddress.id,
          ...formData,
        };

        // Eğer bu adres varsayılan yapılıyorsa, diğer adresleri false yap
        if (formData.varsayilan_adres) {
          console.log(
            "Varsayılan adres güncelleniyor, diğerleri false yapılıyor..."
          );
          // Önce tüm adresleri false yap
          for (const address of safeAddresses) {
            if (address.id !== editingAddress.id) {
              try {
                await axios.put(
                  "https://imecehub.com/users/update-address/",
                  {
                    adres_id: address.id,
                    varsayilan_adres: false,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "X-API-Key": apiKey,
                      "Content-Type": "application/json",
                    },
                  }
                );
              } catch (error) {
                console.log(`Adres ${address.id} güncellenirken hata:`, error);
              }
            }
          }
        }

        // Şimdi bu adresi güncelle - Swagger'daki endpoint'i kullan
        await axios.put(
          "https://imecehub.com/users/update-address/",
          updateData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Yeni adres ekleme - POST metodu
        console.log("Yeni adres ekleme isteği gönderiliyor...");
        console.log("Request data:", formData);
        console.log("Request data JSON:", JSON.stringify(formData, null, 2));

        // Eğer bu adres varsayılan yapılıyorsa, diğer adresleri false yap
        if (formData.varsayilan_adres) {
          console.log(
            "Yeni varsayılan adres ekleniyor, diğerleri false yapılıyor..."
          );
          // Önce tüm adresleri false yap
          for (const address of safeAddresses) {
            try {
              await axios.put(
                "https://imecehub.com/users/update-address/",
                {
                  adres_id: address.id,
                  varsayilan_adres: false,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-API-Key": apiKey,
                    "Content-Type": "application/json",
                  },
                }
              );
            } catch (error) {
              console.log(`Adres ${address.id} güncellenirken hata:`, error);
            }
          }
        }

        // Şimdi yeni adresi ekle - Swagger'daki endpoint'i kullan
        await axios.post("https://imecehub.com/users/add-address/", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });
      }

      // Modal'ı kapat ve listeyi yenile
      setIsModalOpen(false);
      setEditingAddress(null);
      setIsEditing(false);
      fetchAddresses();
      alert(
        isEditing ? "Adres başarıyla güncellendi" : "Adres başarıyla eklendi"
      );
    } catch (err) {
      console.error("Adres kaydetme hatası:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);
      console.error("Request URL:", err.config?.url);
      console.error("Request method:", err.config?.method);
      console.error("Request data:", err.config?.data);
      const errorMessage =
        err.response?.data?.error || "Adres kaydedilirken bir hata oluştu";
      alert(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setIsEditing(false);
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      // Önce tüm adresleri varsayılan olmaktan çıkar
      // Önce tüm adresleri false yap
      console.log(
        "Varsayılan adres güncelleniyor, diğerleri false yapılıyor..."
      );
      for (const address of safeAddresses) {
        if (address.id !== addressId) {
          try {
            await axios.put(
              "https://imecehub.com/users/update-address/",
              {
                adres_id: address.id,
                varsayilan_adres: false,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
          } catch (error) {
            console.log(`Adres ${address.id} güncellenirken hata:`, error);
          }
        }
      }

      // Şimdi bu adresi varsayılan yap - Swagger'daki endpoint'i kullan
      await axios.put(
        "https://imecehub.com/users/update-address/",
        {
          adres_id: addressId,
          varsayilan_adres: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // Adres listesini yenile
      fetchAddresses();
      alert("Varsayılan adres başarıyla güncellendi");
    } catch (err) {
      console.error("Varsayılan adres güncelleme hatası:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage =
        err.response?.data?.error ||
        "Varsayılan adres güncellenirken bir hata oluştu";
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Adreslerim</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 action-button">
            <Plus className="w-4 h-4" />
            Yeni Adres
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Adreslerim</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 action-button">
            <Plus className="w-4 h-4" />
            Yeni Adres
          </button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Adreslerim</h1>
        <button
          onClick={handleAddAddress}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 action-button"
        >
          <Plus className="w-4 h-4" />
          Yeni Adres
        </button>
      </div>

      {safeAddresses.length === 0 ? (
        <div className="text-center py-12 empty-state">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 empty-state-icon" />
          <p className="text-gray-500 mb-6">Henüz adres eklenmemiş</p>
          <button
            onClick={handleAddAddress}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Yeni Adres Ekle
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {safeAddresses.map((address, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg group-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {address.baslik || "Adres"}
                    </h3>
                    {address.varsayilan_adres && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Varsayılan
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {address.adres_tipi === "ev"
                        ? "Ev"
                        : address.adres_tipi === "is"
                        ? "İş"
                        : "Diğer"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    {address.adres_satiri_1 || "Adres bilgisi bulunamadı"}
                  </p>
                  {address.adres_satiri_2 && (
                    <p className="text-gray-600 text-sm mb-1">
                      {address.adres_satiri_2}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {address.mahalle && `${address.mahalle}, `}
                    {address.ilce && `${address.ilce}, `}
                    {address.il && address.il}
                    {address.posta_kodu && ` ${address.posta_kodu}`}
                  </p>
                  {address.ulke && (
                    <p className="text-gray-500 text-sm mt-1">
                      🌍 {address.ulke}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!address.varsayilan_adres && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Varsayılan Yap"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors edit-button"
                    title="Düzenle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Sil"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Adres Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddress}
        address={editingAddress}
        isEditing={isEditing}
      />
    </div>
  );
};

const ReviewsContent = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  const fetchReviews = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Kullanıcı ID'sini al
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Kullanıcı ID bulunamadı");
        setIsLoading(false);
        return;
      }

      // İki API'yi paralel olarak çağır - POST ile kullanıcı ID'si gönder
      const [productReviewsResponse, sellerReviewsResponse] = await Promise.all(
        [
          // Ürün değerlendirmeleri
          axios
            .post(
              "https://imecehub.com/api/products/urunyorum/takeproductcommentsforuser/",
              { kullanici_id: userId },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            )
            .catch((err) => {
              console.log(
                "Ürün değerlendirmeleri POST hatası:",
                err.response?.data || err.message
              );
              return { data: { durum: "HATA", yorumlar: [] } };
            }),
          // Satıcı değerlendirmeleri
          axios
            .post(
              "https://imecehub.com/api/products/urunyorum/takesellercommentsforuser/",
              { kullanici_id: userId },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            )
            .catch((err) => {
              console.log(
                "Satıcı değerlendirmeleri POST hatası:",
                err.response?.data || err.message
              );
              return { data: { durum: "HATA", yorumlar: [] } };
            }),
        ]
      );

      // İki API'den gelen verileri birleştir
      // API yanıtı {durum: 'BASARILI', yorumlar: []} formatında geliyor
      const productReviewsData = productReviewsResponse.data || {};
      const sellerReviewsData = sellerReviewsResponse.data || {};

      // yorumlar array'ini al, yoksa boş array
      const productReviews = productReviewsData.yorumlar || [];
      const sellerReviews = sellerReviewsData.yorumlar || [];

      // API yanıtlarını console'a yazdır
      console.log("Ürün değerlendirmeleri yanıtı:", productReviewsData);
      console.log("Satıcı değerlendirmeleri yanıtı:", sellerReviewsData);

      // Her iki tür değerlendirmeyi birleştir ve tip bilgisi ekle
      const allReviews = [
        ...productReviews.map((review) => ({ ...review, type: "product" })),
        ...sellerReviews.map((review) => ({ ...review, type: "seller" })),
      ];

      console.log("Birleştirilmiş değerlendirmeler:", allReviews);
      setReviews(allReviews);
      setError(null); // Başarılı yanıt için hata yok
    } catch (err) {
      console.error("Değerlendirmeler alınırken hata:", err);
      setError("Değerlendirmeler alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Değerlendirmelerim
        </h1>
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Değerlendirmelerim
        </h1>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Değerlendirmelerim
      </h1>

      {reviews.length === 0 ? (
        <div className="text-center py-12 empty-state">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4 empty-state-icon" />
          <p className="text-gray-500">Değerlendirme yok</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg group-card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Ürün Fotoğrafı */}
                {review.urun_kapak_gorseli && (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={review.urun_kapak_gorseli}
                      alt={review.urun_adi || "Ürün"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {review.urun_adi || "Ürün"}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.type === "product"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {review.type === "product" ? "Ürün" : "Satıcı"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (review.puan || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.puan || 0}/5
                      </span>
                    </div>
                  </div>

                  {review.yorum && (
                    <p className="text-gray-700 mb-3">{review.yorum}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      {review.satici_adi && (
                        <span>Satıcı: {review.satici_adi}</span>
                      )}
                      {review.tarih && (
                        <span>
                          {new Date(review.tarih).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                    </div>
                    {review.siparis_id && (
                      <span className="text-blue-600">
                        Sipariş #{review.siparis_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SettingsContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Ayarlar</h1>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg settings-item">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium">Bildirimler</p>
            <p className="text-sm text-gray-500">Bildirim ayarlarını yönetin</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg settings-item">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium">Alışveriş Tercihleri</p>
            <p className="text-sm text-gray-500">
              Alışveriş ayarlarınızı düzenleyin
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  </div>
);
