import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Check, User, Briefcase, MapPin, Home } from 'lucide-react';

export default function ProfileModal ({ isOpen, onClose, profileData, onSave, isSaving, saveSuccess, saveError }) {
    const [formData, setFormData] = useState({...profileData});
  const [previewData, setPreviewData] = useState({
    profileImagePreview: null,
    backgroundImagePreview: null
  });
  
  const profileImageInputRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewData(prev => ({
          ...prev,
          profileImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBackgroundImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewData(prev => ({
          ...prev,
          backgroundImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      profileImagePreview: previewData.profileImagePreview,
      backgroundImagePreview: previewData.backgroundImagePreview
    });
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with background preview */}
        <div className="relative h-32 bg-gradient-to-r from-emerald-400 to-teal-400 overflow-hidden">
          {previewData.backgroundImagePreview && (
            <img
              src={previewData.backgroundImagePreview}
              alt="Background preview"
              className="w-full h-full object-cover"
            />
          )}
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute -bottom-12 left-6 ring-4 ring-white rounded-full overflow-hidden w-24 h-24 bg-white shadow-lg">
            {previewData.profileImagePreview ? (
              <img
                src={previewData.profileImagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={profileData.profileImage}
                alt="Current profile"
                className="w-full h-full object-cover"
              />
            )}
            
            <button 
              onClick={() => profileImageInputRef.current?.click()}
              className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <Camera className="w-8 h-8 text-white" />
            </button>
            
            <input
              type="file"
              ref={profileImageInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>
        </div>
        
        <div className="pt-16 px-6">
          <h2 className="text-2xl font-bold text-gray-800">Profili düzenle</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status notifications */}
          {saveSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in duration-300">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p>Profil bilgileriniz başarıyla kaydedildi!</p>
            </div>
          )}
          
          {saveError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in duration-300">
              <X className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p>{saveError}</p>
            </div>
          )}

          {/* Background image upload button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => backgroundImageInputRef.current?.click()}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Arkaplan fotoğrafını değiştir</span>
            </button>
            <input
              type="file"
              ref={backgroundImageInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundImageChange}
            />
          </div>

          {/* Form fields with icons */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="İsim Soyisim"
                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Meslek"
                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Konum"
                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Home className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="farmName"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                placeholder="Çiftlik İsmi"
                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Action buttons with gradient */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-medium hover:from-emerald-500 hover:to-teal-600 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Kaydediliyor
                </span>
              ) : (
                "Kaydet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  
