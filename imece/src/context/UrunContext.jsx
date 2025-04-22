import React, { createContext, useState, useContext } from "react";

// Context oluştur
const UrunContext = createContext();

// Kolay erişim için custom hook
export const useUrun = () => useContext(UrunContext);

// Provider bileşeni
export const UrunProvider = ({ children }) => {
  const [urunBilgileri, setUrunBilgileri] = useState({
    urunAdi: "",
    urunAciklama: "",
    urunKategori: "",
    urunAltKategori: "",
    stokAdedi: "",
    satisTuru: "",
    urunPerakendeFiyati: "",
    urunMinFiyati: "",
    satisTuru: "",
    urunSertifika: null,
    urunLaboratuvarSonucu: null, 
  });

  // Güncelleme fonksiyonu
  const updateUrunBilgileri = (field, value) => {
    setUrunBilgileri((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <UrunContext.Provider value={{ urunBilgileri, updateUrunBilgileri }}>
      {children}
    </UrunContext.Provider>
  );
};
