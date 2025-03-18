import React from "react";
import Header from "../components/GenerealUse/Header";
import "../styles/createGroup.css";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaAward } from "react-icons/fa";
import productsimg from "../assets/images/productPageImg.png";
import profilfoto from "../assets/images/profilfoto.png";
import ItemCard from "../components/GenerealUse/itemCard2";
import ChooseGroup from "../components/OrderPageAndGroupProcess/ChooseGroup";

const createGrop = () => {
  return (
    <div className="createGroup-container">
      <Header />
      <div className="createGroup-firstslide">
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
          <div className="order-page-rate">
            <p>4.5</p>
            <div className="flex">
              {" "}
              <FaStar color="yellow" style={{ width: "2em", height: "20px" }} />
              <FaStar color="yellow" style={{ width: "2em", height: "20px" }} />
              <FaStar color="yellow" style={{ width: "2em", height: "20px" }} />
              <FaStar color="yellow" style={{ width: "2em", height: "20px" }} />
              <FaStarHalf
                color="yellow"
                style={{ width: "2em", height: "20px" }}
              />
            </div>
            <p>imece Onaylı</p>
            <FaAward color="yellow" />
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

        <div className="createGroup-">
          <ChooseGroup />
        </div>
      </div>

      {/* <div className="order-page-other-products">
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
      </div> */}
    </div>
  );
};

export default createGrop;
