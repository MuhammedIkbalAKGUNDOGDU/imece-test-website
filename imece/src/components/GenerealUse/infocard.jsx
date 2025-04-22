import React, { useState } from "react";
import { Info } from "lucide-react";

const InfoCard = ({ title, description }) => {
  const [showInfo, setShowInfo] = useState(false); // animasyonlar index.css dosyasından geliyor

  const handleToggle = () => setShowInfo(!showInfo);

  return (
    <div className="">
      <p className="font-bold text-xl capitalize flex items-center gap-2 ">
        {title}
        <Info
          size={18}
          className="cursor-pointer text-gray-500 hover:text-black"
          onClick={handleToggle}
        />
      </p>

      {/* Yandan kayan info kartı */}
      {showInfo && (
        <div className="fixed bottom-0 right-0 mb-8 mr-8 w-96 p-4 bg-white border rounded-lg shadow-lg animate-slide-in p-8">
          <button
            className="absolute top-1 right-2 text-md text-gray-600 hover:text-black"
            onClick={handleToggle}
          >
            ✕
          </button>
          <p className="text-2xl font-bold">{title}</p>

          <p className="text-xl mt-2">{description}</p>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
