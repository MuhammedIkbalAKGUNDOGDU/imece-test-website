import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiKey } from "../../config";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookieManager";

const ItemCard4 = ({ data, isFavorite, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const token = getCookie("accessToken");
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Kartın genel tıklamasını engeller
    onFavoriteToggle(data.urun_id || data.id);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/sepet-ekle/",
        {
          miktar: 1,
          urun_id: data.urun_id || data.id,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      alert("Ürün sepete eklendi!");
      console.log("Sepet yanıtı:", response.data);
    } catch (error) {
      console.error("Sepete ekleme başarısız:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  const renderStars = (rating = 0) => {
    let stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-lg" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-lg" />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <FaRegStar key={stars.length} className="text-yellow-400 text-lg" />
      );
    }

    return stars;
  };

  // Adresleri çek
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;

      try {
        setIsLoadingAddresses(true);
        const response = await axios.get(
          "https://imecehub.com/users/list-addresses/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        let addressesData = response.data;

        if (typeof response.data === "string") {
          try {
            addressesData = JSON.parse(response.data);
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return;
          }
        }

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

        if (!Array.isArray(addressesData)) {
          addressesData = [];
        }

        setAddresses(addressesData);

        if (addressesData.length > 0 && !selectedAddressId) {
          const defaultAddress =
            addressesData.find((addr) => addr.varsayilan_adres) ||
            addressesData[0];
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (err) {
        console.error("Adres verileri alınırken hata:", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [token]);

  const handleClick = () => {
    navigate("/order-page", { state: { product: data } });
  };

  const joinGroup = async (e) => {
    e.stopPropagation();
    
    // Eğer adres yoksa uyarı göster
    if (addresses.length === 0) {
      alert("Gruba katılmak için önce bir adres eklemeniz gerekiyor.");
      return;
    }

    // Her zaman adres seçim modalını aç
    setShowAddressModal(true);
  };

  const joinGroupWithAddress = async (addressId) => {
    try {
      // Önce grup bilgisini al
      const groupInfoResponse = await axios.post(
        "https://imecehub.com/products/groups/getGroupInfoByProduct/",
        {
          urun_id: data.urun_id || data.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const groupInfo = groupInfoResponse.data;

      // Gruba katıl
      const response = await axios.post(
        "https://imecehub.com/products/groups/join/",
        {
          group_id: groupInfo?.group_id,
          amount: 1,
          address_id: addressId,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Gruba başarıyla katıldınız!");
      console.log("Grup yanıtı:", response.data);
      setShowAddressModal(false);
    } catch (error) {
      console.error("Gruba katılım başarısız:", error.response?.data || error);
      
      // Hata mesajını kontrol et ve kullanıcıya göster
      const errorData = error.response?.data;
      let errorMessage = "Gruba katılırken bir hata oluştu.";
      
      if (errorData) {
        // error alanı varsa onu kullan
        if (errorData.error) {
          errorMessage = errorData.error;
        } 
        // mesaj alanı varsa onu kullan
        else if (errorData.mesaj) {
          errorMessage = errorData.mesaj;
        }
        // detail alanı varsa onu kullan
        else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        // message alanı varsa onu kullan
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowAddressModal(false);
    // Adres seçildikten sonra otomatik katıl
    joinGroupWithAddress(addressId);
  };

  // Adres formatını oluştur
  const formatAddress = (address) => {
    if (!address) return "Adres bulunamadı";

    const parts = [];
    if (address.adres_satiri_1) parts.push(address.adres_satiri_1);
    if (address.adres_satiri_2) parts.push(address.adres_satiri_2);
    if (address.mahalle) parts.push(address.mahalle);
    if (address.ilce) parts.push(address.ilce);
    if (address.il) parts.push(address.il);
    if (address.posta_kodu) parts.push(address.posta_kodu);
    if (address.ulke) parts.push(address.ulke);

    return parts.join(", ");
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg sm:rounded-2xl shadow p-2 sm:p-4 w-[160px] sm:w-[220px] h-[260px] sm:h-[380px] flex flex-col cursor-pointer"
    >
      <div className="w-full h-28 sm:h-44 bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
        <img
          src={data.kapak_gorseli}
          alt={data.urun_adi}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-2 sm:mt-3 flex flex-col flex-grow">
        <div className="relative group">
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 line-clamp-1">
            {data.urun_adi}
          </h3>
          <h2 className="text-xs sm:text-md font-bold text-gray-900 line-clamp-1">
            {data.urun_perakende_fiyati} TL
          </h2>
          {data.urun_adi.length > 15 && (
            <div className="absolute hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-20 left-0 top-full mt-1 w-full border border-gray-200">
              {data.urun_adi}
            </div>
          )}
        </div>
        <div className="flex items-center mt-0.5 sm:mt-1 space-x-0.5">
          {renderStars(data.degerlendirme_puani)}
        </div>
        <div className="relative group">
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 leading-tight line-clamp-2 sm:line-clamp-3">
            {data.aciklama}
          </p>
          {data.aciklama.length > 50 && (
            <div className="absolute hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-20 left-0 top-full mt-1 w-full border border-gray-200">
              {data.aciklama}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2">
        <button
          onClick={(e) => {
            if (data.satis_turu === 1) {
              handleAddToCart(e);
            } else if (data.satis_turu === 2) {
              joinGroup(e);
            }
          }}
          className={`flex-grow text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium ${
            data.satis_turu === 1
              ? "bg-green-600"
              : data.satis_turu === 2
              ? "bg-[#ff7a00]"
              : "bg-gray-500"
          }`}
        >
          {data.satis_turu === 1
            ? "Sepete Ekle"
            : data.satis_turu === 2
            ? "Gruba Katıl"
            : "İşlem"}
        </button>
        <button onClick={handleFavoriteClick} className="p-1.5 text-red-500">
          {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>
      </div>

      {/* Adres Seçim Modalı */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Teslimat Adresi Seçin</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            {isLoadingAddresses ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Adresler yükleniyor...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Henüz adres eklenmemiş. Lütfen önce bir adres ekleyin.
                </p>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    navigate("/profile");
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Profil Sayfasına Git
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedAddressId === address.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => handleAddressSelect(address.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-lg">
                        {address.baslik || "Adres"}
                      </h5>
                      {address.varsayilan_adres && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatAddress(address)}
                    </p>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {address.adres_tipi === "ev"
                        ? "Ev"
                        : address.adres_tipi === "is"
                        ? "İş"
                        : "Diğer"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard4;
