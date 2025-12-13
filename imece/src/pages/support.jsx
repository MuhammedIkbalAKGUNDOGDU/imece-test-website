import React, { useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import { apiKey } from "../config";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageSquare,
  Send,
  FileText,
  X,
} from "lucide-react";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // İletişim bilgileri
  const contactInfo = {
    phone: "+90 (212) 555 0123",
    email: "destek@imecehub.com",
    workingHours: "Pazartesi - Cuma: 09:00 - 18:00",
    address: "İstanbul, Türkiye",
  };

  const subjectOptions = [
    "Sipariş Sorunu",
    "Ürün Hakkında Soru",
    "Ödeme Sorunu",
    "Hesap Sorunu",
    "Teknik Destek",
    "İade/İptal",
    "Diğer",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validasyonu
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Lütfen geçerli bir email adresi girin.");
      return;
    }

    // Mesaj uzunluk kontrolü
    if (formData.message.trim().length < 10) {
      alert("Mesaj en az 10 karakter olmalıdır.");
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData oluştur (dosya desteği için)
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name.trim());
      submitFormData.append("email", formData.email.trim().toLowerCase());
      if (formData.phone) {
        submitFormData.append("phone", formData.phone.trim());
      }
      submitFormData.append("subject", formData.subject);
      submitFormData.append("message", formData.message.trim());
      
      if (formData.attachment) {
        submitFormData.append("attachment", formData.attachment);
      }

      // API çağrısı
      const response = await axios.post(
        "https://imecehub.com/api/support/tickets/",
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": apiKey,
          },
        }
      );

      // Başarılı yanıt
      if (response.data.status === "success") {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          attachment: null,
        });

        // 5 saniye sonra success mesajını kaldır
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(response.data.message || "Bilinmeyen hata");
      }
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      
      // Hata mesajını göster
      let errorMessage = "Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Validasyon hatalarını göster
        if (errorData.name) {
          errorMessage = errorData.name[0] || errorMessage;
        } else if (errorData.email) {
          errorMessage = errorData.email[0] || errorMessage;
        } else if (errorData.message) {
          errorMessage = errorData.message[0] || errorMessage;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Müşteri Hizmetleri</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf - İletişim Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                İletişim Bilgileri
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Telefon</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-800 font-medium hover:text-blue-600 transition"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">E-posta</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-800 font-medium hover:text-green-600 transition break-all"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Çalışma Saatleri</p>
                    <p className="text-gray-800 font-medium">
                      {contactInfo.workingHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Adres</p>
                    <p className="text-gray-800 font-medium">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SSS veya Hızlı Linkler */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sık Sorulan Sorular
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                  Siparişimi nasıl iptal edebilirim?
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                  İade işlemi nasıl yapılır?
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                  Ödeme yöntemleri nelerdir?
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Destek Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Bize Ulaşın
                  </h2>
                  <p className="text-sm text-gray-500">
                    Sorularınız için formu doldurun, size en kısa sürede dönüş
                    yapacağız.
                  </p>
                </div>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş
                    yapacağız.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* İsim ve Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                {/* Telefon ve Konu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konu <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Konu seçin</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                </div>
              </div>

              {/* Mesaj */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Sorunuzu veya mesajınızı detaylı bir şekilde yazın..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 10 karakter, maksimum 2000 karakter
                  </p>
                </div>

                {/* Dosya Ekleme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ek Dosya (Opsiyonel)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <div className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          {formData.attachment
                            ? formData.attachment.name
                            : "Dosya seçin (PDF, DOC, JPG, PNG - Max 5MB)"}
                        </span>
                      </div>
                    </label>
                    {formData.attachment && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            attachment: null,
                          }))
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Destekleyici belgeler ekleyebilirsiniz (Ekran görüntüsü,
                    fatura vb.)
                  </p>
                </div>

                {/* Gönder Butonu */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Zorunlu alanlar
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-all flex items-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Mesaj Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

