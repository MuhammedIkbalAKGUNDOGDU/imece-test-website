import React, { useState, useRef } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
import yuklemeYap from "../../assets/images/yuklemeYap.png";
import { useUrun } from "../../context/UrunContext";

const UrunEkle4 = () => {
  const [descriptionFilled, setDescriptionFilled] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [nameSelected, setNameSelected] = useState(false);
  const { urunBilgileri, updateUrunBilgileri } = useUrun();
  console.log(urunBilgileri);
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
      <div className="flex flex-row lg:flex-col gap-4 h-20 lg:h-auto p-4 shadow-md rounded-lg bg-white">
        {[
          "ÜRÜN BİLGİLERİ",
          "SATIŞ BİLGİLERİ",
          "ÜRÜN ÖZELLİKLERİ",
          "ÜRÜN ÖZELLİKLERİ",
        ].map((step, index) => (
          <div
            key={index}
            className="flex flex-col w-full items-center lg:flex-row gap-3 text-gray-500"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                index === 3 ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <div className="hidden lg:block text-sm">{step}</div>
          </div>
        ))}
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
              <button
                className="text-[#22FF22] flex items-center hover:underline"
                onClick={() => navigate("/urun-ekle-3")}
              >
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
