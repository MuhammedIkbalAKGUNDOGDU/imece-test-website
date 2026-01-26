import React, { useState } from "react";
import Header from "../components/GenerealUse/Header";
import "../styles/orderPage.css";
import { FaLongArrowAltRight, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import productsimg from "../assets/images/productPageImg.png";
import profilfoto from "../assets/images/profilfoto.png";
import { useEffect } from "react";
import { FaAward } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate import edildi
import ItemCard from "../components/GenerealUse/itemCard2";
import axios from "axios";
import { apiKey } from "../config"; // veya "../constants" dosya ismine göre
import Comments from "../components/GenerealUse/Comments";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieManager";
const orderPage = () => {
  const navigate = useNavigate(); // Yönlendirme için useNavigate kullanıldı
  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerProducts, setSellerProducts] = useState(null);
  const location = useLocation();
  const product = location.state?.product;
  const [groupInfo, setGroupInfo] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // Yeni eklendi
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const id = parseInt(getCookie("userId"), 10);

  const token = getCookie("accessToken");
  const [productComments, setProductComments] = useState([]);

  const getImageUrl = (item) => {
    if (!item || typeof item !== "object") return null;
    return (
      item.image ||
      item.image_url ||
      item.resim ||
      item.resim_url ||
      item.url ||
      item.file ||
      item.fotograf ||
      item.gorsel ||
      item.urun_image ||
      null
    );
  };

  useEffect(() => {
    const fetchProductImages = async () => {
      if (!product?.urun_id) return;

      setIsImagesLoading(true);
      try {
        const res = await axios.get("https://imecehub.com/api/products/urunimage/", {
          params: { urun_id: product.urun_id },
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });

        let items = res.data;
        if (items && typeof items === "object" && !Array.isArray(items)) {
          items = items.results || items.data || items.images || items.urunler || items.urun_images || items;
        }
        if (!Array.isArray(items)) items = [];

        const urls = items.map(getImageUrl).filter(Boolean);

        // Kapak görseli her zaman ilk sırada olsun
        const cover = product?.kapak_gorseli || product?.resim_url || null;
        const merged = [
          ...(cover ? [cover] : []),
          ...urls.filter((u) => u !== cover),
        ];

        // uniq
        const unique = Array.from(new Set(merged));
        setProductImages(unique);
        setSelectedImageUrl((prev) => prev || unique[0] || cover);
      } catch (err) {
        console.error("Ürün görselleri alınamadı:", err);
        const cover = product?.kapak_gorseli || product?.resim_url || null;
        setProductImages(cover ? [cover] : []);
        setSelectedImageUrl(cover);
      } finally {
        setIsImagesLoading(false);
      }
    };

    fetchProductImages();
  }, [product?.urun_id]);

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

  useEffect(() => {
    const fetchProductComments = async () => {
      try {
        const response = await axios.post(
          "https://imecehub.com/api/products/urunyorum/takecommentsforproduct/",
          {
            urun_id: product?.urun_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-API-Key": apiKey,
            },
          }
        );
        setProductComments(response.data);
        console.log("Yorumlar:", response.data);
      } catch (error) {
        console.error("Yorumlar alınamadı:", error);
      }
    };

    if (product?.urun_id) {
      fetchProductComments();
    }
  }, [product]);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.post(
          "https://imecehub.com/products/groups/getGroupInfoByProduct/",

          {
            urun_id: product.urun_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setGroupInfo(response.data);
        console.log("Grup Bilgisi:", response.data);
      } catch (error) {
        console.error("Grup bilgisi alınamadı:", error);
      }
    };

    if (product?.urun_id && product?.satis_turu === 2) {
      fetchGroupInfo();
    }
  }, [product]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        console.log(product.satici);
        const response = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-info/",
          data: {
            kullanici_id: product.satici,
          },
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        });
        setSellerInfo(response.data);
      } catch (error) {
        console.error("Satıcı bilgileri alınamadı:", error);
      }
    };

    fetchSellerInfo();
  }, []);

  console.log(product);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-products/",
          data: {
            kullanici_id: product.satici,
          },
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        });
        setSellerProducts(response.data);
      } catch (error) {
        console.error("Satıcı bilgileri alınamadı:", error);
      }
    };

    fetchSellerProducts();
  }, []);

  useEffect(() => {
    // Sayfanın en üstüne kaydır
    window.scrollTo(0, 0);
  }, []);

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

        // Eğer string ise JSON parse et
        if (typeof response.data === "string") {
          try {
            addressesData = JSON.parse(response.data);
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
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

        // Varsayılan adresi seç
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

  const renderStars = (rating) => {
    let stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-2xl" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-2xl" />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <FaRegStar key={stars.length} className="text-yellow-400 text-2xl" />
      );
    }

    return stars;
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      alert("Lütfen bir puan seçin.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("yorum", comment);
      formData.append("puan", selectedRating);
      formData.append("urun", product.urun_id);
      formData.append("kullanici", id);
      formData.append("magaza", product.satici);
      console.log(product.satici);
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("resimler", file);
        });
      }

      const response = await fetch(
        "https://imecehub.com/api/products/urunyorum/yorum-ekle/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-Key": apiKey,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          alert("Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
          return;
        }
        
        console.error("Hata:", errorData);
        
        // Özel hata mesajı kontrolü
        if (errorData?.durum === "HATA" && errorData?.mesaj) {
          alert(errorData.mesaj);
        } else if (errorData?.mesaj) {
          alert(errorData.mesaj);
        } else if (errorData?.detail) {
          alert(errorData.detail);
        } else if (errorData?.message) {
          alert(errorData.message);
        } else {
          alert("Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
        return;
      }

      alert("Yorum başarıyla gönderildi.");
      setIsRatingOpen(false);
      setComment("");
      setSelectedRating(0);
      setSelectedFiles([]);
    } catch (error) {
      console.error("İstek hatası:", error);
      alert("Yorum gönderme sırasında bir hata oluştu.");
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsRatingOpen(false);
      }
    };

    if (isRatingOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isRatingOpen]);

  const handleJoinGroup = async () => {
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
      const response = await axios.post(
        "https://imecehub.com/products/groups/join/",
        {
          group_id: groupInfo?.group_id,
          amount: 1,
          address_id: addressId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-API-Key": apiKey,
          },
        }
      );

      console.log("Gruba Katılım Başarılı:", response.data);
      alert("Gruba başarıyla katıldınız!");
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

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/sepet-ekle/",
        {
          miktar: 1, // ya da kullanıcı seçimine göre ayarla
          urun_id: product.urun_id,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Ürün sepete eklendi!");
    } catch (error) {
      console.error("Sepete ekleme başarısız:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };
  return (
    <>
      <div className="order-page-body">
        <Header />
        <div className="order-page-firstslide mb-20">
          <div className="order-page-grid1">
            <div className="order-page-photos">
              <div className="w-full">
                <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  {isImagesLoading ? (
                    <div className="w-full h-[320px] bg-gray-100 animate-pulse" />
                  ) : (
                    <img
                      src={selectedImageUrl || product?.kapak_gorseli || productsimg}
                      alt={product?.urun_adi || "Ürün"}
                      className="w-full h-[320px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = productsimg;
                      }}
                    />
                  )}
                </div>

                {productImages.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {productImages.map((url, idx) => {
                      const isActive = url === selectedImageUrl;
                      return (
                        <button
                          key={`${url}-${idx}`}
                          type="button"
                          onClick={() => setSelectedImageUrl(url)}
                          className={`shrink-0 rounded-xl border overflow-hidden w-16 h-16 ${
                            isActive
                              ? "border-green-500 ring-2 ring-green-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          title={`Görsel ${idx + 1}`}
                        >
                          <img
                            src={url}
                            alt={`Görsel ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="order-page-explanation">
              <div className="order-page-explanation-title">
                <p className="text-2xl font-bold capitalize">
                  {" "}
                  {product.urun_adi}
                </p>
              </div>
              <div className="order-page-expanation-text">
                <p>{product.aciklama}</p>
              </div>
            </div>
          </div>
          <div className="order-page-grid2">
            <div className="order-page-seller">
              <div className="order-page-seller-1">
                <img
                  className="order-page-profil-photo"
                  src={sellerInfo?.profil_fotograf}
                  alt="profilPhoto"
                />
                <p>{sellerInfo?.magaza_adi}</p>
              </div>
              <div className="order-page-seller-2">
                <p>{sellerInfo?.magaza_adi}</p>
              </div>
              <div
                className="order-page-seller-absolute pointer"
                onClick={() =>
                  navigate(`/profile/satici-profili/${product?.satici}`)
                }
              >
                <p className="pointer">Profili İncele</p>
                <FaLongArrowAltRight className="pointer" />
              </div>
            </div>
            <div className="order-page-rate ">
              <div
                className="flex gap-5 cursor-pointer"
                onClick={() => setIsRatingOpen(true)}
              >
                <p>{product.degerlendirme_puani}</p>
                <div className="flex">
                  {renderStars(product.degerlendirme_puani)}
                </div>
                <div
                  className="text-xl font-bold "
                  onClick={() => setIsRatingOpen(true)}
                >
                  Ürünü Değerlendir
                </div>
              </div>
              {isRatingOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                    {/* Kapat Butonu */}
                    <button
                      onClick={() => setIsRatingOpen(false)}
                      className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-black"
                    >
                      &times;
                    </button>

                    <h2 className="text-xl font-bold text-center mb-4">
                      Ürünü Değerlendir
                    </h2>

                    {/* Puan Seçimi */}
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          onClick={() => setSelectedRating(star)}
                          className={`cursor-pointer text-3xl transition ${
                            selectedRating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Yorum */}
                    <textarea
                      placeholder="Yorumunuzu yazabilirsiniz..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border rounded-lg p-3 mb-4 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    {/* Resim Yükleme */}
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setSelectedFiles(Array.from(e.target.files))
                      }
                      className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />

                    {selectedFiles.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto mb-4">
                        {selectedFiles.map((file, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    )}

                    {/* Butonlar */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setIsRatingOpen(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                      >
                        İptal
                      </button>
                      <button
                        onClick={handleSubmitRating}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {product?.imece_onayli && (
                <div className="flex items-center gap-2">
                  <p className="text-yellow-500 font-semibold">İmece Onaylı</p>
                  <FaAward className="w-8 h-auto" color="yellow" />
                </div>
              )}
            </div>

            {/* Grup zaman bilgisi (fiyat bloğunun üstünde, ayrı bölüm) */}
            {product.satis_turu === 2 && groupInfo && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {groupInfo.starts_in_seconds != null &&
                    Number(groupInfo.starts_in_seconds) > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        Grup yakında başlıyor
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
                        Grup aktif
                      </span>
                    )}
                  </div>

                  {groupInfo.starts_in_seconds != null &&
                    Number(groupInfo.starts_in_seconds) > 0 && (
                      <div className="text-sm font-semibold text-gray-800">
                        Başlamasına:{" "}
                        <span className="text-blue-700">
                          {formatSeconds(groupInfo.starts_in_seconds)}
                        </span>
                      </div>
                    )}

                  {!(groupInfo.starts_in_seconds != null &&
                    Number(groupInfo.starts_in_seconds) > 0) &&
                    groupInfo.remaining_seconds != null && (
                      <div className="text-sm font-semibold text-gray-800">
                        Kapanmasına:{" "}
                        <span className="text-orange-700">
                          {formatSeconds(groupInfo.remaining_seconds)}
                        </span>
                      </div>
                    )}
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  {groupInfo.group_start_time && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
                      <span className="text-gray-500">Başlangıç</span>
                      <span className="font-medium">
                        {formatDateTimeTR(groupInfo.group_start_time)}
                      </span>
                    </div>
                  )}
                  {groupInfo.group_end_time && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
                      <span className="text-gray-500">Bitiş</span>
                      <span className="font-medium">
                        {formatDateTimeTR(groupInfo.group_end_time)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {product?.lab_sonuc_pdf && (
              <div className="order-page-lab-results">
                <div className="order-page-lab-title">
                  Laboratuvar sonuçları
                </div>
                <div className="order-page-lab-explanation">
                  {sellerInfo?.magaza_adi} satıcısının {product.urun_adi} adlı
                  ürününün{" "}
                  <span className="green pointer">labaratuvar sonucunu</span>
                  incelemek için <span className="green pointer">“incele”</span>
                  butonuna basın.
                </div>
                <div className="order-page-lab-button-container">
                  <div
                    onClick={() => {
                      window.open(product.lab_sonuc_pdf, "_blank");
                    }}
                    className="order-page-lab-button clickable pointer"
                  >
                    İncele
                  </div>
                </div>
              </div>
            )}
            <div className="order-page-price">
              <div className="order-page-price-1">
                <p className="order-page-bold">
                  {product.satis_turu === 2 && groupInfo
                    ? `Anlık Fiyat : ${groupInfo.current_price} TL`
                    : `${product.urun_perakende_fiyati} TL`}
                </p>
                <p className="green">Ucuz fiyatlandırma</p>
              </div>
              <div className="order-page-price-2">
                <p>Kalan ürün: {product.stok_durumu}</p>
              </div>
            </div>
            {/* ✅ Gruba Katıl Butonu */}
            {product.satis_turu === 2 ? (
              <div
                onClick={handleJoinGroup}
                className="order-page-group-buy pointer clickable"
              >
                <p>Gruba Katıl</p>
              </div>
            ) : (
              <div
                onClick={handleAddToCart}
                className="order-page-personal-buy pointer clickable"
              >
                <p>Sepete Ekle</p>
              </div>
            )}
          </div>
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
        {/* <div className="order-page-other-pictures">
          <p className="order-page-other-pictures-title">
            Yusuf Yılmazın Paylaştığı Bazı Görseller
          </p>
        </div> */}
        <div className="order-page-other-products">
          <p className="order-page-other-products-title">
            Satıcının Diğer Ürünler
          </p>
          {/* <div className="order-page-other-products-cards">
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
          </div>
        </div>

        {/* Yorumlar Bölümü */}
          <div className="mt-8">
            <Comments yorumlar={productComments} />
          </div>

          {/* <div className="order-page-other-products">
          <p className="order-page-other-products-title">
            Diğer Satıcıların Ürünleri
          </p>
          <div className="order-page-other-products-cards">
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
            <ItemCard />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default orderPage;
