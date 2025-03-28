import React, { useState, useEffect } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
import { useUrun } from "../../context/UrunContext";

const UrunEkle2 = () => {
  const [descriptionFilled, setDescriptionFilled] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [nameSelected, setNameSelected] = useState(false);
  const [productType, setProductType] = useState(""); // For radio buttons
  const navigate = useNavigate(); // useNavigate hook'unu çağır

  const { urunBilgileri, updateUrunBilgileri } = useUrun();
  console.log(urunBilgileri);

  // Update product type when radio buttons are selected
  const handleProductTypeChange = (e) => {
    const selectedType = e.target.value;
    setProductType(selectedType);
    updateUrunBilgileri("urunTipi", selectedType); // Update context with selected product type
  };

  // Text input changes (for amount and price)
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setNameSelected(value.trim() !== "");
    updateUrunBilgileri("urunMiktari", value); // Update context with amount
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setCategorySelected(value.trim() !== "");
    updateUrunBilgileri("urunFiyati", value); // Update context with price
  };

  // Readonly field for kg-based price
  const handleKgPriceChange = (e) => {
    const value = e.target.value;
    setDescriptionFilled(value.trim() !== "");
    updateUrunBilgileri("kgBasiFiyat", value); // Update context with kg-based price
  };

  return (
    <div className="urunEkle1Container">
      <div className="urunEkle1Container-gridleft">
        <div className="step ">
          <div className="step-number">1</div>
          <div className="step-title">ÜRÜN BİLGİLERİ</div>
        </div>
        <div className="step active">
          <div className="step-number">2</div>
          <div className="step-title activetext">SATIŞ BİLGİLERİ</div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-title">ÜRÜN ÖZELLİKLERİ</div>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-title">ÜRÜN ÖZELLİKLERİ</div>
        </div>
      </div>
      <div className="urunEkle1Container-gridrigth">
        <div>
          <p className="notmargin boldadd">Ürün Tipini Seçin</p>
        </div>
        <div>
          <div className="urunEkle2-radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="product-type"
                value="Adet"
                checked={productType === "Adet"}
                onChange={handleProductTypeChange}
              />
              <span>Adet</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="product-type"
                value="Litre"
                checked={productType === "Litre"}
                onChange={handleProductTypeChange}
              />
              <span>Litre</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="product-type"
                value="Kilo"
                checked={productType === "Kilo"}
                onChange={handleProductTypeChange}
              />
              <span>Kilo</span>
            </label>
          </div>
        </div>
        <div>
          <label className="boldadd" htmlFor="urunMiktari">
            Ürün Miktarı
          </label>
          <input
            className={`urunadd1input ${nameSelected ? "filled" : ""}`}
            placeholder="Ürünün miktarını girin"
            type="number"
            id="urunMiktari"
            value={urunBilgileri.urunMiktari || ""}
            onChange={handleAmountChange}
          />
        </div>
        <div>
          <label className="boldadd" htmlFor="UrunFiyati">
            Satış Fiyatı
          </label>
          <input
            className={`urunadd1input ${categorySelected ? "filled" : ""}`}
            placeholder="Fiyatı Belirleriniz"
            type="number"
            id="UrunFiyati"
            value={urunBilgileri.urunFiyati || ""}
            onChange={handlePriceChange}
          />
        </div>
        <div>
          <label className="boldadd" htmlFor="Fiyati">
            KG Başına Ürün Fiyatlandırması{" "}
          </label>
          <input
            readOnly
            className={`urunadd1input ${descriptionFilled ? "filled" : ""}`}
            placeholder="Girdiğiniz Fiyat Göre Otomatik Olarak Belirlenir"
            type="number"
            id="Fiyati"
            value={urunBilgileri.kgBasiFiyat || ""}
            onChange={handleKgPriceChange}
          />
        </div>
        <div>
          <div className="flex flex-row justify-between px-12">
            <button
              className="text-[#22FF22] flex items-center hover:underline"
              onClick={() => navigate("/urun-ekle-1")}
            >
              ← Geri dön
            </button>
            <div
              onClick={() => navigate("/urun-ekle-4")}
              className="urunAdd1Button"
            >
              <p className="px-2 ">Devam Et</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle2;
