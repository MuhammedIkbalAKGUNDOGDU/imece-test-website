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
  const id = parseInt(localStorage.getItem("userId"), 10);

  const token = localStorage.getItem("accessToken");

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
        const response = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-info/",
          data: {
            kullanici_id: product.satici,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSellerInfo(response.data);
      } catch (error) {
        console.error("Satıcı bilgileri alınamadı:", error);
      }
    };

    fetchSellerInfo();
  }, []);
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
      const response = await axios.post(
        "https://imecehub.com/api/products/urunyorum/yorum-ekle/",
        {
          urun: product.urun_id,
          magaza: product.satici,
          puan: selectedRating,
          yorum: comment,
        },

        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token burada olmalı
          },
        }
      );

      console.log("Başarıyla gönderildi:", response.data);
      alert("Puanınız ve yorumunuz başarıyla kaydedildi!");

      // Formu sıfırlıyoruz
      setIsRatingOpen(false);
      setSelectedRating(0);
      setComment("");
    } catch (error) {
      console.error("Puan gönderilemedi:", error);
      console.log(comment, selectedRating, product.urun_id, product.satici);

      alert("Bir hata oluştu, lütfen tekrar deneyin.");
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

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/sepet-ekle/",
        {
          miktar: 4, // ya da kullanıcı seçimine göre ayarla
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
      console.log("Sepet yanıtı:", response.data);
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
              <div className="order-page-seller-absolute ">
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
              </div>
              {isRatingOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="relative flex flex-col gap-3 p-6 border rounded-lg shadow bg-white w-96">
                    {/* X Butonu */}
                    <button
                      onClick={() => setIsRatingOpen(false)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
                    >
                      &times;
                    </button>

                    <p className="font-bold text-xl text-center">
                      Puanını Seç:
                    </p>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          onClick={() => setSelectedRating(star)}
                          className={`cursor-pointer ${
                            selectedRating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } text-3xl`}
                        />
                      ))}
                    </div>
                    <textarea
                      placeholder="Yorumunuzu yazabilirsiniz (opsiyonel)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="p-2 border rounded w-full resize-none"
                    />
                    <button
                      onClick={handleSubmitRating}
                      className="bg-green-500 text-white p-2 rounded font-bold"
                    >
                      Gönder
                    </button>
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
            {product.satis_turu === 2 ? (
              <div
                onClick={() => navigate("/order-page/choose-group")}
                className="order-page-group-buy pointer clickable"
              >
                <p>Grup Satın Alım</p>
              </div>
            ) : (
              <div
                onClick={handleAddToCart}
                className="order-page-personal-buy pointer clickable"
              >
                <p>Sepete ekle</p>
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
        <div className="order-page-other-products">
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
