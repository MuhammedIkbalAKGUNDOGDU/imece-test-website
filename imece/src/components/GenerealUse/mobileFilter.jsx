import React from "react";

const MobileFilter = () => {
  return (
    <div className="md:hidden block p-4 ">
      <div className="flex overflow-x-scroll  scrollbar-hide space-x-4 ">
        {/* Filtre Butonları */}
        <button className="px-4 py-2 bg-white text-nowrap border rounded-full text-gray-700">
          Şehir <span className="text-green-500">&#9660;</span>
        </button>
        <button className="px-4 py-2 bg-white border text-nowrap rounded-full text-gray-700">
          Hızlı Teslimat <span className="text-green-500">&#9660;</span>
        </button>
        <button className="px-4 py-2 bg-white border text-nowrap rounded-full text-gray-700">
          Avantajlı Ürünler <span className="text-green-500">&#9660;</span>
        </button>
        <button className="px-4 py-2 bg-white border text-nowrap rounded-full text-gray-700">
          Fiyat <span className="text-green-500">&#9660;</span>
        </button>
        <button className="px-4 py-2 bg-white border text-nowrap rounded-full text-gray-700">
          Marka <span className="text-green-500">&#9660;</span>
        </button>
      </div>
    </div>
  );
};

export default MobileFilter;
