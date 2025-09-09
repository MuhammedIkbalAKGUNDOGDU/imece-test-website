import React from "react";
import { Star, Calendar, User } from "lucide-react";

const CommentCard = ({ comment }) => {
  const { kullanici_ad, kullanici_soyad, yorum, puan, tarih, resimler } =
    comment;

  // Yıldız render fonksiyonu
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Kullanıcı adını oluştur
  const getUserName = () => {
    if (kullanici_ad && kullanici_soyad) {
      return `${kullanici_ad} ${kullanici_soyad}`;
    } else if (kullanici_ad) {
      return kullanici_ad;
    } else if (kullanici_soyad) {
      return kullanici_soyad;
    }
    return "Anonim Kullanıcı";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Kullanıcı Bilgileri ve Puan */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Kullanıcı Avatar */}
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 text-sm">
              {getUserName()}
            </h4>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(puan)}
              <span className="text-xs text-gray-500 ml-1">({puan}/5)</span>
            </div>
          </div>
        </div>

        {/* Tarih */}
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(tarih)}</span>
        </div>
      </div>

      {/* Yorum Metni */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm leading-relaxed">{yorum}</p>
      </div>

      {/* Yorum Resimleri */}
      {resimler && resimler.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-2 flex-wrap">
            {resimler.map((resim, index) => (
              <div key={index} className="relative">
                <img
                  src={resim}
                  alt={`Yorum resmi ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(resim, "_blank")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
