import React, { useState } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et

const UrunEkle2 = () => {
  const [descriptionFilled, setDescriptionFilled] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [nameSelected, setNameSelected] = useState(false);
  const navigate = useNavigate(); // useNavigate hook'unu çağır

  // Textarea için border kontrolü
  const handleDescriptionChange = (e) => {
    setDescriptionFilled(e.target.value.trim() !== "");
  };
  const handleNameChange = (e) => {
    setNameSelected(e.target.value.trim() !== "");
  };
  // Select için border kontrolü
  const handleCategoryChange = (e) => {
    setCategorySelected(e.target.value.trim() !== "");
  };

  return (
    <div className="urunEkle1Container">
      <div className="urunEkle1Container-gridleft">
        <div class="step ">
          <div class="step-number">1</div>
          <div class="step-title">ÜRÜN BİLGİLERİ</div>
        </div>
        <div class="step active">
          <div class="step-number">2</div>
          <div class="step-title activetext">SATIŞ BİLGİLERİ</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-title">ÜRÜN ÖZELLİKLERİ</div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-title">ÜRÜN ÖZELLİKLERİ</div>
        </div>
      </div>
      <div className="urunEkle1Container-gridrigth">
        <div>
          {" "}
          <p className="notmargin boldadd">Ürün Tipini Seçin</p>
        </div>
        <div>
          <div class="urunEkle2-radio-group">
            <label class="radio-option">
              <input type="radio" name="product-type" value="Adet" />
              <span>Adet</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="product-type" value="Litre" />
              <span>Litre</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="product-type" value="Kilo" />
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
            onChange={handleNameChange}
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
            onChange={handleCategoryChange}
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
            onChange={handleDescriptionChange}
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
