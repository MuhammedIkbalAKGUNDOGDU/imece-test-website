import React from "react";
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
const orderPage = () => {
  const navigate = useNavigate(); // Yönlendirme için useNavigate kullanıldı

  const location = useLocation();
  const product = location.state?.product;

  console.log(product);
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

  return (
    <>
      <div className="order-page-body">
        <Header />
        <div className="order-page-firstslide">
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
                  src={profilfoto}
                  alt="profilPhoto"
                />
                <p>Yusuf Yılmaz</p>
              </div>
              <div className="order-page-seller-2">
                <p>
                  Merhabalar, ben Yusuf Yılmaz kendimi bildim bileli tarım
                  yaparım, aile yadigarı bir meslek, en iyi mandalina ağaçlarına
                  sahibiz, nesiller önce büyük dedem yurt dışından fidan
                  getirtmiş...
                </p>
              </div>
              <div className="order-page-seller-absolute ">
                <p className="pointer">Profili İncele</p>
                <FaLongArrowAltRight className="pointer" />
              </div>
            </div>
            <div className="order-page-rate ">
              <p>{product.degerlendirme_puani}</p>
              <div className="flex">
                {renderStars(product.degerlendirme_puani)}
              </div>
              <p>imece Onaylı</p>
              <FaAward className="w-8 h-auto" color="yellow" />
            </div>
            <div className="order-page-lab-results">
              <div className="order-page-lab-title">Labaratuvar sonuçları</div>
              <div className="order-page-lab-explanation">
                Yusuf yılmaz’ın Turuncu mandalina adlı ürününün{" "}
                <span className="green pointer">labaratuvar sonucunu</span>
                incelemek için <span className="green pointer">“incele”</span>
                butonuna basın.
              </div>
              <div className="order-page-lab-button-container">
                <div className="order-page-lab-button clickable pointer">
                  İncele
                </div>
              </div>
            </div>
            <div className="order-page-price">
              <div className="order-page-price-1">
                <p className="order-page-bold">1 KG: {product.fiyat} TL</p>
                <p className="green">Ucuz fiyatlandırma</p>
              </div>
              <div className="order-page-price-2">
                <p>Kalan ürün: {product.stok_durumu}</p>
              </div>
            </div>
            <div
              onClick={() => navigate("/order-page/choose-group")}
              className="order-page-group-buy pointer clickable"
            >
              <p>Grup Satın Alım</p>
            </div>
            <div className="order-page-personal-buy pointer clickable">
              <p>Sepete ekle</p>
            </div>
          </div>
        </div>
        <div className="order-page-other-pictures">
          <p className="order-page-other-pictures-title">
            Yusuf Yılmazın Paylaştığı Bazı Görseller
          </p>
        </div>
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
