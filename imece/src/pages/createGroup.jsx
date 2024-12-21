import React from "react";
import Header from "../components/GenerealUse/Header";
import "../styles/createGroup.css";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import productsimg from "../assets/images/productPageImg.png";
import profilfoto from "../assets/images/profilfoto.png";
import ChooseGroup from "../components/OrderPageAndGroupProcess/ChooseGroup";

const CreateGroup = () => {
  return (
    <div className="real-create-group">
      <Header />
      <div className="createGroup-firstslide1">
        <div className="createGroup-firstGrid">
          <div className="createGroup-img">
            <img src={productsimg} alt="" />
          </div>
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
        </div>
        <div>
          <div className="createGroup-1">
            <p className="createGroup-1-name notmargin">Ahmet Yaran</p>
            <p className="createGroup-1-explanation">
              Yusuf Yılmaz'ın{" "}
              <span className="orange">"Turuncu Mandalina"</span> ürünü için{" "}
              <span className="orange">grup oluşturuyorsunuz!.</span>
            </p>
            <div className="flex-1">
              <div>
                <p className="createGroup-1-bold-underlined">Grup Adı</p>
                <input className="createGroup-1-input" type="text" />
              </div>
              <div>
                <p className="createGroup-1-bold-underlined">
                  Açık / Kapalı Grup?
                </p>
                <div className="flex-2">
                  {" "}
                  <div className="createGroup-1-button-active">
                    <p className="notmargin ">Açık</p>
                  </div>
                  <div className="createGroup-1-button">
                    <p className="notmargin ">Kapalı</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="createGroup-1-bold-underlined">Kişi Sınırı</p>
              <div className="flex-2">
                <div className="createGroup-1-button-2-active">50 kişi</div>
                <div className="createGroup-1-button-2">100 kişi</div>
                <div className="createGroup-1-button-2">150 kişi</div>
                <div className="createGroup-1-button-2">200 kişi</div>
                <div className="createGroup-1-button-2">250 kişi</div>
              </div>
            </div>
            <div className="flex mt-2">
              <div>
                <p className="notmargin blue">
                  Grup linki: www.imece/ahmetyarangrup.com
                </p>
                <p className="notmargin gray">
                  Sadece grup oluşturulduğunda aktif olur!
                </p>
              </div>
              <div className="createGroup-1-button-3 ml-2">Grup Oluştur</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
