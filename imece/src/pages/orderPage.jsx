import React from "react";
import Header from "../components/GenerealUse/Header";
import "../styles/orderPage.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import productsimg from "../assets/images/productPageImg.png";
import profilfoto from "../assets/images/profilfoto.png";
import { useEffect } from "react";
import { FaAward } from "react-icons/fa";
import ItemCard from "../components/GenerealUse/itemCard2";
const orderPage = () => {
  useEffect(() => {
    // Sayfanın en üstüne kaydır
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="order-page-body">
        <Header />
        <div className="order-page-firstslide">
          <div className="order-page-grid1">
            <div className="order-page-photos">
              <img src={productsimg} alt="" />
            </div>
            <div className="order-page-explanation">
              <div className="order-page-explanation-title">
                <p> Turuncu Mandalina</p>
              </div>
              <div className="order-page-expanation-text">
                <p>
                  "Evlat, bu mandalina öyle marketteki gibi değildir. Bizim
                  tarlada, güneşin altında, toprağın kokusuyla büyür. Her birini
                  elimle toplarım, özenle seçerim. O turuncu kabuğunu soyduğunda
                  içinden çıkan koku var ya, işte o, çocukluğumun kokusu gibi
                  gelir bana. Bizim mandalinalar, tatlıdır, suludur. Dalından
                  yeni kopmuş gibi taptaze kalır. İçine bir lokma attın mı,
                  yüzün güler. Hele o vitaminler... Eskiden hastalanmayalım diye
                  bir avuç yerdik, şimdilerde bile iyi gelir bünyeye. C vitamini
                  mi dersin, güç kuvvet mi dersin, hepsi var işte. Bak, doğanın
                  bize sunduğu bu nimet, öyle her meyveye benzemez. Yılların
                  birikimi, güneşin sıcaklığı, toprağın bereketi, hepsi bu
                  turuncu toplarda. Soy da ye, evlat. Hem damağına şenlik, hem
                  sağlığına destek!"
                </p>
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
            <div className="order-page-rate">
              <p>4.5</p>
              <div>
                {" "}
                <FaStar
                  color="yellow"
                  style={{ width: "2em", height: "20px" }}
                />
                <FaStar
                  color="yellow"
                  style={{ width: "2em", height: "20px" }}
                />
                <FaStar
                  color="yellow"
                  style={{ width: "2em", height: "20px" }}
                />
                <FaStar
                  color="yellow"
                  style={{ width: "2em", height: "20px" }}
                />
                <FaStarHalf
                  color="yellow"
                  style={{ width: "2em", height: "20px" }}
                />
              </div>
              <p>imece Onaylı</p>
              <FaAward />
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
                <p className="order-page-bold">1 KG: 36TL</p>
                <p className="green">Ucuz fiyatlandırma</p>
              </div>
              <div className="order-page-price-2">
                <p>Ürün için son tarih: 20.09.24</p>
                <p>Kalan ürün: 100KG</p>
              </div>
            </div>
            <div className="order-page-group-buy pointer clickable">
              <p>Grup Satın Alım</p>
            </div>
            <div className="order-page-personal-buy pointer clickable">
              <p>Tekil Satın Alım</p>
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
          <div className="order-page-other-products-cards">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default orderPage;
