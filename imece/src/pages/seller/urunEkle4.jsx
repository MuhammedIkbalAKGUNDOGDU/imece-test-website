import React, { useState, useRef } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
import yuklemeYap from "../../assets/images/yuklemeYap.png";

const UrunEkle4 = () => {
  const [descriptionFilled, setDescriptionFilled] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [nameSelected, setNameSelected] = useState(false);
  const navigate = useNavigate(); // useNavigate hook'unu çağır

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Seçilen dosya:", file.name);
      // Seçilen dosyayı işleyebilirsin
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Yüklenen dosya:", file.name);
    }
  };

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
        <div className="min-h-screen flex items-center justify-center ">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
            <h2 className="text-xl font-bold mb-6">Ürün Görseli Yükleyin</h2>

            <div className="flex gap-6">
              {/* Görsel Yükleme Alanı */}
              <label className="border-2 border-dashed border-gray-300 rounded-lg w-1/2 h-64 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                <span className="text-5xl text-gray-400">+</span>
                <span className="text-gray-500 mt-2">Görsel Seç / Sürükle</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg"
                />
              </label>

              {/* Yükleme Kuralları */}
              <div className="w-1/2 space-y-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-lg">📏</span>
                  <span className="ml-2">
                    Görsel 1200x1800, en fazla 5mb boyutunda olmalı
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg">📄</span>
                  <span className="ml-2">
                    Görsel kurallarını görüntülemek için tıklayın
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg">➕</span>
                  <span className="ml-2">
                    Yüklemek istediğiniz görsel JPG veya PNG formatında olmalı
                  </span>
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex justify-between mt-8">
              <button className="text-[#22FF22] flex items-center hover:underline" onClick={() => navigate("/urun-ekle-3")}>
                ← Geri dön
              </button>
              <div className="flex gap-4">
                <button className="bg-[#22FF22] text-white px-6 py-3 rounded-lg hover:bg-green-600">
                  Galeriden Seç
                </button>
                <button className="bg-[#22FF22] text-white px-6 py-3 rounded-lg hover:bg-green-600">
                  Onayla
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle4;
