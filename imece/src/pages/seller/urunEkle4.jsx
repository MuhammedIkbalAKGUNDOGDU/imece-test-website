import React, { useMemo, useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extraImages = Array.isArray(urunBilgileri.urun_images)
    ? urunBilgileri.urun_images
    : [];

  const extraImagePreviews = useMemo(() => {
    try {
      return extraImages.map((f) => URL.createObjectURL(f));
    } catch {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraImages.length]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateUrunBilgileri({ kapak_gorsel: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleExtraImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const merged = [...extraImages, ...files];
    const capped = merged.slice(0, 10);
    updateUrunBilgileri({ urun_images: capped });

    if (merged.length > 10) {
      alert("En fazla 10 ürün fotoğrafı yükleyebilirsiniz.");
    }

    // Aynı dosyayı tekrar seçebilsin diye reset
    event.target.value = "";
  };

  const removeExtraImage = (index) => {
    const next = extraImages.filter((_, i) => i !== index);
    updateUrunBilgileri({ urun_images: next });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Eğer zaten gönderiliyorsa işlemi durdur

    setIsSubmitting(true);
    setSubmissionStatus(null);
    setErrorMessage("");

    try {
      const formData = new FormData();
      for (const key in urunBilgileri) {
        const value = urunBilgileri[key];
        if (value === null || value === undefined) continue;
        // Çoklu görselleri ayrı ekleyeceğiz
        if (key === "urun_images") continue;
        // Güvenlik: array alanları otomatik append etme
        if (Array.isArray(value)) continue;
        formData.append(key, value);
      }

      // Ek ürün görselleri (max 10): urun_images
      if (Array.isArray(urunBilgileri.urun_images)) {
        urunBilgileri.urun_images.slice(0, 10).forEach((file) => {
          formData.append("urun_images", file);
        });
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
        setIsSubmitting(false);
      } else {
        setSubmissionStatus("success");
        setErrorMessage("");
        // Başarılı durumda 2 saniye sonra seller landing page'e yönlendir
        setTimeout(() => {
          navigate("/seller/landing");
        }, 2000);
      }
    } catch (error) {
      setSubmissionStatus("error");
      setErrorMessage(error.message || "Ağ hatası oluştu.");
      setIsSubmitting(false);
    }
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

            {/* Ek ürün görselleri */}
            <div className="mt-8">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ek Ürün Fotoğrafları
                  </h3>
                  <p className="text-sm text-gray-600">
                    En fazla 10 adet görsel yükleyebilirsiniz.
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {extraImages.length}/10
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="text-4xl text-gray-400">+</div>
                    <div className="mt-2 text-sm text-gray-600">
                      Fotoğraf Ekle (çoklu)
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      multiple
                      onChange={handleExtraImagesChange}
                      disabled={extraImages.length >= 10}
                    />
                  </label>
                </div>

                <div className="md:w-2/3">
                  {extraImages.length === 0 ? (
                    <div className="h-full flex items-center justify-center border border-gray-200 rounded-lg p-6 text-sm text-gray-500">
                      Henüz ek fotoğraf seçilmedi.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {extraImagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative border border-gray-200 rounded-lg overflow-hidden group"
                        >
                          <img
                            src={src}
                            alt={`Ek görsel ${idx + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeExtraImage(idx)}
                            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            title="Kaldır"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                {submissionStatus === "success" && (
                  <p className="text-sm mt-2">
                    Satıcı ana sayfasına yönlendiriliyorsunuz...
                  </p>
                )}
                {submissionStatus === "error" && errorMessage && (
                  <p className="text-sm mt-2">{errorMessage}</p>
                )}
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
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#22FF22] text-white hover:bg-green-600"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      İşleniyor...
                    </>
                  ) : (
                    "Onayla"
                  )}
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
