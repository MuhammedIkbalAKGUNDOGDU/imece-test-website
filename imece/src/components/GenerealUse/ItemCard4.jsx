import React from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ItemCard4 = ({ data, isFavorite, onFavoriteToggle }) => {
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    onFavoriteToggle(data.urun_id || data.id);
  };

  const renderStars = (rating = 0) => {
    let stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-lg" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-lg" />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <FaRegStar key={stars.length} className="text-yellow-400 text-lg" />
      );
    }

    return stars;
  };

  const handleClick = () => {
    navigate("/order-page", { state: { product: data } });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg sm:rounded-2xl shadow p-2 sm:p-4 w-[160px] sm:w-[220px] h-[260px] sm:h-[380px] flex flex-col"
    >
      <div className="w-full h-28 sm:h-44 bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
        <img
          src={data.kapak_gorseli}
          alt={data.urun_adi}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-2 sm:mt-3 flex flex-col flex-grow">
        <div className="relative group">
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 line-clamp-1">
            {data.urun_adi}
          </h3>
          <h2 className="text-xs sm:text-md font-bold text-gray-900 line-clamp-1">
            {data.fiyat} TL
          </h2>
          {data.urun_adi.length > 15 && (
            <div className="absolute hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-20 left-0 top-full mt-1 w-full border border-gray-200">
              {data.urun_adi}
            </div>
          )}
        </div>
        <div className="flex items-center mt-0.5 sm:mt-1 space-x-0.5">
          {renderStars(data.degerlendirme_puani)}
        </div>
        <div className="relative group">
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 leading-tight line-clamp-2 sm:line-clamp-3">
            {data.aciklama}
          </p>
          {data.aciklama.length > 50 && (
            <div className="absolute hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-20 left-0 top-full mt-1 w-full border border-gray-200">
              {data.aciklama}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-2">
        <button className="flex-grow bg-green-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium">
          Sepete Ekle
        </button>
        <button onClick={handleFavoriteClick} className="p-1.5 text-red-500">
          {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ItemCard4;
