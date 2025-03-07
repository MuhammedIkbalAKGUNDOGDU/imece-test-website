import React from "react";

export default function PostDetails({ title, setTitle, content, setContent }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-lg text-left font-bold text-gray-900">Gönderi detayları</h2>

      <p className="text-gray-700 text-left font-semibold text-sm mt-2">Metin</p>

      <div className="w-full border rounded-md overflow-hidden mt-2">
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 text-gray-800 outline-none"
        />

        <div className="border-t"></div>

        <textarea
          placeholder="Metin gir..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 text-gray-800 outline-none h-48"
        />
      </div>
    </div>
  );
}
