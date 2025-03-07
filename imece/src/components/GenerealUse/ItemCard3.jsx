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
    <div className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-[260px] flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      
      <div className="w-full h-44 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-3 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>

        <div className="flex items-center mt-1 space-x-1">{renderStars(data.rating)}</div>

        <p className="text-gray-500 text-sm mt-2 leading-tight">
          {data.description}
        </p>
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
