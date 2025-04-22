import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUrun } from "../../context/UrunContext";

const UrunEkle2 = () => {
  const [amountSelected, setAmountSelected] = useState(false);
  const [priceSelected, setPriceSelected] = useState(false);
  const [minPriceSelected, setMinPriceSelected] = useState(false);
  const [satisTuru, setSatisTuru] = useState("perakende");

  const navigate = useNavigate();
  const { urunBilgileri, updateUrunBilgileri } = useUrun();

  console.log(urunBilgileri);

  useEffect(() => {
    if (urunBilgileri.stokAdedi) {
      setAmountSelected(true);
    }
    if (urunBilgileri.urunPerakendeFiyati) {
      setPriceSelected(true);
    }
    if (urunBilgileri.urunMinFiyati) {
      setMinPriceSelected(true);
    }
    if (urunBilgileri.satisTuru) {
      setSatisTuru(true);
    }
  }, []);

  const isFormValid = () => {
    if (!amountSelected || !satisTuru || !priceSelected) return false;
    if (urunBilgileri.satisTuru === "toptan" && !minPriceSelected) return false;
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmountSelected(value.trim() !== "");
    updateUrunBilgileri("stokAdedi", value);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceSelected(value.trim() !== "");
    updateUrunBilgileri("urunPerakendeFiyati", value);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPriceSelected(value.trim() !== "");
    updateUrunBilgileri("urunMinFiyati", value);
  };

  const handleSatisTuruChange = (e) => {
    const value = e.target.value;
    setSatisTuru(value);
    updateUrunBilgileri("satisTuru", value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_5fr] gap-4 p-4">
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
                index === 1 ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <div className="hidden lg:block text-sm">{step}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col ml-2 gap-4">
        <div>
          <label htmlFor="urunMiktari" className="font-bold text-xl mt-2 block">
            Ürün Stok Miktarı
          </label>
          <input
            id="urunMiktari"
            type="number"
            placeholder="Ürünün miktarını girin"
            value={urunBilgileri.stokAdedi || ""}
            onChange={handleAmountChange}
            className={`max-w-[1000px] w-full p-2 text-base rounded-lg border-2 transition-colors ${
              amountSelected
                ? "border-green-400 text-black"
                : "border-gray-300 text-gray-400"
            }`}
          />
        </div>

        <div>
          <span className="font-bold text-xl mt-4 block">Satış Türü</span>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="satisTuru"
                value="perakende"
                checked={urunBilgileri.satisTuru === "perakende"}
                onChange={handleSatisTuruChange}
              />
              Perakende Satış
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="satisTuru"
                value="toptan"
                checked={urunBilgileri.satisTuru === "toptan"}
                onChange={handleSatisTuruChange}
              />
              Toptan Satış
            </label>
          </div>
        </div>

        {(urunBilgileri.satisTuru === "perakende" || urunBilgileri.satisTuru === "toptan") && (
          <div>
            <label
              htmlFor="UrunFiyati"
              className="font-bold text-xl mt-2 block"
            >
              Perakende Fiyatı
            </label>
            <input
              id="UrunFiyati"
              type="number"
              placeholder="Fiyatı belirleyiniz"
              value={urunBilgileri.urunPerakendeFiyati || ""}
              onChange={handlePriceChange}
              className={`max-w-[1000px] w-full p-2 text-base rounded-lg border-2 transition-colors ${
                priceSelected
                  ? "border-green-400 text-black"
                  : "border-gray-300 text-gray-400"
              }`}
            />
          </div>
        )}

        {urunBilgileri.satisTuru === "toptan" && (
          <div>
            <label
              htmlFor="UrunMinFiyati"
              className="font-bold text-xl mt-2 block"
            >
              Minimum Fiyat
            </label>
            <input
              id="UrunMinFiyati"
              type="number"
              placeholder="Minimum fiyatı belirleyiniz"
              value={urunBilgileri.urunMinFiyati || ""}
              onChange={handleMinPriceChange}
              className={`max-w-[1000px] w-full p-2 text-base rounded-lg border-2 transition-colors ${
                minPriceSelected
                  ? "border-green-400 text-black"
                  : "border-gray-300 text-gray-400"
              }`}
            />
          </div>
        )}

        <div className="flex justify-between px-12 mt-4">
          <button
            className="text-[#22FF22] font-medium hover:underline"
            onClick={() => navigate("/urun-ekle-1")}
          >
            ← Geri dön
          </button>
          <button
            onClick={() => navigate("/urun-ekle-3")}
            disabled={!isFormValid()}
            className={`text-xl font-bold rounded-lg px-6 py-2 transition-colors ${
              isFormValid()
                ? "bg-green-500 text-white hover:cursor-pointer"
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

export default UrunEkle2;
