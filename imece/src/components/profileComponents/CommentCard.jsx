// React-icons kütüphanesinden yıldız (FaStar) ikonunu içe aktarıyoruz.
import { FaStar } from "react-icons/fa";

// CommentCard bileşeni, kullanıcı yorumlarını göstermek için kullanılıyor.
// name: Kullanıcının adı (props olarak alınır)
// rating: Kullanıcının verdiği puan (1-5 arası, props olarak alınır)
// comment: Kullanıcının yazdığı yorum (props olarak alınır)
// initial: Kullanıcının adının baş harfi (props olarak alınır), yuvarlak içinde gösterilir
const CommentCard = ({ name, rating, comment, initial }) => {
  return (
    // Yorum kartını saran ana div, esnek bir düzen (flex) kullanır ve kartın stilini belirler
    <div className="flex gap-4 bg-white shadow-lg border border-gray-100 p-4 h-[150px] bg-white">
      
      {/* Kullanıcının baş harfini içeren yuvarlak alan */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
          {initial} {/* Kullanıcının baş harfi burada gösterilir */}
        </div>
      </div>

      {/* Yorum kartındaki içerik, esnek bir düzen kullanılarak yerleştirilir */}
      <div className="flex-grow flex flex-col">
        
        {/* Kullanıcı adı ve puan göstergesini içeren alan */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 truncate">{name}</h3> {/* Kullanıcı adı */}
          
          {/* Puan ve yıldızlar */}
          <div className="flex items-center flex-shrink-0">
            <span className="mr-1 font-medium">{rating}</span> {/* Puan değeri */}
            <div className="flex">
              {/* 5 yıldızlık bir dizi oluşturuluyor ve her yıldızın rengi puana göre değişiyor */}
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`w-4 h-4 ${
                    index < rating
                      ? "text-yellow-400"  
                      : "text-gray-200"   
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Kullanıcının yorumunun gösterildiği alan */}
        <p className="text-gray-600 overflow-y-auto line-clamp-5 text-sm">
          {comment} {/* Yorum metni */}
        </p>
      </div>
    </div>
  );
};


export default CommentCard;
