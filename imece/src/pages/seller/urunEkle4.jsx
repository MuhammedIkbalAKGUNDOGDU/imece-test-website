import React, { useState } from "react";
import "../../styles/seller/add1.css";
import { useNavigate } from "react-router-dom";
import { useUrun } from "../../context/UrunContext";

const UrunEkle4 = () => {
  const { urunBilgileri, updateUrunBilgileri } = useUrun();
  const navigate = useNavigate();

  const apiKey =
    "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";
  const token = localStorage.getItem("accessToken");
  const [previewUrl, setPreviewUrl] = useState(
    urunBilgileri.kapak_gorsel
      ? URL.createObjectURL(urunBilgileri.kapak_gorsel)
      : null
  );
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateUrunBilgileri({ kapak_gorsel: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in urunBilgileri) {
        if (urunBilgileri[key] !== null && urunBilgileri[key] !== undefined) {
          formData.append(key, urunBilgileri[key]);
        }
      }

      const response = await fetch(
        "https://imecehub.com/api/products/urunler/ekle/",
        {
          method: "POST",
          body: formData,
          headers: {
            "X-API-Key": apiKey,
            Authorization: `Bearer ${token}`,
            // ❌ Content-Type yazılmayacak
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setSubmissionStatus("error");
        setErrorMessage(errorData?.message || "Bilinmeyen bir hata oluştu.");
      } else {
        setSubmissionStatus("success");
        setErrorMessage("");
      }
    } catch (error) {
      setSubmissionStatus("error");
      setErrorMessage(error.message || "Ağ hatası oluştu.");
    }

    setTimeout(() => {
      setSubmissionStatus(null);
    }, 5000);
  };

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
            <h2 className="text-xl font-bold mb-6">Ürün Görseli Yükleyin</h2>

            <div className="flex gap-6">
              <label className="relative border-2 border-dashed border-gray-300 rounded-lg w-1/2 h-64 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden text-center">
                {!previewUrl && (
                  <>
                    <span className="text-5xl text-gray-400">+</span>
                    <span className="text-gray-500 mt-2">
                      Görsel Seç / Sürükle
                    </span>
                  </>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Önizleme"
                    className="w-full h-full object-contain max-w-full max-h-full"
                  />
                )}
              </label>

              <div className="w-1/2 space-y-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-lg">📏</span>
                  <span className="ml-2">
                    Görsel 1200x1800, en fazla 5MB olmalı
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg">📄</span>
                  <span className="ml-2">Kuralları görmek için tıklayın</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg">➕</span>
                  <span className="ml-2">JPG veya PNG formatı olmalı</span>
                </div>
              </div>
            </div>

            {submissionStatus && (
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg w-80 pt-10 pb-10 ${
                  submissionStatus === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {submissionStatus === "success"
                      ? "İşlem Başarılı!"
                      : "İşlem Başarısız!"}
                  </span>
                  {submissionStatus === "success" ? (
                    <span className="text-2xl">✅</span>
                  ) : (
                    <span className="text-2xl">❌</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                className="text-[#22FF22] flex items-center hover:underline"
                onClick={() => navigate("/urun-ekle-3")}
              >
                ← Geri dön
              </button>
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="bg-[#22FF22] text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
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
