/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  Wallet,
  Headphones,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [buyerData, setBuyerData] = useState(null);
  const [currentMenu, setCurrentMenu] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    telno: "",
    // Seller fields
    magaza_adi: "",
    satici_vergi_numarasi: "",
    satici_iban: "",
    profession: "",
    profil_tanitim_yazisi: "",
    // Buyer fields
    cinsiyet: "",
    adres: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bannerPhoto, setBannerPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
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
      id: "balance",
      label: "Bakiye Yükle",
      icon: Wallet,
      color: "text-indigo-600",
    },
    {
      id: "support",
      label: "Müşteri Hizmetleri",
      icon: Headphones,
      color: "text-pink-600",
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
        
        // Kullanıcı bilgilerini çek
        const userResponse = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });
        setUserData(userResponse.data);
        
        // Rol kontrolü yap ve ilgili profil bilgilerini çek
        const userRole = userResponse.data?.rol;
        
        if (userRole === "satici") {
          // Satıcı profil bilgilerini çek
          try {
            const sellerResponse = await axios.get(
              "https://imecehub.com/api/users/kullanicilar/satici_profili/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            setSellerData(sellerResponse.data);
          } catch (sellerErr) {
            console.error("Satıcı profil bilgileri alınamadı:", sellerErr);
            // Satıcı profil bilgileri alınamazsa devam et
          }
        } else if (userRole === "alici") {
          // Alıcı profil bilgilerini çek
          try {
            const buyerResponse = await axios.get(
              "https://imecehub.com/api/users/kullanicilar/alici_profili/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            setBuyerData(buyerResponse.data);
          } catch (buyerErr) {
            console.error("Alıcı profil bilgileri alınamadı:", buyerErr);
            // Alıcı profil bilgileri alınamazsa devam et
          }
        }
        
        setPhotoError(false);
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
    const isSeller = userData?.rol === "satici";
    const isBuyer = userData?.rol === "alici";
    
    setEditProfileForm({
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      email: userData?.email || "",
      telno: userData?.telno || "",
      // Seller fields
      magaza_adi: isSeller ? (sellerData?.magaza_adi || "") : "",
      satici_vergi_numarasi: isSeller ? (sellerData?.satici_vergi_numarasi || "") : "",
      satici_iban: isSeller ? (sellerData?.satici_iban || "") : "",
      profession: isSeller ? (sellerData?.profession || "") : "",
      profil_tanitim_yazisi: isSeller ? (sellerData?.profil_tanitim_yazisi || "") : "",
      // Buyer fields
      cinsiyet: isBuyer ? (buyerData?.cinsiyet || "") : "",
      adres: isBuyer ? (buyerData?.adres || "") : "",
    });
    setPhotoPreview(userData?.profil_fotograf || null);
    setBannerPreview(isSeller ? (sellerData?.profil_banner || null) : null);
    setProfilePhoto(null);
    setBannerPhoto(null);
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

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
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
      const userRole = userData?.rol;
      
      if (!userRole) {
        alert("Rol bilgisi bulunamadı.");
        return;
      }

      const formData = new FormData();
      formData.append("profil_fotograf", "");

      // Rol bazlı endpoint seçimi
      let endpoint;
      if (userRole === "satici") {
        endpoint = "https://imecehub.com/api/users/kullanicilar/update_satici_profili/";
      } else if (userRole === "alici") {
        endpoint = "https://imecehub.com/api/users/kullanicilar/update_alici_profili/";
      } else {
        alert("Geçersiz rol.");
        return;
      }

      const response = await axios.patch(endpoint, formData, {
        headers: {
          "X-API-Key": apiKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data) {
        // State'leri temizle
        setProfilePhoto(null);
        setPhotoPreview(null);

        // Yeni response formatına göre verileri güncelle
        if (response.data.data) {
          if (response.data.data.kullanici) {
            setUserData(response.data.data.kullanici);
          }
          if (userRole === "satici" && response.data.data.satici) {
            setSellerData(response.data.data.satici);
          } else if (userRole === "alici" && response.data.data.alici) {
            setBuyerData(response.data.data.alici);
          }
        } else {
          // Fallback: API'den tekrar çek
          const userResponse = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          });
          setUserData(userResponse.data);
          
          if (userRole === "satici") {
            const sellerResponse = await axios.get(
              "https://imecehub.com/api/users/kullanicilar/satici_profili/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            setSellerData(sellerResponse.data);
          } else if (userRole === "alici") {
            const buyerResponse = await axios.get(
              "https://imecehub.com/api/users/kullanicilar/alici_profili/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            setBuyerData(buyerResponse.data);
          }
        }
        
        setPhotoError(false);
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
      const userRole = userData?.rol;
      
      if (!userRole) {
        alert("Rol bilgisi bulunamadı.");
        setIsUpdatingProfile(false);
        return;
      }

      const headers = {
        "X-API-Key": apiKey,
        Authorization: `Bearer ${accessToken}`,
        // Content-Type header'ı FormData kullanıldığında otomatik ayarlanır
      };

      // FormData oluştur (multipart/form-data için)
      const formData = new FormData();

      // Kullanıcı bilgileri (ortak)
      if (editProfileForm.first_name)
        formData.append("first_name", editProfileForm.first_name);
      if (editProfileForm.last_name)
        formData.append("last_name", editProfileForm.last_name);
      if (editProfileForm.telno)
        formData.append("telno", editProfileForm.telno);

      // Profil fotoğrafı varsa ekle
      if (profilePhoto) {
        formData.append("profil_fotograf", profilePhoto);
      }

      // Rol bazlı alanlar
      if (userRole === "satici") {
        // Seller fields
        if (editProfileForm.magaza_adi)
          formData.append("magaza_adi", editProfileForm.magaza_adi);
        if (editProfileForm.satici_vergi_numarasi)
          formData.append("satici_vergi_numarasi", editProfileForm.satici_vergi_numarasi);
        if (editProfileForm.satici_iban)
          formData.append("satici_iban", editProfileForm.satici_iban);
        if (editProfileForm.profession)
          formData.append("profession", editProfileForm.profession);
        if (editProfileForm.profil_tanitim_yazisi)
          formData.append("profil_tanitim_yazisi", editProfileForm.profil_tanitim_yazisi);
        
        // Banner fotoğrafı varsa ekle
        if (bannerPhoto) {
          formData.append("profil_banner", bannerPhoto);
        }
      } else if (userRole === "alici") {
        // Buyer fields
        if (editProfileForm.cinsiyet)
          formData.append("cinsiyet", editProfileForm.cinsiyet);
        if (editProfileForm.adres)
          formData.append("adres", editProfileForm.adres);
      }

      // Rol bazlı endpoint seçimi
      let endpoint;
      if (userRole === "satici") {
        endpoint = "https://imecehub.com/api/users/kullanicilar/update_satici_profili/";
      } else if (userRole === "alici") {
        endpoint = "https://imecehub.com/api/users/kullanicilar/update_alici_profili/";
      } else {
        alert("Geçersiz rol.");
        setIsUpdatingProfile(false);
        return;
      }

      const response = await axios.patch(endpoint, formData, { headers });

      console.log("Profil güncelleme yanıtı:", response.data);

      if (response.data) {
        const successMessage = response.data.message || "Profil başarıyla güncellendi.";
        alert(successMessage);
        
        // Yeni response formatına göre verileri güncelle
        if (response.data.data) {
          if (response.data.data.kullanici) {
            setUserData(response.data.data.kullanici);
          }
          if (userRole === "satici" && response.data.data.satici) {
            setSellerData(response.data.data.satici);
          } else if (userRole === "alici" && response.data.data.alici) {
            setBuyerData(response.data.data.alici);
          }
        } else {
          // Fallback: API'den tekrar çek
          const userResponse = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          });
          setUserData(userResponse.data);
          
          if (userRole === "satici") {
            const sellerResponse = await axios.get(
              "https://imecehub.com/api/users/kullanicilar/satici_profili/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            setSellerData(sellerResponse.data);
          } else if (userRole === "alici") {
            const buyerResponse = await axios.get(
              "https://imecehub.com/api/users/kullanicilar/alici_profili/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-API-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            setBuyerData(buyerResponse.data);
          }
        }
        
        setPhotoError(false);
        setShowEditProfileModal(false);
      }
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      console.error("Hata detayı:", error.response?.data);
      
      let errorMessage = "Profil güncellenirken bir hata oluştu.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Validation hatalarını göster
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map(key => 
          `${key}: ${errors[key].join(", ")}`
        ).join("\n");
        errorMessage = `Güncelleme hataları:\n${errorList}`;
      }
      
      alert(errorMessage);
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
      case "balance":
        return (
          <BalanceContent
            user={userData}
            setUserData={setUserData}
            accessToken={accessToken}
          />
        );
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
                  
                  // Müşteri Hizmetleri için özel yönlendirme
                  if (item.id === "support") {
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate("/support")}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-50 ${
                          currentMenu === item.id
                            ? "bg-gray-100"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${item.color}`} />
                          <span className="text-gray-700">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  }
                  
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

                {/* E-posta - Güncellenemez */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta <span className="text-gray-400 text-xs">(Değiştirilemez)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editProfileForm.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
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

                {/* Seller Fields */}
                {userData?.rol === "satici" && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Satıcı Bilgileri</h3>
                    </div>

                    {/* Mağaza Adı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mağaza Adı
                      </label>
                      <input
                        type="text"
                        name="magaza_adi"
                        value={editProfileForm.magaza_adi}
                        onChange={handleEditProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Mağaza adınızı girin"
                      />
                    </div>

                    {/* Vergi Numarası */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vergi Numarası
                      </label>
                      <input
                        type="text"
                        name="satici_vergi_numarasi"
                        value={editProfileForm.satici_vergi_numarasi}
                        onChange={handleEditProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Vergi numaranızı girin"
                      />
                    </div>

                    {/* IBAN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IBAN
                      </label>
                      <input
                        type="text"
                        name="satici_iban"
                        value={editProfileForm.satici_iban}
                        onChange={handleEditProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="TR330006100519786457841326"
                      />
                    </div>

                    {/* Profession */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meslek
                      </label>
                      <input
                        type="text"
                        name="profession"
                        value={editProfileForm.profession}
                        onChange={handleEditProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Mesleğinizi girin"
                      />
                    </div>

                    {/* Profil Tanıtım Yazısı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profil Tanıtım Yazısı
                      </label>
                      <textarea
                        name="profil_tanitim_yazisi"
                        value={editProfileForm.profil_tanitim_yazisi}
                        onChange={handleEditProfileInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        placeholder="Kendinizi ve mağazanızı tanıtın..."
                      />
                    </div>

                    {/* Banner Fotoğrafı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Fotoğrafı
                      </label>
                      {bannerPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={bannerPreview}
                            alt="Banner fotoğrafı"
                            className="w-full h-48 rounded-lg object-cover border-4 border-green-100"
                          />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-0 hover:bg-opacity-50 rounded-lg transition-all duration-200 group">
                            <label
                              htmlFor="banner-photo-change"
                              className="opacity-0 group-hover:opacity-100 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
                              title="Banner'ı Değiştir"
                            >
                              <Upload className="w-4 h-4" />
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBannerChange}
                              className="hidden"
                              id="banner-photo-change"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-2">
                            Banner fotoğrafı yükleyin
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerChange}
                            className="hidden"
                            id="banner-photo-upload"
                          />
                          <label
                            htmlFor="banner-photo-upload"
                            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
                          >
                            Banner Seç
                          </label>
                        </div>
                      )}
                      {bannerPhoto && (
                        <p className="text-sm text-gray-500 mt-2">
                          Yeni banner: {bannerPhoto.name}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Buyer Fields */}
                {userData?.rol === "alici" && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Alıcı Bilgileri</h3>
                    </div>

                    {/* Cinsiyet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cinsiyet
                      </label>
                      <select
                        name="cinsiyet"
                        value={editProfileForm.cinsiyet}
                        onChange={handleEditProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Seçiniz</option>
                        <option value="erkek">Erkek</option>
                        <option value="kadın">Kadın</option>
                        <option value="diğer">Diğer</option>
                      </select>
                    </div>

                    {/* Adres */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres
                      </label>
                      <textarea
                        name="adres"
                        value={editProfileForm.adres}
                        onChange={handleEditProfileInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        placeholder="Adresinizi girin"
                      />
                    </div>
                  </>
                )}
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
          await axios.post(
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

  const formatSeconds = (seconds) => {
    const s = Number(seconds);
    if (!Number.isFinite(s) || s <= 0) return "0 sn";
    const total = Math.floor(s);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const mins = Math.floor((total % 3600) / 60);

    const parts = [];
    if (days) parts.push(`${days} gün`);
    if (hours || days) parts.push(`${hours} saat`);
    parts.push(`${mins} dk`);
    return parts.join(" ");
  };

  const formatDateTimeTR = (isoString) => {
    if (!isoString) return "-";
    const dt = new Date(isoString);
    if (Number.isNaN(dt.getTime())) return String(isoString);
    return dt.toLocaleString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                  {(group.starts_in_seconds != null ||
                    group.remaining_seconds != null ||
                    group.group_start_time ||
                    group.group_end_time) && (
                    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {group.starts_in_seconds != null &&
                        Number(group.starts_in_seconds) > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                            Yakında başlıyor
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">
                            Aktif
                          </span>
                        )}

                        {group.starts_in_seconds != null &&
                          Number(group.starts_in_seconds) > 0 && (
                            <span className="text-xs text-gray-700">
                              Başlamasına{" "}
                              <span className="font-semibold text-blue-700">
                                {formatSeconds(group.starts_in_seconds)}
                              </span>
                            </span>
                          )}

                        {!(group.starts_in_seconds != null &&
                          Number(group.starts_in_seconds) > 0) &&
                          group.remaining_seconds != null && (
                            <span className="text-xs text-gray-700">
                              Kapanmasına{" "}
                              <span className="font-semibold text-orange-700">
                                {formatSeconds(group.remaining_seconds)}
                              </span>
                            </span>
                          )}
                      </div>

                      {(group.group_start_time || group.group_end_time) && (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                          {group.group_start_time && (
                            <div className="flex items-center justify-between rounded-md bg-white border border-gray-200 px-2 py-1">
                              <span>Başlangıç</span>
                              <span className="font-medium text-gray-800">
                                {formatDateTimeTR(group.group_start_time)}
                              </span>
                            </div>
                          )}
                          {group.group_end_time && (
                            <div className="flex items-center justify-between rounded-md bg-white border border-gray-200 px-2 py-1">
                              <span>Bitiş</span>
                              <span className="font-medium text-gray-800">
                                {formatDateTimeTR(group.group_end_time)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
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

const BalanceContent = ({ user, setUserData, accessToken }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [topupId, setTopupId] = useState(null);
  const [topupStatus, setTopupStatus] = useState(null);
  const [topupMessage, setTopupMessage] = useState(null);
  const [topupError, setTopupError] = useState(null);
  const [pollingTopupId, setPollingTopupId] = useState(null);

  const [threeDSecureUrl, setThreeDSecureUrl] = useState(null);
  const [threeDSecureHtml, setThreeDSecureHtml] = useState(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const [cardInfo, setCardInfo] = useState({
    card_holder_name: "",
    card_number: "",
    expire_month: "",
    expire_year: "",
    cvc_number: "",
  });

  const presetAmounts = [50, 100, 250, 500, 1000];

  const getSelectedAmount = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amount || Number.isNaN(amount) || amount <= 0) return null;
    return amount;
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!Number.isNaN(Number(value)) && parseFloat(value) > 0)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const resetTopupUi = () => {
    setIsInitiating(false);
    setTopupId(null);
    setTopupStatus(null);
    setTopupMessage(null);
    setTopupError(null);
    setThreeDSecureUrl(null);
    setThreeDSecureHtml(null);
    setPopupBlocked(false);
  };

  const closeTopupModal = () => {
    // İşlem devam ediyorsa modal kapansa bile id localStorage'da kalır ve kullanıcı geri gelince devam edebilir.
    setIsTopupModalOpen(false);
    resetTopupUi();
    setCardInfo({
      card_holder_name: "",
      card_number: "",
      expire_month: "",
      expire_year: "",
      cvc_number: "",
    });
  };

  // Daha önce başlatılmış bir topup varsa (sayfa yenileme vb.) devam et
  useEffect(() => {
    const saved = localStorage.getItem("pending_wallet_topup_id");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!Number.isNaN(parsed)) {
        setTopupId(parsed);
        setPollingTopupId(parsed);
        setIsTopupModalOpen(true);
        setTopupMessage("Bakiye yükleme işlemi devam ediyor. Durum kontrol ediliyor...");
      }
    }
  }, []);

  // Status polling
  useEffect(() => {
    if (!pollingTopupId || !accessToken) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const response = await axios.get(
          `https://imecehub.com/api/payment/wallet/topup/status/?topup_id=${pollingTopupId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        if (cancelled) return;

        const status = response.data?.status || null;
        setTopupStatus(status);

        // Bakiye bilgisi geldiyse UI'ı güncelle
        if (response.data?.bakiye != null) {
          setUserData((prev) =>
            prev ? { ...prev, bakiye: response.data.bakiye } : prev
          );
        }

        if (status === "SUCCESS") {
          localStorage.removeItem("pending_wallet_topup_id");
          setPollingTopupId(null);
          setTopupMessage("Bakiye başarıyla yüklendi.");
          setTopupError(null);
        } else if (status && ["FAILED", "CANCELLED", "ERROR"].includes(status)) {
          localStorage.removeItem("pending_wallet_topup_id");
          setPollingTopupId(null);
          setTopupError("Bakiye yükleme işlemi başarısız oldu.");
        } else {
          // INITIATED / 3D_PENDING vb
          if (!topupMessage) {
            setTopupMessage("İşlem devam ediyor, lütfen bekleyin...");
          }
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Topup status hatası:", err);
      }
    };

    poll();
    const interval = setInterval(poll, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pollingTopupId, accessToken, setUserData, topupMessage]);

  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;

    if (name === "card_number") {
      const rawValue = value.replace(/\D/g, "");
      const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardInfo((prev) => ({ ...prev, [name]: formattedValue.slice(0, 19) }));
      return;
    }

    if (name === "expire_month" || name === "expire_year") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 2);
      setCardInfo((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    if (name === "cvc_number") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 3);
      setCardInfo((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateCard = () => {
    if (!cardInfo.card_holder_name?.trim()) return "Kart üzerindeki isim zorunludur.";
    if (!cardInfo.card_number?.trim()) return "Kart numarası zorunludur.";

    const cleanedCard = cardInfo.card_number.replace(/\s/g, "");
    if (cleanedCard.length < 12) return "Kart numarası geçersiz görünüyor.";

    if (!/^\d{2}$/.test(cardInfo.expire_month)) return "Ay 2 hane olmalıdır (MM).";
    const monthNum = parseInt(cardInfo.expire_month, 10);
    if (Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12)
      return "Ay 01-12 arasında olmalıdır (MM).";

    if (!/^\d{2}$/.test(cardInfo.expire_year)) return "Yıl 2 hane olmalıdır (YY).";
    if (!/^\d{3}$/.test(cardInfo.cvc_number)) return "CVC 3 hane olmalıdır.";

    return null;
  };

  const toFourDigitYear = (yy) => {
    // "25" -> "2025" (mevcut yüzyılı baz alır)
    if (!yy) return yy;
    if (yy.length === 4) return yy;
    if (yy.length !== 2) return yy;
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    return String(currentCentury + parseInt(yy, 10));
  };

  const handleOpenTopupModal = () => {
    const amount = getSelectedAmount();
    if (!amount) {
      setTopupError("Lütfen bir tutar seçin veya girin.");
      return;
    }
    setTopupError(null);
    setTopupMessage(null);
    setIsTopupModalOpen(true);
  };

  const handleInitiateTopup = async () => {
    setTopupError(null);
    setTopupMessage(null);

    const amount = getSelectedAmount();
    if (!amount) {
      setTopupError("Lütfen bir tutar seçin veya girin.");
      return;
    }

    const cardError = validateCard();
    if (cardError) {
      setTopupError(cardError);
      return;
    }

    if (!accessToken) {
      setTopupError("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    // Popup'ı kullanıcı aksiyonuyla (senkron) açmaya çalış — bloklanmayı azaltır
    const topupWindow = window.open("", "_blank", "noopener,noreferrer");
    setPopupBlocked(!topupWindow);

    setIsInitiating(true);

    try {
      const cardNumber = cardInfo.card_number.replace(/\s/g, "");
      const expMonth = cardInfo.expire_month.padStart(2, "0");
      const expYear = toFourDigitYear(cardInfo.expire_year);

      const payload = {
        amount: amount.toFixed(2),
        PaymentDealerRequest: {
          CardHolderFullName: cardInfo.card_holder_name,
          CardNumber: cardNumber,
          ExpMonth: expMonth,
          ExpYear: expYear,
          CvcNumber: cardInfo.cvc_number,
          Currency: "TL",
          InstallmentNumber: "1",
          BuyerInformation: {
            BuyerFullName: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
            BuyerGsmNumber: user?.telno || "",
            BuyerEmail: user?.email || "",
            BuyerCountry: "TR",
          },
        },
      };

      const response = await axios.post(
        "https://imecehub.com/api/payment/wallet/topup/initiate/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.durum !== "BASARILI") {
        setTopupError(response.data?.mesaj || "Bakiye yükleme başlatılamadı.");
        if (topupWindow) topupWindow.close();
        return;
      }

      const newTopupId = response.data?.topup_id;
      setTopupId(newTopupId);

      if (newTopupId != null) {
        localStorage.setItem("pending_wallet_topup_id", String(newTopupId));
        setPollingTopupId(newTopupId);
      }

      const url = response.data?.["3d_secure_url"] || null;
      const html = response.data?.["3d_secure_html"] || null;

      setThreeDSecureUrl(url);
      setThreeDSecureHtml(html);

      setTopupMessage(
        response.data?.mesaj ||
          "Bakiye yükleme başlatıldı (3D Secure). Lütfen 3D doğrulamayı tamamlayın."
      );

      if (url) {
        if (topupWindow) {
          topupWindow.location.href = url;
        }
      } else if (html) {
        if (topupWindow) {
          topupWindow.document.open();
          topupWindow.document.write(html);
          topupWindow.document.close();
        }
      } else {
        // 3D gerekmiyorsa status polling sonucu belirleyecek
      }
    } catch (err) {
      console.error("Wallet topup initiate hatası:", err.response?.data || err);
      setTopupError(
        err.response?.data?.mesaj ||
          err.response?.data?.detail ||
          "Bakiye yükleme başlatılırken bir hata oluştu."
      );
    } finally {
      setIsInitiating(false);
    }
  };

  const currentBalanceValue = (() => {
    const val = user?.bakiye;
    const asNumber = typeof val === "string" ? parseFloat(val) : Number(val);
    if (Number.isNaN(asNumber) || asNumber == null) return 0;
    return asNumber;
  })();

  const selectedAmountValue = getSelectedAmount();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bakiye Yükle</h1>

      {/* Mevcut Bakiye Kartı */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Mevcut Bakiyeniz</p>
            <p className="text-3xl font-bold">{currentBalanceValue.toFixed(2)} TL</p>
          </div>
          <Wallet className="w-12 h-12 text-indigo-200" />
        </div>
      </div>

      {/* Tutar Seçimi */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Yüklenecek Tutarı Seçin
        </h2>

        {/* Önceden Belirlenmiş Tutarlar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAmount === amount
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              {amount} TL
            </button>
          ))}
        </div>

        {/* Özel Tutar Girişi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Veya Özel Tutar Girin
          </label>
          <div className="relative">
            <input
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Tutar girin (örn: 150)"
              min="1"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              TL
            </span>
          </div>
        </div>
      </div>

      {topupError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {topupError}
        </div>
      )}

      {/* Yükle Butonu */}
      <button
        onClick={handleOpenTopupModal}
        disabled={!selectedAmount && !customAmount}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
          selectedAmount || customAmount
            ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Bakiye Yükle
      </button>

      {/* Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <p className="text-sm text-gray-500">Bakiye Yükleme</p>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedAmountValue ? `${selectedAmountValue.toFixed(2)} TL` : "-"}
                </h3>
              </div>
              <button
                onClick={closeTopupModal}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Kapat"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {topupId && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Topup ID:</span> {topupId}{" "}
                  {topupStatus && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="font-medium">Durum:</span> {topupStatus}
                    </>
                  )}
                </div>
              )}

              {topupMessage && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  {topupMessage}
                </div>
              )}

              {popupBlocked && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  Tarayıcı pop-up penceresini engellemiş olabilir. Eğer 3D ekranı
                  açılmadıysa, pop-up izni verip tekrar deneyin.
                </div>
              )}

              {/* Kart Formu */}
              {!pollingTopupId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Kart Üzerindeki İsim
                    </label>
                    <input
                      type="text"
                      name="card_holder_name"
                      value={cardInfo.card_holder_name}
                      onChange={handleCardInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Ad Soyad"
                      autoComplete="cc-name"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Kart Numarası
                    </label>
                    <input
                      type="text"
                      name="card_number"
                      value={cardInfo.card_number}
                      onChange={handleCardInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                      autoComplete="cc-number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Son Kullanma Ayı (MM)
                    </label>
                    <input
                      type="text"
                      name="expire_month"
                      value={cardInfo.expire_month}
                      onChange={handleCardInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="MM"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={2}
                      autoComplete="cc-exp-month"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Son Kullanma Yılı (YY)
                    </label>
                    <input
                      type="text"
                      name="expire_year"
                      value={cardInfo.expire_year}
                      onChange={handleCardInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="YY"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={2}
                      autoComplete="cc-exp-year"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      name="cvc_number"
                      value={cardInfo.cvc_number}
                      onChange={handleCardInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="XXX"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={3}
                      autoComplete="cc-csc"
                      required
                    />
                  </div>
                </div>
              )}

              {/* 3D Secure HTML fallback */}
              {threeDSecureHtml && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-700">
                    3D Secure doğrulaması (iframe)
                  </div>
                  <iframe
                    title="3D Secure"
                    className="w-full h-[60vh]"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation-by-user-activation"
                    srcDoc={threeDSecureHtml}
                  />
                </div>
              )}

              {threeDSecureUrl && (
                <div className="text-sm text-gray-600">
                  3D Secure penceresi açılmadıysa şu bağlantıyı kullanabilirsiniz:{" "}
                  <a
                    href={threeDSecureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    3D Secure doğrulamasını aç
                  </a>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeTopupModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Kapat
              </button>

              <div className="flex items-center gap-3">
                {pollingTopupId && (
                  <button
                    type="button"
                    onClick={() => setPollingTopupId(topupId)}
                    className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    Durumu Yenile
                  </button>
                )}
                {!pollingTopupId && (
                  <button
                    type="button"
                    onClick={handleInitiateTopup}
                    disabled={isInitiating}
                    className={`px-5 py-2.5 rounded-lg text-white font-semibold ${
                      isInitiating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isInitiating ? "Başlatılıyor..." : "Ödemeyi Başlat"}
                  </button>
                )}
              </div>
            </div>
          </div>
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
