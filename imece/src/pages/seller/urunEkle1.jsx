import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrun } from "../../context/UrunContext";
import { useEffect } from "react";

const UrunEkle1 = () => {
  const [descriptionFilled, setDescriptionFilled] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [nameSelected, setNameSelected] = useState(false);
  const navigate = useNavigate();
  const { urunBilgileri, updateUrunBilgileri } = useUrun();

  const [subCategoryList, setSubCategoryList] = useState([]);
  const [subCategorySelected, setSubCategorySelected] = useState(false);

  const isFormValid =
    nameSelected &&
    categorySelected &&
    subCategorySelected &&
    descriptionFilled;

  useEffect(() => {
    if (
      urunBilgileri.urunKategori &&
      altKategoriler[urunBilgileri.urunKategori]
    ) {
      setSubCategoryList(altKategoriler[urunBilgileri.urunKategori]);
    }
  }, []);

  useEffect(() => {
    if (urunBilgileri.urunKategori) {
      setCategorySelected(true);
    }
    if (urunBilgileri.urunAltKategori) {
      setSubCategorySelected(true);
    }
    if (urunBilgileri.urunAciklama) {
      setDescriptionFilled(true);
    }
    if (urunBilgileri.urunAdi) {
      setNameSelected(true);
    }
  }, []);

  const kategoriler = [
    { ad: "Meyveler", kategori: 1 },
    { ad: "Sebzeler", kategori: 2 },
    { ad: "Elektronik", kategori: 3 },
    { ad: "Moda ve Giyim", kategori: 4 },
    { ad: "Ev ve Yaşam", kategori: 5 },
    { ad: "Kozmetik ve Kişisel Bakım", kategori: 6 },
    { ad: "Spor ve Outdoor", kategori: 7 },
    { ad: "Anne & Bebek Ürünleri", kategori: 8 },
    { ad: "Kitap, Film, Müzik ve Hobi", kategori: 9 },
    { ad: "Otomobil ve Motosiklet", kategori: 10 },
    { ad: "Süpermarket & Gıda", kategori: 11 },
    { ad: "Pet Shop (Evcil Hayvan Ürünleri)", kategori: 12 },
    { ad: "Sağlık ve Medikal Ürünler", kategori: 13 },
  ];

  const altKategoriler = {
    Meyveler: ["Elma", "Muz", "Portakal"],
    Sebzeler: ["Domates", "Salatalık", "Patlıcan"],
    Elektronik: ["Telefon", "Bilgisayar", "Televizyon"],
    "Moda ve Giyim": ["Kadın Giyim", "Erkek Giyim", "Aksesuar"],
    "Ev ve Yaşam": ["Mobilya", "Dekorasyon", "Aydınlatma"],
    "Kozmetik ve Kişisel Bakım": ["Makyaj", "Cilt Bakımı", "Parfüm"],
    "Spor ve Outdoor": ["Fitness", "Kamp Malzemeleri", "Bisiklet"],
    "Anne & Bebek Ürünleri": ["Bebek Bezi", "Oyuncaklar", "Bebek Giyim"],
    "Kitap, Film, Müzik ve Hobi": ["Kitap", "Müzik Aletleri", "Puzzle"],
    "Otomobil ve Motosiklet": ["Oto Aksesuar", "Lastik", "Motor Parçaları"],
    "Süpermarket & Gıda": ["Kuru Gıdalar", "İçecekler", "Atıştırmalıklar"],
    "Pet Shop (Evcil Hayvan Ürünleri)": [
      "Kedi Maması",
      "Köpek Oyuncakları",
      "Kuş Kafesi",
    ],
    "Sağlık ve Medikal Ürünler": [
      "Tansiyon Aleti",
      "Medikal Cihazlar",
      "Vitaminler",
    ],
  };
  const handleNameChange = (e) => {
    const value = e.target.value;
    setNameSelected(value.trim() !== "");
    updateUrunBilgileri("urunAdi", value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescriptionFilled(value.trim() !== "");
    updateUrunBilgileri("urunAciklama", value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategorySelected(value.trim() !== "");
    updateUrunBilgileri("urunKategori", value);

    // Alt kategorileri güncelle
    const subCats = altKategoriler[value] || [];
    setSubCategoryList(subCats);
    setSubCategorySelected(false);
    updateUrunBilgileri("urunAltKategori", "");
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setSubCategorySelected(value.trim() !== "");
    updateUrunBilgileri("urunAltKategori", value);
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
            value={urunBilgileri.urunKategori || ""}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Kategori seçiniz
            </option>
            {kategoriler.map((kategori, index) => (
              <option key={index} value={kategori.ad}>
                {kategori.ad}
              </option>
            ))}
          </select>
        </div>
        {/* ALT KATEGORİ */}
        {urunBilgileri.urunKategori && subCategoryList.length > 0 && (
          <div>
            <label
              className="block text-lg font-bold mb-2"
              htmlFor="altKategori"
            >
              Alt Kategori Seçiniz
            </label>
            <select
              className={`w-full max-w-3xl p-3 border-2 rounded-lg ${
                subCategorySelected
                  ? "border-green-500 text-black"
                  : "border-gray-400 text-gray-400"
              }`}
              id="altKategori"
              name="altKategori"
              value={urunBilgileri.urunAltKategori || ""}
              onChange={handleSubCategoryChange}
            >
              <option value="" disabled>
                Alt kategori seçiniz
              </option>
              {subCategoryList.map((alt, index) => (
                <option key={index} value={alt}>
                  {alt}
                </option>
              ))}
            </select>
          </div>
        )}

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
            value={urunBilgileri.urunAciklama || ""}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate("/urun-ekle-2")}
            disabled={!isFormValid}
            className={`text-lg font-bold py-2 px-6 rounded-lg 
      ${
        isFormValid
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle1;
