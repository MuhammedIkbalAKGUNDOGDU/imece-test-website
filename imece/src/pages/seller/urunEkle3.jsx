import React, { useState, useRef } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
import yuklemeYap from "../../assets/images/yuklemeYap.png";
const UrunEkle3 = () => {
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
        <div class="step active">
          <div class="step-number">3</div>
          <div class="step-title activetext">ÜRÜN ÖZELLİKLERİ</div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-title">ÜRÜN ÖZELLİKLERİ</div>
        </div>
      </div>
      <div className="urunEkle1Container-gridrigth">
        <div>
          <div className="flex flex-row mt-12">
            <div className="basis-1/4">
              <img
                className="max-w-32"
                src={yuklemeYap}
                alt="Tıkla ve Dosya Yükle"
                style={{ cursor: "pointer" }}
                onClick={handleImageClick}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="basis-1/2">
              <p className="font-bold	 text-2xl		">Ürün Sertifikasını Ekle</p>
            </div>
          </div>

          <div class="w-1/2 mt-12 border-t border-gray-400"></div>

          <div className="flex flex-row mt-12">
            <div className="basis-1/4">
              <img
                className="max-w-32"
                src={yuklemeYap}
                alt="Tıkla ve Dosya Yükle"
                style={{ cursor: "pointer" }}
                onClick={handleImageClick}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="basis-1/2">
              <p className="font-bold	 text-2xl		">Lavoratuvar Sonuçlarını ekle</p>
              <p className="text-s text-gray-600	">
                Değerli üreticimiz, ürününüzü laboratuvarda test ettirmeniz ve
                çıkan sonucu listelemeniz halinde sizlere x% kadar komisyon
                indirimi tanınacaktır
              </p>
            </div>
          </div>

          <div>
            <div className="mt-2">
              <p className="font-bold text-2xl">Listelenme Süresi</p>
              <div class="flex space-x-4 mt-6">
                <select class="border rounded px-4 py-2">
                  <option>Saat</option>
                  <option>1 Saat</option>
                  <option>2 Saat</option>
                </select>
                <select class="border rounded px-4 py-2">
                  <option>Dakika</option>
                  <option>30 Dakika</option>
                  <option>45 Dakika</option>
                </select>
              </div>
              <p className="text-gray-400 mt-1">
                {" "}
                xx.xx saatinde listeden kaldırılacaktır
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between px-12">
            <button
              className="text-[#22FF22] flex items-center hover:underline"
              onClick={() => navigate("/urun-ekle-2")}
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

export default UrunEkle3;
