import React, { useState, useRef } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom";
import yuklemeYap from "../../assets/images/yuklemeYap.png";
import { useUrun } from "../../context/UrunContext";
import { Info } from "lucide-react"; // info ikonu için (lucide-react kullandığını varsaydım)
import InfoCard from "../../components/GenerealUse/infocard";

const UrunEkle3 = () => {
  const { urunBilgileri, updateUrunBilgileri } = useUrun();
  const navigate = useNavigate();
  const fileInputRefSertifika = useRef(null);
  const fileInputRefLab = useRef(null);

  const [urun_sertifika_pdf, setSertifika] = useState(null);
  const [urun_lab_sonuc_pdf, setLabSonucu] = useState(null);

  const kategori = urunBilgileri.ana_kategori?.toLowerCase();
  const satis_turu = urunBilgileri.satis_turu?.toLowerCase();

  const isMeyveSebze = kategori === "meyveler" || kategori === "sebzeler";
  const isToptan = satis_turu === "2";

  const handleSertifikaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSertifika(file);
      updateUrunBilgileri({ urun_sertifika_pdf: file });
    }
  };

  const handleLabChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLabSonucu(file);
      updateUrunBilgileri({ urun_lab_sonuc_pdf: file });
    }
  };

  const formatLocalDateYYYYMMDD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const addDays = (date, days) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  };

  const groupStartDate = urunBilgileri.group_start_date; // YYYY-MM-DD
  const groupDurationDays = urunBilgileri.group_duration_days; // 1-14
  const groupEndDate =
    groupStartDate && groupDurationDays
      ? formatLocalDateYYYYMMDD(
          addDays(new Date(`${groupStartDate}T00:00:00`), groupDurationDays)
        )
      : null;

  return (
    <div className="urunEkle1Container">
      <div className="flex flex-row lg:flex-col gap-4 h-20 lg:h-auto p-4 shadow-md rounded-lg bg-white">
        {[
          "ÜRÜN BİLGİLERİ",
          "SATIŞ BİLGİLERİ",
          "ÜRÜN ÖZELLİKLERİ",
          "ÜRÜN GÖRSELİ",
        ].map((step, index) => (
          <div
            key={index}
            className="flex flex-col w-full items-center lg:flex-row gap-3 text-gray-500"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                index === 2 ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <div className="hidden lg:block text-sm">{step}</div>
          </div>
        ))}
      </div>

      <div className="urunEkle1Container-gridrigth">
        <div>
          {isMeyveSebze && (
            <>
              {/* Sertifika Ekle */}
              <div className="flex flex-row mt-12">
                <div className="basis-1/4">
                  <img
                    className="max-w-32"
                    src={yuklemeYap}
                    alt="Tıkla ve Dosya Yükle"
                    style={{ cursor: "pointer" }}
                    onClick={() => fileInputRefSertifika.current.click()}
                  />
                  <input
                    type="file"
                    ref={fileInputRefSertifika}
                    style={{ display: "none" }}
                    accept=".pdf"
                    onChange={handleSertifikaChange}
                  />
                </div>
                <div className="basis-1/2">
                  <p className="font-bold text-2xl">Ürün Sertifikasını Ekle</p>
                </div>
              </div>

              <div className="w-1/2 mt-12 border-t border-gray-400"></div>

              {/* Lab Sonucu */}
              <div className="flex flex-row mt-12">
                <div className="basis-1/4">
                  <img
                    className="max-w-32"
                    src={yuklemeYap}
                    alt="Tıkla ve Dosya Yükle"
                    style={{ cursor: "pointer" }}
                    onClick={() => fileInputRefLab.current.click()}
                  />
                  <input
                    type="file"
                    ref={fileInputRefLab}
                    style={{ display: "none" }}
                    accept=".pdf"
                    onChange={handleLabChange}
                  />
                </div>
                <div className="basis-1/2">
                  <p className="font-bold text-2xl">
                    Laboratuvar Sonuçlarını Ekle
                  </p>
                  <p className="text-s text-gray-600">
                    Değerli üreticimiz, ürününüzü laboratuvarda test ettirmeniz
                    ve çıkan sonucu listelemeniz halinde sizlere x% kadar
                    komisyon indirimi tanınacaktır
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Listelenme Süresi */}
          {isToptan && (
            <div className="mt-12">
              <InfoCard
                title="Grup başlangıç tarihi"
                description="Grup, seçtiğiniz tarihte saat 00:00'da üye kabulüne başlar. O zamana kadar pasif kalır."
              />
              <p className="font-medium">
                {groupStartDate ? groupStartDate : "Seçilmedi"}
              </p>

              <InfoCard
                title="Grup bitiş tarihi"
                description="Grup, seçtiğiniz süre sonunda saat 00:00'da kapanır."
              />
              <p className="font-medium">
                {groupEndDate ? groupEndDate : "—"}
              </p>

              <div className="mt-3 text-sm text-gray-600">
                <span className="font-semibold">Süre:</span>{" "}
                {groupDurationDays ? `${groupDurationDays} gün` : "Seçilmedi"}
              </div>
            </div>
          )}
        </div>

        {/* Geri ve Devam Butonları */}
        <div className="flex flex-row justify-between px-12 mt-12">
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
            <p className="px-2">Devam Et</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrunEkle3;
