import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import { apiKey } from "../config";
import "../styles/profile.css";
import AddressModal from "../components/profileComponents/AddressModal";
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
} from "lucide-react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [currentMenu, setCurrentMenu] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setError("Kullanıcı bilgileri alınamadı");
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

  const renderContent = () => {
    switch (currentMenu) {
      case "profile":
        return <ProfileContent user={userData} />;
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
    <div className="min-h-screen bg-gray-50 profile-container">
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 profile-sidebar">
              {/* Kullanıcı Bilgileri */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center user-avatar">
                  <User className="w-10 h-10 text-white" />
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
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 profile-content fade-in">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Alt bileşenler
const ProfileContent = ({ user }) => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Bilgilerim</h1>
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Ad Soyad</p>
          <p className="font-medium">
            {user?.first_name || "Belirtilmemiş"} {user?.last_name || ""}
          </p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 edit-button">
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">E-posta</p>
          <p className="font-medium">{user?.email || "Belirtilmemiş"}</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 edit-button">
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Telefon</p>
          <p className="font-medium">{user?.telno || "Belirtilmemiş"}</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 edit-button">
          <Edit className="w-4 h-4" />
        </button>
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
        <button className="p-2 text-gray-400 hover:text-gray-600 edit-button">
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg profile-card">
        <div>
          <p className="text-sm text-gray-500">Bakiye</p>
          <p className="font-medium">
            {user?.bakiye ? `${user.bakiye}₺` : "0₺"}
          </p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 edit-button">
          <Edit className="w-4 h-4" />
        </button>
      </div>

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
        <button className="p-2 text-gray-400 hover:text-gray-600 edit-button">
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const OrdersContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h1>
    <div className="text-center py-12 empty-state">
      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 empty-state-icon" />
      <p className="text-gray-500">Henüz siparişiniz bulunmuyor</p>
    </div>
  </div>
);

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

  const fetchAddresses = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://imecehub.com/api/logistics/adres/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      setAddresses(response.data);
    } catch (err) {
      console.error("Adres verileri alınırken hata:", err);
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
    if (window.confirm("Bu adresi silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(
          `https://imecehub.com/api/logistics/adres/${addressId}/`,
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
      } catch (err) {
        console.error("Adres silme hatası:", err);
        alert("Adres silinirken bir hata oluştu");
      }
    }
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (isEditing && editingAddress) {
        // Güncelleme - PUT metodu
        await axios.put(
          `https://imecehub.com/api/logistics/adres/${editingAddress.id}/`,
          formData,
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
        await axios.post(
          "https://imecehub.com/api/logistics/adres/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Modal'ı kapat ve listeyi yenile
      setIsModalOpen(false);
      setEditingAddress(null);
      setIsEditing(false);
      fetchAddresses();
    } catch (err) {
      console.error("Adres kaydetme hatası:", err);
      alert("Adres kaydedilirken bir hata oluştu");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setIsEditing(false);
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

      {addresses.length === 0 ? (
        <div className="text-center py-12 empty-state">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4 empty-state-icon" />
          <p className="text-gray-500">Henüz adres eklenmemiş</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg group-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {address.adres_adi || "Adres"}
                    </h3>
                    {address.varsayilan && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Varsayılan
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    {address.adres || "Adres bilgisi bulunamadı"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {address.mahalle && `${address.mahalle}, `}
                    {address.ilce && `${address.ilce}, `}
                    {address.sehir && address.sehir}
                  </p>
                  {address.telefon && (
                    <p className="text-gray-500 text-sm mt-1">
                      📞 {address.telefon}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
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

const ReviewsContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800 mb-6">
      Değerlendirmelerim
    </h1>
    <div className="text-center py-12 empty-state">
      <Star className="w-16 h-16 text-gray-400 mx-auto mb-4 empty-state-icon" />
      <p className="text-gray-500">Henüz değerlendirmeniz bulunmuyor</p>
    </div>
  </div>
);

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
