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
    sertifika: null,
    labSonucu: null,
    urunFotografi: null,
  });

  // Güncelleme fonksiyonu
  const updateUrunBilgileri = (fieldOrObject, value) => {
    if (typeof fieldOrObject === "object" && fieldOrObject !== null) {
      // Eğer obje geldiyse: { sertifika: file, labSonucu: file }
      setUrunBilgileri((prev) => ({ ...prev, ...fieldOrObject }));
    } else {
      // Eğer string key ve value geldiyse
      setUrunBilgileri((prev) => ({ ...prev, [fieldOrObject]: value }));
    }
  };

  return (
    <UrunContext.Provider value={{ urunBilgileri, updateUrunBilgileri }}>
      {children}
    </UrunContext.Provider>
  );
};
