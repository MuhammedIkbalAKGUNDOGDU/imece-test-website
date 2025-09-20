import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react";
import { campaignsService } from "../services/campaignsAndStoriesService";
import Header from "../components/GenerealUse/Header";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    campaign_type: "discount",
    banner: null,
  });
  const [bannerPreview, setBannerPreview] = useState(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      console.log("🎯 AdminCampaigns: Kampanyalar yükleniyor...");
      setIsLoading(true);
      const response = await campaignsService.getAllCampaigns();
      console.log("📊 AdminCampaigns: API Response:", response);
      console.log("📊 AdminCampaigns: Response Data:", response.data);
      console.log(
        "📊 AdminCampaigns: Response Data Type:",
        typeof response.data
      );
      console.log(
        "📊 AdminCampaigns: Response Data Is Array:",
        Array.isArray(response.data)
      );

      // Django'dan gelen veri response.data.data içinde
      const data = response.data || response;
      console.log("📊 AdminCampaigns: Extracted Data:", data);
      console.log("📊 AdminCampaigns: Data Type:", typeof data);
      console.log("📊 AdminCampaigns: Is Array:", Array.isArray(data));
      console.log("📊 AdminCampaigns: Data Length:", data?.length);

      setCampaigns(Array.isArray(data) ? data : []);
      console.log("✅ AdminCampaigns: Kampanyalar state'e set edildi");
    } catch (err) {
      console.error("❌ AdminCampaigns: Kampanyalar yüklenirken hata:", err);
      console.error("❌ AdminCampaigns: Error response:", err.response?.data);
      console.error("❌ AdminCampaigns: Error status:", err.response?.status);
      setError("Kampanyalar yüklenemedi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        banner: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("🎯 AdminCampaigns: Form submit başlıyor...");
      console.log("🎯 AdminCampaigns: Form Data:", formData);
      console.log("🎯 AdminCampaigns: Editing Campaign:", editingCampaign);

      // Create FormData for file uploads
      const submitData = new FormData();
      submitData.append("campaign_type", formData.campaign_type);
      submitData.append("title", formData.title);
      submitData.append("subtitle", formData.subtitle);
      submitData.append("description", formData.description);

      if (formData.banner && formData.banner instanceof File) {
        submitData.append("banner", formData.banner);
      }

      if (editingCampaign) {
        // Update existing campaign
        submitData.append("id", editingCampaign.id);

        console.log("🎯 AdminCampaigns: Update Data (FormData):", submitData);
        await campaignsService.updateCampaign(submitData);
        alert("Kampanya başarıyla güncellendi!");
      } else {
        // Create new campaign
        console.log("🎯 AdminCampaigns: Create Data (FormData):", submitData);
        await campaignsService.createCampaign(submitData);
        alert("Kampanya başarıyla oluşturuldu!");
      }

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
      fetchCampaigns(); // Refresh the list
    } catch (err) {
      console.error("❌ AdminCampaigns: Kampanya kaydedilirken hata:", err);
      console.error("❌ AdminCampaigns: Error response:", err.response?.data);
      console.error("❌ AdminCampaigns: Error status:", err.response?.status);
      alert("Kampanya kaydedilirken bir hata oluştu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title || "",
      subtitle: campaign.subtitle || "",
      description: campaign.description || "",
      campaign_type: campaign.campaign_type || "discount",
      banner: null,
    });
    // Django'dan gelen banner dosya adını tam URL'ye çevir
    const bannerUrl = campaign.banner
      ? campaign.banner.startsWith("/media/")
        ? `https://imecehub.com${campaign.banner}`
        : `https://imecehub.com/media/${campaign.banner}`
      : null;
    setBannerPreview(bannerUrl);
    setIsModalOpen(true);
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm("Bu kampanyayı silmek istediğinizden emin misiniz?")) {
      try {
        await campaignsService.deleteCampaign(campaignId);
        alert("Kampanya başarıyla silindi!");
        fetchCampaigns(); // Refresh the list
      } catch (err) {
        console.error("Kampanya silinirken hata:", err);
        alert("Kampanya silinirken bir hata oluştu!");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      campaign_type: "discount",
      banner: null,
    });
    setBannerPreview(null);
    setEditingCampaign(null);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const removeBanner = () => {
    setFormData((prev) => ({
      ...prev,
      banner: null,
    }));
    setBannerPreview(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Kampanya Yönetimi
            </h1>
            <p className="text-gray-600 mt-2">
              Kampanyaları oluşturun, düzenleyin ve yönetin
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Plus size={20} />
            Yeni Kampanya
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={fetchCampaigns}
              className="ml-4 text-red-600 underline hover:text-red-800"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Campaigns List */}
        {campaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Henüz kampanya yok
            </h3>
            <p className="text-gray-500 mb-6">
              İlk kampanyanızı oluşturmak için yukarıdaki butona tıklayın
            </p>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Kampanya Oluştur
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Campaign Image */}
                <div className="h-48 bg-gray-100 relative">
                  {campaign.banner ? (
                    <img
                      src={
                        campaign.banner.startsWith("/media/")
                          ? `https://imecehub.com${campaign.banner}`
                          : `https://imecehub.com/media/${campaign.banner}`
                      }
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(
                          "❌ AdminCampaigns: Banner yüklenemedi:",
                          campaign.banner
                        );
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Campaign Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 text-white text-xs font-medium rounded ${
                        campaign.campaign_type === "discount"
                          ? "bg-red-600"
                          : campaign.campaign_type === "new_product"
                          ? "bg-blue-600"
                          : campaign.campaign_type === "seasonal"
                          ? "bg-green-600"
                          : campaign.campaign_type === "flash_sale"
                          ? "bg-orange-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {campaign.campaign_type === "discount"
                        ? "İndirim"
                        : campaign.campaign_type === "new_product"
                        ? "Yeni Ürün"
                        : campaign.campaign_type === "seasonal"
                        ? "Sezonsal"
                        : campaign.campaign_type === "flash_sale"
                        ? "Flash Satış"
                        : campaign.campaign_type}
                    </span>
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {campaign.title || "Başlıksız Kampanya"}
                  </h3>

                  {campaign.subtitle && (
                    <p className="text-gray-600 text-sm mb-3">
                      {campaign.subtitle}
                    </p>
                  )}

                  {campaign.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                      {campaign.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition duration-200"
                    >
                      <Edit size={16} />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200"
                    >
                      <Trash2 size={16} />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campaign Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingCampaign
                    ? "Kampanya Düzenle"
                    : "Yeni Kampanya Oluştur"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Campaign Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kampanya Tipi
                    </label>
                    <select
                      name="campaign_type"
                      value={formData.campaign_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="discount">İndirim</option>
                      <option value="new_product">Yeni Ürün</option>
                      <option value="seasonal">Sezonsal</option>
                      <option value="flash_sale">Flash Satış</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kampanya başlığını girin"
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Başlık
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kampanya alt başlığını girin"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kampanya açıklamasını girin"
                    />
                  </div>

                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Görseli
                    </label>

                    {bannerPreview ? (
                      <div className="relative">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeBanner}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">
                          Banner görseli yükleyin
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="banner-upload"
                        />
                        <label
                          htmlFor="banner-upload"
                          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
                        >
                          Dosya Seç
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Kaydediliyor..."
                      : editingCampaign
                      ? "Güncelle"
                      : "Oluştur"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCampaigns;
