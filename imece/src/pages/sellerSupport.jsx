import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import { apiKey } from "../config";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageSquare,
  Send,
  FileText,
  X,
  Store,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Download,
} from "lucide-react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookieManager";

const SellerSupport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create"); // "create" veya "tickets"
  const [sellerFormData, setSellerFormData] = useState({
    subject: "",
    message: "",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // İletişim bilgileri
  const contactInfo = {
    phone: "+90 (212) 555 0123",
    email: "destek@imecehub.com",
    workingHours: "Pazartesi - Cuma: 09:00 - 18:00",
    address: "İstanbul, Türkiye",
  };

  const subjectOptions = [
    "Sipariş Sorunu",
    "Ürün Hakkında Soru",
    "Ödeme Sorunu",
    "Hesap Sorunu",
    "Teknik Destek",
    "İade/İptal",
    "Diğer",
  ];

  const statusOptions = [
    { value: "all", label: "Tümü", color: "gray" },
    { value: "pending", label: "Beklemede", color: "orange" },
    { value: "in_progress", label: "İşlemde", color: "blue" },
    { value: "resolved", label: "Çözüldü", color: "green" },
    { value: "closed", label: "Kapatıldı", color: "gray" },
  ];

  // Kullanıcı bilgilerini çek ve satıcı kontrolü yap
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        navigate("/satici-login");
        return;
      }

      try {
        const response = await axios.get(
          "https://imecehub.com/api/users/kullanicilar/me/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
        setUserData(response.data);
        
        // Eğer satıcı değilse ana sayfaya yönlendir
        if (response.data?.rol !== "satici") {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
        navigate("/satici-login");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Ticket'ları çek
  useEffect(() => {
    if (activeTab === "tickets" && userData?.rol === "satici") {
      fetchSellerTickets();
    }
  }, [activeTab, statusFilter, userData]);

  const fetchSellerTickets = async () => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) return;

    try {
      setLoadingTickets(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const url = `https://imecehub.com/api/support/seller-tickets/${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // API'den gelen veriyi kontrol et
      if (Array.isArray(response.data)) {
        setTickets(response.data);
      } else if (response.data.results) {
        setTickets(response.data.results);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setTickets(response.data.data);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Ticket'lar alınamadı:", error);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchTicketDetail = async (ticketId) => {
    try {
      const accessToken = getCookie("accessToken");
      if (!accessToken) return null;

      const response = await axios.get(
        `https://imecehub.com/api/support/seller-tickets/${ticketId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Ticket detayı alınamadı:", error);
      return null;
    }
  };

  const openTicketModal = async (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);

    // Ticket detayını API'den çek
    const ticketDetail = await fetchTicketDetail(ticket.id);
    if (ticketDetail) {
      setSelectedTicket(ticketDetail);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Beklemede", color: "bg-orange-100 text-orange-800" },
      in_progress: { label: "İşlemde", color: "bg-blue-100 text-blue-800" },
      resolved: { label: "Çözüldü", color: "bg-green-100 text-green-800" },
      closed: { label: "Kapatıldı", color: "bg-gray-100 text-gray-800" },
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSellerInputChange = (e) => {
    const { name, value } = e.target;
    setSellerFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSellerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz.");
        return;
      }
      setSellerFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
    }
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();

    // Form validasyonu
    if (!sellerFormData.subject || !sellerFormData.message) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    // Mesaj uzunluk kontrolü
    if (sellerFormData.message.trim().length < 10) {
      alert("Mesaj en az 10 karakter olmalıdır.");
      return;
    }

    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      alert("Giriş yapmanız gerekiyor.");
      navigate("/satici-login");
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData oluştur (dosya desteği için)
      const submitFormData = new FormData();
      submitFormData.append("subject", sellerFormData.subject);
      submitFormData.append("message", sellerFormData.message.trim());
      
      if (sellerFormData.attachment) {
        submitFormData.append("attachment", sellerFormData.attachment);
      }

      // API çağrısı - Seller ticket endpoint
      const response = await axios.post(
        "https://imecehub.com/api/support/seller-tickets/",
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": apiKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Başarılı yanıt
      if (response.data.status === "success" || response.data.ticket_number) {
        setSubmitSuccess(true);
        setSellerFormData({
          subject: "",
          message: "",
          attachment: null,
        });

        // 5 saniye sonra success mesajını kaldır
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);

        // Ticket listesini yenile
        if (activeTab === "tickets") {
          fetchSellerTickets();
        }
      } else {
        throw new Error(response.data.message || "Bilinmeyen hata");
      }
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      
      // Hata mesajını göster
      let errorMessage = "Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Validasyon hatalarını göster
        if (errorData.subject) {
          errorMessage = errorData.subject[0] || errorMessage;
        } else if (errorData.message) {
          errorMessage = errorData.message[0] || errorMessage;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Satıcı Destek Talebi</h1>
          {activeTab === "tickets" && (
            <button
              onClick={fetchSellerTickets}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-5 h-5" />
              Yenile
            </button>
          )}
        </div>

        {/* Tab Seçimi */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "create"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Yeni Talep Oluştur
            </div>
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "tickets"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Taleplerim ({tickets.length})
            </div>
          </button>
        </div>

        {activeTab === "create" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf - İletişim Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                İletişim Bilgileri
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Telefon</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-800 font-medium hover:text-blue-600 transition"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">E-posta</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-800 font-medium hover:text-green-600 transition break-all"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Çalışma Saatleri</p>
                    <p className="text-gray-800 font-medium">
                      {contactInfo.workingHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Adres</p>
                    <p className="text-gray-800 font-medium">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SSS veya Hızlı Linkler */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sık Sorulan Sorular
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                  Siparişimi nasıl yönetebilirim?
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                  Ödeme işlemleri nasıl yapılır?
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                  Ürün ekleme süreci nedir?
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Satıcı Destek Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Satıcı Destek Talebi
                  </h2>
                  <p className="text-sm text-gray-500">
                    Satıcı olarak destek talebinizi oluşturun, size en kısa sürede dönüş
                    yapacağız.
                  </p>
                </div>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş
                    yapacağız.
                  </p>
                </div>
              )}

              <form onSubmit={handleSellerSubmit} className="space-y-5">
                {/* Konu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konu <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={sellerFormData.subject}
                    onChange={handleSellerInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Konu seçin</option>
                    {subjectOptions.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mesaj */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={sellerFormData.message}
                    onChange={handleSellerInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Sorunuzu veya mesajınızı detaylı bir şekilde yazın..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 10 karakter, maksimum 2000 karakter
                  </p>
                </div>

                {/* Dosya Ekleme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ek Dosya (Opsiyonel)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        onChange={handleSellerFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <div className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          {sellerFormData.attachment
                            ? sellerFormData.attachment.name
                            : "Dosya seçin (PDF, DOC, JPG, PNG - Max 5MB)"}
                        </span>
                      </div>
                    </label>
                    {sellerFormData.attachment && (
                      <button
                        type="button"
                        onClick={() =>
                          setSellerFormData((prev) => ({
                            ...prev,
                            attachment: null,
                          }))
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Destekleyici belgeler ekleyebilirsiniz (Ekran görüntüsü,
                    fatura vb.)
                  </p>
                </div>

                {/* Gönder Butonu */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Zorunlu alanlar
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-all flex items-center gap-2 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Mesaj Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        ) : (
          /* Ticket Listesi */
          <div className="space-y-4">
            {/* Filtre */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Durum Filtresi:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ticket Listesi */}
            {loadingTickets ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500">Ticketlar yükleniyor...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Henüz destek talebiniz bulunmuyor
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Yeni Talep Oluştur
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Ticket No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Konu
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm font-semibold text-blue-600">
                              {ticket.ticket_number || `#${ticket.id}`}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-700">
                              {ticket.subject}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-500">
                              {formatDate(ticket.created_at)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => openTicketModal(ticket)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Detayları Gör"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ticket Detay Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Ticket Detayları
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedTicket.ticket_number || `#${selectedTicket.id}`}
                </p>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Konu
                  </label>
                  <p className="mt-1 text-gray-800 font-medium">
                    {selectedTicket.subject}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Durum
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Satıcı Kullanıcı Adı
                  </label>
                  <p className="mt-1 text-gray-800 font-medium">
                    {selectedTicket.seller_username || `ID: ${selectedTicket.seller}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    E-posta
                  </label>
                  <p className="mt-1 text-gray-800">
                    {selectedTicket.seller_email || selectedTicket.email || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Telefon
                  </label>
                  <p className="mt-1 text-gray-800">
                    {selectedTicket.seller_telno || selectedTicket.telno || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Oluşturulma Tarihi
                  </label>
                  <p className="mt-1 text-gray-800">
                    {formatDate(selectedTicket.created_at)}
                  </p>
                </div>
                {selectedTicket.updated_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Güncellenme Tarihi
                    </label>
                    <p className="mt-1 text-gray-800">
                      {formatDate(selectedTicket.updated_at)}
                    </p>
                  </div>
                )}
                {selectedTicket.resolved_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Çözülme Tarihi
                    </label>
                    <p className="mt-1 text-gray-800">
                      {formatDate(selectedTicket.resolved_at)}
                    </p>
                  </div>
                )}
              </div>

              {/* Mesaj */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Mesajınız
                </label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedTicket.message}
                  </p>
                </div>
              </div>

              {/* Ek Dosya */}
              {selectedTicket.attachment && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Ek Dosya
                  </label>
                  <div className="mt-2">
                    <a
                      href={selectedTicket.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Dosyayı İndir</span>
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* İç Notlar (Admin notları) */}
              {selectedTicket.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Admin Notları
                  </label>
                  <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedTicket.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSupport;

