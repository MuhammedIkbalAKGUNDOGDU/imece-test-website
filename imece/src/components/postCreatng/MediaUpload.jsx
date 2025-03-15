import React, { useState } from "react";

export default function MediaUpload({ onMediaSelect }) {
  const [error, setError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError("");
      onMediaSelect(file);
    } catch (err) {
      setError(err.message);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-3 md:p-4">
      <h2 className="text-base md:text-lg text-left font-semibold text-gray-900">Medya</h2>
      <p className="text-gray-500 text-left text-xs md:text-sm mt-1">Fotoğraf veya video paylaş.</p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
        <label className="flex items-center justify-center bg-gray-200 px-3 md:px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300 text-sm md:text-base">
          📷 Fotoğraf Ekle
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        <label className="flex items-center justify-center bg-gray-200 px-3 md:px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300 text-sm md:text-base">
          🎥 Video Ekle
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
