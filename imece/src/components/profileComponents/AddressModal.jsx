import React, { useState, useEffect } from "react";
import { X, MapPin, Phone, Home, Building } from "lucide-react";

const AddressModal = ({
  isOpen,
  onClose,
  onSave,
  address = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    adres_adi: "",
    adres: "",
    mahalle: "",
    ilce: "",
    sehir: "",
    telefon: "",
    varsayilan: false,
  });

  useEffect(() => {
    if (address && isEditing) {
      setFormData({
        adres_adi: address.adres_adi || "",
        adres: address.adres || "",
        mahalle: address.mahalle || "",
        ilce: address.ilce || "",
        sehir: address.sehir || "",
        telefon: address.telefon || "",
        varsayilan: address.varsayilan || false,
      });
    } else {
      setFormData({
        adres_adi: "",
        adres: "",
        mahalle: "",
        ilce: "",
        sehir: "",
        telefon: "",
        varsayilan: false,
      });
    }
  }, [address, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Adres Düzenle" : "Yeni Adres Ekle"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Adres Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adres Adı
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="adres_adi"
                value={formData.adres_adi}
                onChange={handleInputChange}
                placeholder="Ev, İş, vb."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Adres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adres
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <textarea
                name="adres"
                value={formData.adres}
                onChange={handleInputChange}
                placeholder="Sokak, cadde, bina no, daire no"
                rows="3"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Mahalle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mahalle
            </label>
            <input
              type="text"
              name="mahalle"
              value={formData.mahalle}
              onChange={handleInputChange}
              placeholder="Mahalle adı"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* İlçe ve Şehir */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İlçe
              </label>
              <input
                type="text"
                name="ilce"
                value={formData.ilce}
                onChange={handleInputChange}
                placeholder="İlçe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir
              </label>
              <input
                type="text"
                name="sehir"
                value={formData.sehir}
                onChange={handleInputChange}
                placeholder="Şehir"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="telefon"
                value={formData.telefon}
                onChange={handleInputChange}
                placeholder="0555 123 45 67"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Varsayılan Adres */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="varsayilan"
              checked={formData.varsayilan}
              onChange={handleInputChange}
              id="varsayilan"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="varsayilan" className="ml-2 text-sm text-gray-700">
              Bu adresi varsayılan adres olarak ayarla
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {isEditing ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
