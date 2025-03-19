import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Yıldız ikonları

const ItemCard3 = ({ data }) => {
  const renderStars = (rating) => {
    let stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-lg" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-lg" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="text-yellow-400 text-lg" />);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-5 w-[160px] sm:w-[220px] h-[260px] sm:h-[380px] flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      
      <div className="w-full h-28 sm:h-44 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-2 sm:mt-3 flex flex-col flex-grow">
        <div className="relative group">
          <h3 className="text-base sm:text-xl font-bold text-gray-900 line-clamp-1">
            {data.name}
          </h3>
          {data.name.length > 15 && (
            <div className="absolute hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-20 left-0 top-full mt-1 w-full border border-gray-200">
              {data.name}
            </div>
          )}
        </div>

        <div className="flex items-center mt-1 space-x-0.5 sm:space-x-1">{renderStars(data.rating)}</div>

        <div className="relative group">
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 leading-tight line-clamp-2 sm:line-clamp-3">
            {data.description}
          </p>
          {data.description.length > 30 && (
            <div className="absolute hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-20 left-0 top-full mt-1 w-full border border-gray-200">
              {data.description}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex justify-end">
        <button className="text-green-600 font-medium text-sm flex items-center gap-1 hover:underline">
          İncele →
        </button>
      </div>
    </div>
  );
};

export default ItemCard3;
