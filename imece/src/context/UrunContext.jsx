import React, { createContext, useState, useContext } from "react";

// Context oluştur
const UrunContext = createContext();

// Kolay erişim için custom hook
export const useUrun = () => useContext(UrunContext);

// Provider bileşeni
export const UrunProvider = ({ children }) => {
  const [urunBilgileri, setUrunBilgileri] = useState({
    satici_id: "",
    urun_adi: "",
    urun_aciklama: "",
    ana_kategori: "",
    alt_kategori: "",
    stok_miktari: "",
    satis_turu: "",
    // Grup satış (satis_turu: 2) alanları
    group_start_date: null, // "YYYY-MM-DD"
    group_duration_days: null, // 1-14
    urun_perakende_fiyati: "",
    urun_min_fiyati: "",
    urun_sertifika_pdf: null,
    urun_lab_sonuc_pdf: null,
    kapak_gorsel: null,
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
