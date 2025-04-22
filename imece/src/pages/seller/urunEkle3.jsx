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

  const [sertifika, setSertifika] = useState(null);
  const [labSonucu, setLabSonucu] = useState(null);

  const kategori = urunBilgileri.urunKategori?.toLowerCase();
  const satisTuru = urunBilgileri.satisTuru?.toLowerCase();

  const isMeyveSebze = kategori === "meyveler" || kategori === "sebzeler";
  const isToptan = satisTuru === "toptan";

  const handleSertifikaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSertifika(file);
      updateUrunBilgileri({ sertifika: file });
      console.log("Sertifika dosyası context'e gönderildi:", file);
    }
  };

  const handleLabChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSertifika(file);
      updateUrunBilgileri({ sertifika: file });
      console.log("Sertifika dosyası context'e gönderildi:", file);
    }
  };

  const getListingDates = () => {
    const today = new Date();
    const threeDaysLater = new Date();

    // Bugün saat 23:59:00
    today.setHours(23, 59, 0, 0);

    // 3 gün sonrası saat 23:59:00
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    threeDaysLater.setHours(23, 59, 0, 0);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return {
      todayEnd: today.toLocaleString("tr-TR", options),
      threeDaysLaterEnd: threeDaysLater.toLocaleString("tr-TR", options),
    };
  };

  const { todayEnd, threeDaysLaterEnd } = getListingDates();

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
                title="Gurubun üye kabul başlangıç tarihi"
                description="Bu tarih, grubun üye kabulünün başladığı gündür. Bugün saat 23:59'a kadar geçerlidir."
              />
              <p>{todayEnd}</p>

              <InfoCard
                title="Gurubun üye kabul Bitiş tarihi"
                description="Bu tarih, grubun üye kabulünün sona ereceği gündür. Üyelikler belirtilen tarihe kadar kabul edilir."
              />
              <p>{threeDaysLaterEnd}</p>
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
