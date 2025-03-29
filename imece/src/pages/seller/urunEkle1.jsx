import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrun } from "../../context/UrunContext";

const UrunEkle1 = () => {
  const [descriptionFilled, setDescriptionFilled] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [nameSelected, setNameSelected] = useState(false);
  const navigate = useNavigate();
  const { urunBilgileri, updateUrunBilgileri } = useUrun();

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNameSelected(value.trim() !== "");
    updateUrunBilgileri("urunAdi", value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescriptionFilled(value.trim() !== "");
    updateUrunBilgileri("urunAciklamasi", value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategorySelected(value.trim() !== "");
    updateUrunBilgileri("urunTipi", value);
  };

  return (
    <div className="grid lg:grid-cols-6 grid-cols-1 lg:min-h-screen gap-4 p-6">
      {/* Sol Kısım - Adımlar */}
      <div className="lg:col-span-1 flex flex-row lg:flex-col gap-4 h-20 lg:h-auto p-4 shadow-md rounded-lg bg-white">
        {[
          "ÜRÜN BİLGİLERİ",
          "SATIŞ BİLGİLERİ",
          "ÜRÜN ÖZELLİKLERİ",
          "ÜRÜN ÖZELLİKLERİ",
        ].map((step, index) => (
          <div
            key={index}
            className="flex flex-col w-full items-center  lg:flex-row gap-3 text-gray-500"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index === 0 ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <div className="hidden lg:block">{step}</div>
          </div>
        ))}
      </div>

      {/* Sağ Kısım - Form Alanı */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <label className="block text-lg font-bold mb-2" htmlFor="urunAdı">
            Ürün Adı
          </label>
          <input
            className={`w-full max-w-3xl p-3 border-2 rounded-lg ${
              nameSelected
                ? "border-green-500 text-black"
                : "border-gray-400 text-gray-400"
            }`}
            placeholder="Ürünün adını girin"
            type="text"
            id="urunAdı"
            value={urunBilgileri.urunAdi || ""}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <label className="block text-lg font-bold mb-2" htmlFor="kategori">
            Ürün Kategorisi Seçiniz
          </label>
          <select
            className={`w-full max-w-3xl p-3 border-2 rounded-lg ${
              categorySelected
                ? "border-green-500 text-black"
                : "border-gray-400 text-gray-400"
            }`}
            id="kategori"
            name="kategori"
            value={urunBilgileri.urunTipi || ""}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Kategori seçiniz
            </option>
            <option value="value1">Seçenek 1</option>
            <option value="value2">Seçenek 2</option>
            <option value="value3">Seçenek 3</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-bold mb-2" htmlFor="aciklama">
            Ürün Açıklaması
          </label>
          <textarea
            className={`w-full max-w-3xl p-3 border-2 rounded-lg ${
              descriptionFilled
                ? "border-green-500 text-black"
                : "border-gray-400 text-gray-400"
            }`}
            id="aciklama"
            placeholder="Ürün açıklaması"
            rows="6"
            value={urunBilgileri.urunAciklamasi || ""}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate("/urun-ekle-2")}
            className="bg-green-500 text-white text-lg font-bold py-2 px-6 rounded-lg hover:bg-green-600"
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle1;
