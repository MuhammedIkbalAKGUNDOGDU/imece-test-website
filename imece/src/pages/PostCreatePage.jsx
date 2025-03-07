import React, { useState } from "react";
import MediaUpload from "../components/postCreatng/MediaUpload";
import PostDetails from "../components/postCreatng/PostDetails";
import PostPreview from "../components/postCreatng/PostPreview";

export default function PostCreatePage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mediaFile: null,
    mediaPreview: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMediaSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      mediaFile: file,
      mediaPreview: URL.createObjectURL(file)
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      if (formData.mediaFile) {
        submitData.append('media', formData.mediaFile);
      }

      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: submitData
      // });

      // if (!response.ok) throw new Error('Gönderi paylaşılamadı');

      alert("Gönderi başarıyla paylaşıldı!");
      setFormData({
        title: "",
        content: "",
        mediaFile: null,
        mediaPreview: null
      });

    } catch (error) {
      alert("Bir hata oluştu: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-6 p-4 md:p-6">
      <div className="w-full lg:w-2/3 flex flex-col">
        <h1 className="text-xl md:text-2xl text-left font-semibold text-gray-900 mb-4">
          Gönderiyi Oluştur
        </h1>

        <div className="flex flex-col flex-grow">
          <MediaUpload onMediaSelect={handleMediaSelect} />
          <div className="flex-grow">
            <PostDetails 
              title={formData.title}
              setTitle={(value) => handleInputChange('title', value)}
              content={formData.content}
              setContent={(value) => handleInputChange('content', value)}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm text-center sm:text-left">
            Gönderi paylaşıldıktan sonra düzenlenebilir.
          </p>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
            <button 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              İptal et
            </button>

            <button 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 w-full sm:w-auto"
              onClick={() => {
                alert("Taslak kaydedildi");
              }}
            >
              Daha sonra bitir
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`bg-[#22FF22] text-white px-5 py-3 rounded-md hover:bg-green-600 
                text-lg font-semibold w-full sm:w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
        <PostPreview 
          profileImage="https://via.placeholder.com/40" 
          name="Yusuf Akar" 
          media={formData.mediaPreview}
          title={formData.title}
          content={formData.content}
        />
      </div>
    </div>
  );
}
