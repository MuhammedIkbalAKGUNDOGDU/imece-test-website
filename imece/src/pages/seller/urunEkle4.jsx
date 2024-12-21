import React, { useState } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
const UrunEkle4 = () => {
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
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-title">SATIŞ BİLGİLERİ</div>
        </div>
        <div class="step">
          <div class="step-number ">3</div>
          <div class="step-title">ÜRÜN ÖZELLİKLERİ</div>
        </div>
        <div class="step active">
          <div class="step-number ">4</div>
          <div class="step-title activetext">ÜRÜN ÖZELLİKLERİ</div>
        </div>
      </div>
      <div className="urunEkle1Container-gridrigth">
        <div className="urunAdd1Button-coontainer">
          <div className="urunAdd1Button">
            <p className="notmargin">Devam Et</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle4;
