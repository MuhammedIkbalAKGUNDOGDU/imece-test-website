import { useState, useEffect } from "react";
import axios from "axios";
import { apiKey } from "../../config";
import Header from "../../components/GenerealUse/Header";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  FileText,
  X,
  RefreshCw,
  Store,
} from "lucide-react";

const SupportTicketsAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [sellerTickets, setSellerTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("normal"); // "normal" veya "seller"
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Filtreleme ve arama
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [selectedTickets, setSelectedTickets] = useState([]);

  const statusOptions = [
    { value: "all", label: "Tümü", color: "gray" },
    { value: "pending", label: "Beklemede", color: "orange" },
    { value: "in_progress", label: "İşlemde", color: "blue" },
    { value: "resolved", label: "Çözüldü", color: "green" },
    { value: "closed", label: "Kapatıldı", color: "gray" },
  ];

  const subjectOptions = [
    { value: "all", label: "Tümü" },
    { value: "Sipariş Sorunu", label: "Sipariş Sorunu" },
    { value: "Ürün Hakkında Soru", label: "Ürün Hakkında Soru" },
    { value: "Ödeme Sorunu", label: "Ödeme Sorunu" },
    { value: "Hesap Sorunu", label: "Hesap Sorunu" },
    { value: "Teknik Destek", label: "Teknik Destek" },
    { value: "İade/İptal", label: "İade/İptal" },
    { value: "Diğer", label: "Diğer" },
  ];

  useEffect(() => {
    if (activeTab === "normal") {
      fetchTickets();
    } else {
      fetchSellerTickets();
    }
    fetchUsers(); // Kullanıcı listesini çek (personel atama için)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, subjectFilter, activeTab]);

  // Arama için debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "normal") {
        fetchTickets();
      } else {
        fetchSellerTickets();
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeTab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      
      // Admin kullanıcıları için API endpoint (mevcut API'ye göre ayarlanabilir)
      // Eğer bu endpoint yoksa, normal kullanıcı listesi çekilebilir
      const response = await axios.get(
        "https://imecehub.com/api/users/staff-users/",
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data.results) {
        setUsers(response.data.results);
      }
    } catch (error) {
      console.error("Kullanıcılar alınamadı:", error);
      // Hata durumunda boş bırak, personel atama çalışmaz ama sayfa çalışır
      setUsers([]);
    }
  };

  const fetchTicketDetail = async (ticketId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      
      const endpoint = activeTab === "normal" 
        ? `https://imecehub.com/api/support/tickets/${ticketId}/`
        : `https://imecehub.com/api/support/seller-tickets/${ticketId}/`;
      
      const response = await axios.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Ticket detayı alınamadı:", error);
      return null;
    }
  };

  const handleSaveNotes = async (ticketId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMessage({
          type: "error",
          text: "Giriş yapmanız gerekiyor",
        });
        return;
      }

      // FormData kullan (backend MultiPartParser/FormParser bekliyor)
      const formData = new FormData();
      formData.append("notes", notes);

      const endpoint = activeTab === "normal"
        ? `https://imecehub.com/api/support/tickets/${ticketId}/`
        : `https://imecehub.com/api/support/seller-tickets/${ticketId}/`;

      await axios.patch(endpoint, formData, {
        headers: {
          "X-API-Key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({
        type: "success",
        text: "İç notlar kaydedildi",
      });

      // Ticket'ı güncelle
      if (selectedTicket) {
        setSelectedTicket({ ...selectedTicket, notes: notes });
      }
      
      if (activeTab === "normal") {
        fetchTickets();
      } else {
        fetchSellerTickets();
      }
    } catch (error) {
      console.error("Notlar kaydedilemedi:", error);
      
      let errorMessage = "Notlar kaydedilirken hata oluştu";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setMessage({
          type: "error",
          text: "Giriş yapmanız gerekiyor",
        });
        setLoading(false);
        return;
      }

      // Query parametreleri oluştur
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (subjectFilter !== "all") {
        params.append("subject", subjectFilter);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const url = `https://imecehub.com/api/support/tickets/${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          Authorization: `Bearer ${token}`,
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
      setMessage({ type: "", text: "" });
    } catch (error) {
      console.error("Ticket'lar alınamadı:", error);
      
      let errorMessage = "Ticketlar yüklenirken hata oluştu";
      
      if (error.response?.status === 401) {
        errorMessage = "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
      } else if (error.response?.status === 403) {
        errorMessage = "Bu sayfaya erişim yetkiniz yok.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setMessage({
          type: "error",
          text: "Giriş yapmanız gerekiyor",
        });
        setLoading(false);
        return;
      }

      // Query parametreleri oluştur
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (subjectFilter !== "all") {
        params.append("subject", subjectFilter);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const url = `https://imecehub.com/api/support/seller-tickets/${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      // API'den gelen veriyi kontrol et
      if (Array.isArray(response.data)) {
        setSellerTickets(response.data);
      } else if (response.data.results) {
        setSellerTickets(response.data.results);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setSellerTickets(response.data.data);
      } else {
        setSellerTickets([]);
      }
      setMessage({ type: "", text: "" });
    } catch (error) {
      console.error("Seller ticket'lar alınamadı:", error);
      
      let errorMessage = "Seller ticketlar yüklenirken hata oluştu";
      
      if (error.response?.status === 401) {
        errorMessage = "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
      } else if (error.response?.status === 403) {
        errorMessage = "Bu sayfaya erişim yetkiniz yok.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
      setSellerTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      setActionLoading((prev) => ({ ...prev, [ticketId]: true }));
      const token = localStorage.getItem("accessToken");

      // FormData kullan (backend MultiPartParser/FormParser bekliyor)
      const formData = new FormData();
      formData.append("status", newStatus);

      const endpoint = activeTab === "normal"
        ? `https://imecehub.com/api/support/tickets/${ticketId}/update_status/`
        : `https://imecehub.com/api/support/seller-tickets/${ticketId}/`;

      await axios.patch(endpoint, formData, {
        headers: {
          "X-API-Key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({
        type: "success",
        text: "Ticket durumu güncellendi",
      });

      if (activeTab === "normal") {
        fetchTickets();
      } else {
        fetchSellerTickets();
      }
      
      // Modal açıksa ticket'ı güncelle
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
      
      let errorMessage = "Durum güncellenirken hata oluştu";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleAssign = async (ticketId, userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [`assign-${ticketId}`]: true }));
      const token = localStorage.getItem("accessToken");

      // FormData kullan (backend MultiPartParser/FormParser bekliyor)
      const formData = new FormData();
      formData.append("assigned_to", userId);

      await axios.patch(
        `https://imecehub.com/api/support/tickets/${ticketId}/assign/`,
        formData,
        {
          headers: {
            "X-API-Key": apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: "success",
        text: userId ? "Ticket atandı" : "Ticket ataması kaldırıldı",
      });

      fetchTickets();
      
      // Modal açıksa ticket'ı güncelle
      if (selectedTicket && selectedTicket.id === ticketId) {
        const assignedUser = users.find(u => u.id === userId);
        setSelectedTicket({ 
          ...selectedTicket, 
          assigned_to: userId,
          assigned_to_email: assignedUser?.email || null
        });
        setSelectedUserId(userId);
      }
    } catch (error) {
      console.error("Atama hatası:", error);
      
      let errorMessage = "Atama yapılırken hata oluştu";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [`assign-${ticketId}`]: false }));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedTickets.length === 0) {
      setMessage({
        type: "error",
        text: "Lütfen en az bir ticket seçin",
      });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const baseEndpoint = activeTab === "normal"
        ? `https://imecehub.com/api/support/tickets/`
        : `https://imecehub.com/api/support/seller-tickets/`;
      
      const promises = selectedTickets.map((ticketId) => {
        if (action === "resolve") {
          const formData = new FormData();
          formData.append("status", "resolved");
          const endpoint = activeTab === "normal"
            ? `${baseEndpoint}${ticketId}/update_status/`
            : `${baseEndpoint}${ticketId}/`;
          return axios.patch(endpoint, formData, {
            headers: {
              "X-API-Key": apiKey,
              Authorization: `Bearer ${token}`,
            },
          });
        } else if (action === "close") {
          const formData = new FormData();
          formData.append("status", "closed");
          const endpoint = activeTab === "normal"
            ? `${baseEndpoint}${ticketId}/update_status/`
            : `${baseEndpoint}${ticketId}/`;
          return axios.patch(endpoint, formData, {
            headers: {
              "X-API-Key": apiKey,
              Authorization: `Bearer ${token}`,
            },
          });
        }
      });

      await Promise.all(promises);

      setMessage({
        type: "success",
        text: `${selectedTickets.length} ticket ${action === "resolve" ? "çözüldü" : "kapatıldı"}`,
      });

      setSelectedTickets([]);
      if (activeTab === "normal") {
        fetchTickets();
      } else {
        fetchSellerTickets();
      }
    } catch (error) {
      console.error("Toplu işlem hatası:", error);
      setMessage({
        type: "error",
        text: "Toplu işlem sırasında hata oluştu",
      });
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

  // Filtreleme ve arama - Artık backend'de yapılıyor, burada sadece client-side arama için
  const currentTickets = activeTab === "normal" ? tickets : sellerTickets;
  
  const filteredTickets = currentTickets.filter((ticket) => {
    // Eğer backend'de arama yapılmıyorsa client-side arama
    if (searchTerm) {
      const matchesSearch =
        ticket.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.seller_username?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
    }

    // Backend'de filtreleme yapılıyorsa bu kontroller gereksiz ama yine de yapıyoruz
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    const matchesSubject =
      subjectFilter === "all" || ticket.subject === subjectFilter;

    return matchesStatus && matchesSubject;
  });

  const handleTicketSelect = (ticketId) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map((t) => t.id));
    }
  };

  const openDetailModal = async (ticket) => {
    setSelectedTicket(ticket);
    setNotes(ticket.notes || "");
    setSelectedUserId(ticket.assigned_to?.id || ticket.assigned_to || null);
    setShowDetailModal(true);
    
    // Ticket detayını API'den çek (daha güncel bilgi için)
    const ticketDetail = await fetchTicketDetail(ticket.id);
    if (ticketDetail) {
      setSelectedTicket(ticketDetail);
      setNotes(ticketDetail.notes || "");
      setSelectedUserId(ticketDetail.assigned_to?.id || ticketDetail.assigned_to || null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Destek Talepleri Yönetimi
            </h1>
            <p className="text-gray-500 mt-1">
              Tüm destek taleplerini görüntüleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => {
              if (activeTab === "normal") {
                fetchTickets();
              } else {
                fetchSellerTickets();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Yenile
          </button>
        </div>

        {/* Tab Seçimi */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab("normal");
              setSelectedTickets([]);
            }}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "normal"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Normal Ticket'lar
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab("seller");
              setSelectedTickets([]);
            }}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "seller"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Satıcı Ticket'ları
            </div>
          </button>
        </div>

        {/* Mesaj Gösterimi */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : message.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Filtreleme ve Arama */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ticket numarası, isim, e-posta veya konu ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Durum Filtresi */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Konu Filtresi */}
            <div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toplu İşlemler */}
          {selectedTickets.length > 0 && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                {selectedTickets.length} ticket seçildi
              </span>
              <button
                onClick={() => handleBulkAction("resolve")}
                className="px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
              >
                Çözüldü İşaretle
              </button>
              <button
                onClick={() => handleBulkAction("close")}
                className="px-4 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition"
              >
                Kapat
              </button>
              <button
                onClick={() => setSelectedTickets([])}
                className="px-4 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
              >
                Seçimi Temizle
              </button>
            </div>
          )}
        </div>

        {/* Ticket Listesi */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Ticketlar yükleniyor...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {currentTickets.length === 0
                ? activeTab === "normal"
                  ? "Henüz destek talebi bulunmuyor"
                  : "Henüz satıcı destek talebi bulunmuyor"
                : "Filtre kriterlerine uygun ticket bulunamadı"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedTickets.length === filteredTickets.length &&
                          filteredTickets.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ticket No
                    </th>
                    {activeTab === "normal" && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          İsim
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          E-posta
                        </th>
                      </>
                    )}
                    {activeTab === "seller" && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Satıcı
                      </th>
                    )}
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
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => handleTicketSelect(ticket.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm font-semibold text-blue-600">
                          {ticket.ticket_number || `#${ticket.id}`}
                        </span>
                      </td>
                      {activeTab === "normal" && (
                        <>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-800">
                                {ticket.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {ticket.email}
                              </span>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === "seller" && (
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-800">
                              {ticket.seller_username || `ID: ${ticket.seller}`}
                            </span>
                          </div>
                        </td>
                      )}
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetailModal(ticket)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Detayları Gör"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {ticket.status !== "in_progress" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(ticket.id, "in_progress")
                              }
                              disabled={actionLoading[ticket.id]}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition disabled:opacity-50"
                              title="İşleme Al"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          {ticket.status !== "resolved" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(ticket.id, "resolved")
                              }
                              disabled={actionLoading[ticket.id]}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition disabled:opacity-50"
                              title="Çözüldü İşaretle"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {ticket.status !== "closed" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(ticket.id, "closed")
                              }
                              disabled={actionLoading[ticket.id]}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded transition disabled:opacity-50"
                              title="Kapat"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Toplam</p>
                <p className="text-2xl font-bold text-gray-800">
                  {currentTickets.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Beklemede</p>
                <p className="text-2xl font-bold text-orange-600">
                  {currentTickets.filter((t) => t.status === "pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">İşlemde</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentTickets.filter((t) => t.status === "in_progress").length}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Çözüldü</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentTickets.filter((t) => t.status === "resolved").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Detay Modal */}
      {showDetailModal && selectedTicket && (
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
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === "normal" && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Ad Soyad
                      </label>
                      <p className="mt-1 text-gray-800 font-medium">
                        {selectedTicket.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        E-posta
                      </label>
                      <p className="mt-1 text-gray-800">{selectedTicket.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Telefon
                      </label>
                      <p className="mt-1 text-gray-800">
                        {selectedTicket.phone || "-"}
                      </p>
                    </div>
                  </>
                )}
                {activeTab === "seller" && (
                  <>
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
                  </>
                )}
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
                    Konu
                  </label>
                  <p className="mt-1 text-gray-800">{selectedTicket.subject}</p>
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
                  Mesaj
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
                      <span>
                        {selectedTicket.attachment_name ||
                          "Dosyayı İndir"}
                      </span>
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Personel Atama - Sadece normal ticket'lar için */}
              {activeTab === "normal" && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Atanan Personel
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedUserId || ""}
                      onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Personel Seçin</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        if (selectedTicket) {
                          handleAssign(selectedTicket.id, selectedUserId);
                        }
                      }}
                      disabled={actionLoading[`assign-${selectedTicket?.id}`]}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {actionLoading[`assign-${selectedTicket?.id}`] ? "Atanıyor..." : "Ata"}
                    </button>
                  </div>
                  {selectedTicket?.assigned_to && (
                    <p className="mt-2 text-sm text-gray-600">
                      Şu anda atanan: {selectedTicket.assigned_to_email || selectedTicket.assigned_to?.email || "Bilinmiyor"}
                    </p>
                  )}
                </div>
              )}

              {/* İç Notlar */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  İç Notlar
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="İç notlar (kullanıcıya gösterilmez)"
                />
                <button
                  onClick={() => {
                    if (selectedTicket) {
                      handleSaveNotes(selectedTicket.id);
                    }
                  }}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Notları Kaydet
                </button>
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {selectedTicket.status !== "in_progress" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTicket.id, "in_progress");
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    İşleme Al
                  </button>
                )}
                {selectedTicket.status !== "resolved" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTicket.id, "resolved");
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Çözüldü İşaretle
                  </button>
                )}
                {selectedTicket.status !== "closed" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTicket.id, "closed");
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Kapat
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsAdmin;



