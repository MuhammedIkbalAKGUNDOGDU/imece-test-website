import React, { useState } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
const UrunEkle1 = () => {
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
        <div class="step active">
          <div class="step-number ">1</div>
          <div class="step-title activetext">ÜRÜN BİLGİLERİ</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-title">SATIŞ BİLGİLERİ</div>
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
          <label className="boldadd" htmlFor="urunAdı">
            Ürün Adı
          </label>
          <input
            className={`urunadd1input ${nameSelected ? "filled" : ""}`}
            placeholder="Ürünün adını girin"
            type="text"
            id="urunAdı"
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
            onChange={handleCategoryChange}
          >
            <option className="urunEkleAddOption" value="" disabled selected>
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
            onChange={handleDescriptionChange}
          ></textarea>
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
