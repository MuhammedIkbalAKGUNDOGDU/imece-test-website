import React, { useState, useMemo } from "react";
import { Star, MessageCircle, TrendingUp, Filter } from "lucide-react";
import CommentCard from "./CommentCard";

const Comments = ({ yorumlar = [] }) => {
  const [selectedRating, setSelectedRating] = useState(null); // null = tümü, 1-5 = belirli puan

  // Yıldız render fonksiyonu
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // İstatistikleri hesapla
  const calculateStats = () => {
    // API'den gelen veri yapısını kontrol et
    let commentsArray = [];

    if (Array.isArray(yorumlar)) {
      commentsArray = yorumlar;
    } else if (
      yorumlar &&
      yorumlar.yorumlar &&
      Array.isArray(yorumlar.yorumlar)
    ) {
      commentsArray = yorumlar.yorumlar;
    } else if (yorumlar && typeof yorumlar === "object") {
      // Eğer yorumlar bir object ise, içindeki array'i bul
      const possibleArrays = Object.values(yorumlar).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        commentsArray = possibleArrays[0];
      }
    }

    if (commentsArray.length === 0) {
      return {
        totalComments: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalComments = commentsArray.length;
    const totalRating = commentsArray.reduce(
      (sum, yorum) => sum + yorum.puan,
      0
    );
    const averageRating = totalRating / totalComments;

    // Puan dağılımını hesapla
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    commentsArray.forEach((yorum) => {
      ratingDistribution[yorum.puan]++;
    });

    return {
      totalComments,
      averageRating: Math.round(averageRating * 10) / 10, // 1 ondalık basamak
      ratingDistribution,
    };
  };

  const stats = calculateStats();

  // Yorum array'ini al
  const getCommentsArray = () => {
    if (Array.isArray(yorumlar)) {
      return yorumlar;
    } else if (
      yorumlar &&
      yorumlar.yorumlar &&
      Array.isArray(yorumlar.yorumlar)
    ) {
      return yorumlar.yorumlar;
    } else if (yorumlar && typeof yorumlar === "object") {
      const possibleArrays = Object.values(yorumlar).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
    }
    return [];
  };

  const commentsArray = getCommentsArray();

  // Yorumları sırala ve filtrele
  const sortedAndFilteredComments = useMemo(() => {
    let filtered = commentsArray;

    // Puan filtresi uygula
    if (selectedRating !== null) {
      filtered = commentsArray.filter((yorum) => yorum.puan === selectedRating);
    }

    // Sıralama: 1. Görseli olanlar, 2. Puan (yüksekten düşüğe), 3. Tarih (yeniden eskiye)
    return filtered.sort((a, b) => {
      // 1. Öncelik: Görseli olanlar üstte
      const aHasImages = a.resimler && a.resimler.length > 0;
      const bHasImages = b.resimler && b.resimler.length > 0;

      if (aHasImages && !bHasImages) return -1;
      if (!aHasImages && bHasImages) return 1;

      // 2. Puan (yüksekten düşüğe)
      if (b.puan !== a.puan) {
        return b.puan - a.puan;
      }

      // 3. Tarih (yeniden eskiye)
      const dateA = new Date(a.tarih);
      const dateB = new Date(b.tarih);
      return dateB - dateA;
    });
  }, [commentsArray, selectedRating]);

  // Yorum özeti metni oluştur
  const getSummaryText = () => {
    if (stats.totalComments === 0) {
      return "Henüz yorum yapılmamış";
    } else if (stats.totalComments === 1) {
      return "1 yorum";
    } else {
      return `${stats.totalComments} yorum`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Başlık */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Ürün Yorumları</h2>
      </div>

      {/* Yorumların Özeti */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-blue-800">
            Yorumların Özeti
          </h3>
        </div>
        <p className="text-blue-700 text-sm">Şuanda üzerinde çalışıyoruz</p>
      </div>

      {commentsArray.length === 0 ? (
        /* Yorum Yoksa */
        <div className="text-center py-8">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Henüz yorum yapılmamış</p>
          <p className="text-gray-400 text-sm mt-2">
            Bu ürün için ilk yorumu siz yapın!
          </p>
        </div>
      ) : (
        <>
          {/* Yorum Özeti */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ortalama Puan */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.averageRating}
                </div>
                <div className="text-sm text-gray-600">Ortalama Puan</div>
              </div>

              {/* Toplam Yorum */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.totalComments}
                </div>
                <div className="text-sm text-gray-600">Toplam Yorum</div>
              </div>

              {/* Yorum Özeti */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {getSummaryText()}
                </div>
                <div className="text-sm text-gray-600">Değerlendirme</div>
              </div>
            </div>

            {/* Puan Dağılımı */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Puan Dağılımı
              </h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating];
                  const percentage =
                    stats.totalComments > 0
                      ? (count / stats.totalComments) * 100
                      : 0;

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-gray-600">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Yorum Listesi */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedRating
                  ? `${selectedRating} Yıldızlı Yorumlar`
                  : "Tüm Yorumlar"}{" "}
                ({sortedAndFilteredComments.length})
              </h3>

              {/* Filtre Butonları */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Filtrele:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {/* Tümü butonu */}
                  <button
                    onClick={() => setSelectedRating(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedRating === null
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Tümü
                  </button>

                  {/* 1-5 yıldız butonları */}
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                        selectedRating === rating
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {sortedAndFilteredComments.map((yorum, index) => (
              <CommentCard key={index} comment={yorum} />
            ))}

            {sortedAndFilteredComments.length === 0 && selectedRating && (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Bu puana sahip yorum bulunamadı</p>
                <button
                  onClick={() => setSelectedRating(null)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Tüm yorumları göster
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
