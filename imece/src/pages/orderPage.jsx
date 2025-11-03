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
const orderPage = () => {
  const navigate = useNavigate(); // Yönlendirme için useNavigate kullanıldı
  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerProducts, setSellerProducts] = useState(null);
  const location = useLocation();
  const product = location.state?.product;
  const [groupInfo, setGroupInfo] = useState(null);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // Yeni eklendi

  const id = parseInt(localStorage.getItem("userId"), 10);

  const token = localStorage.getItem("accessToken");
  const [productComments, setProductComments] = useState([]);

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
        const errorData = await response.json();
        console.error("Hata:", errorData);
        alert(
          errorData?.detail ||
            errorData?.message ||
            "Yorum gönderilirken bir hata oluştu."
        );
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
    try {
      const response = await axios.post(
        "https://imecehub.com/products/groups/join/",
        {
          group_id: groupInfo?.group_id, // veya sabit örnek: 3
          amount: 1, // sabit
          address_id: 2, // sabit
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
    } catch (error) {
      console.error("Gruba katılım başarısız:", error.response?.data || error);
      alert("Gruba katılırken bir hata oluştu.");
    }
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
              <img src={product.kapak_gorseli} alt="" />
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
