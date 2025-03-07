import { useState } from "react";

export default function AddressSection() {
  const handleLocationUpdate = () => {
    alert("Butona tıklandı");
  };

  return (
    <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <div className="w-full sm:w-32 h-24 sm:h-32 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500 text-sm sm:text-base">Map Image</span>
        </div>
        <div className="border-r-0 md:border-r-2 border-gray-300 p-2 sm:p-4 md:p-6">
          <h2 className="text-base sm:text-lg font-bold text-black">Türkiye / İstanbul</h2>
          <p className="text-gray-800 font-light text-xs sm:text-sm">
            Çınar Mahallesi 878. sokak no 14 daire 1 İstanbul Bağcılar
          </p>
        </div>
      </div>
      <div className="text-left md:text-right w-full md:w-auto">
        <p className="text-black text-sm sm:text-base">Tahmini teslimat tarihi</p>
        <p className="main-green font-bold text-base sm:text-lg">
          09 / 01 / 2025 <span className="font-medium text-xs sm:text-sm text-gray-600">(2 gün sonra)</span>
        </p>
        <button 
          onClick={handleLocationUpdate}
          className="mt-2 px-3 sm:px-4 py-1 sm:py-2 main-green-background text-white text-sm sm:text-base rounded-md w-full md:w-auto"
        >
          Konum Bilgilerini Güncelle
        </button>
      </div>
    </div>
  );
}
