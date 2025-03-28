import React, { useState } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom";
import { useUrun } from "../../context/UrunContext";

const UrunEkle1 = () => {
  const [descriptionFilled, setDescriptionFilled] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [nameSelected, setNameSelected] = useState(false);
  const navigate = useNavigate();
  const { urunBilgileri, updateUrunBilgileri } = useUrun();

  // Textarea için border kontrolü
  const handleNameChange = (e) => {
    const value = e.target.value;
    setNameSelected(value.trim() !== "");
    updateUrunBilgileri("urunAdi", value); // ✔ Doğru kullanım
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescriptionFilled(value.trim() !== "");
    updateUrunBilgileri("urunAciklamasi", value); // ✔ Doğru kullanım
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategorySelected(value.trim() !== "");
    updateUrunBilgileri("urunTipi", value); // ✔ Doğru kullanım
  };

  return (
    <div className="urunEkle1Container">
      <div className="urunEkle1Container-gridleft">
        <div className="step active">
          <div className="step-number ">1</div>
          <div className="step-title activetext">ÜRÜN BİLGİLERİ</div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-title">SATIŞ BİLGİLERİ</div>
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
          <label className="boldadd" htmlFor="urunAdı">
            Ürün Adı
          </label>
          <input
            className={`urunadd1input ${nameSelected ? "filled" : ""}`}
            placeholder="Ürünün adını girin"
            type="text"
            id="urunAdı"
            value={urunBilgileri.urunAdi || ""}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label className="boldadd" htmlFor="kategori">
            Ürün Kategorisi Seçiniz
          </label>
          <select
            className={`urunadd1select ${categorySelected ? "filled" : ""}`}
            id="kategori"
            name="kategori"
            value={urunBilgileri.urunTipi || ""} // Context'teki değeri ata
            onChange={handleCategoryChange}
          >
            <option className="urunEkleAddOption" value="" disabled>
              Kategori seçiniz
            </option>
            <option className="urunEkleAddOption" value="value1">
              Seçenek 1
            </option>
            <option className="urunEkleAddOption" value="value2">
              Seçenek 2
            </option>
            <option className="urunEkleAddOption" value="value3">
              Seçenek 3
            </option>
          </select>
        </div>
        <div>
          <label className="boldadd" htmlFor="aciklama">
            Ürün Açıklaması
          </label>
          <textarea
            className={`urunadd1textarea ${descriptionFilled ? "filled" : ""}`}
            id="aciklama"
            placeholder="Ürün açıklaması"
            rows="16"
            value={urunBilgileri.urunAciklamasi || ""} // Context'teki değeri kullan
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="urunAdd1Button-coontainer">
          <div
            onClick={() => navigate("/urun-ekle-2")}
            className="urunAdd1Button"
          >
            <p className="px-2">Devam Et</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle1;
