import React from "react";
import { HiArrowRight } from 'react-icons/hi'; 

export default function PostPreview({ profileImage, name, media, title, content }) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg text-left font-semibold text-gray-900 mb-2">Ön İzleme</h2>

      <div className="bg-white shadow-md rounded-lg p-3 md:p-4 w-full h-full flex flex-col">
        <div className="flex items-center gap-2 md:gap-3 mb-3">
          <img
            src={profileImage || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-800 text-sm md:text-base">{name}</span>
        </div>

        <div className="w-full h-48 md:h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {media ? (
            <img src={media} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-sm md:text-base">Fotoğraf/Video Yüklenmedi</span>
          )}
        </div>

        <h3 className="font-semibold mt-2 md:mt-3 text-base md:text-lg text-gray-900 text-left">
          {title || "Başlık..."}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 mt-1 text-left flex-grow">
          {content || "Buraya gönderinizin içeriği gelecek..."}
        </p>
        <button 
          onClick={() => console.log('Gönderiye git')} 
          className="text-[#1EFF26] text-sm md:text-base mt-4 font-semibold hover:text-green-400 flex items-center gap-2 self-end transition-colors"
        >
          Gönderiyi incele
          <HiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
