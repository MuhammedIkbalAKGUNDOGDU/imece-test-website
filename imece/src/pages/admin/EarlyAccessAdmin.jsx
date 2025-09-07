import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import "../../styles/admin/earlyAccessAdmin.css";

const EarlyAccessAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("kayit_tarihi");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch early access registrations
  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/get-early-access/`);

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      } else {
        setError("Kayıtlar yüklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setError("Kayıtlar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filter and sort registrations
  const filteredAndSortedRegistrations = registrations
    .filter((reg) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        reg.ad.toLowerCase().includes(searchLower) ||
        reg.soyad.toLowerCase().includes(searchLower) ||
        reg.eposta.toLowerCase().includes(searchLower) ||
        reg.telno.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "kayit_tarihi") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Ad", "Soyad", "E-posta", "Telefon", "Kayıt Tarihi"];
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedRegistrations.map((reg) =>
        [
          reg.id,
          reg.ad,
          reg.soyad,
          reg.eposta,
          reg.telno,
          formatDate(reg.kayit_tarihi),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `early-access-registrations-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="early-access-admin">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Early Access Kayıtları</h1>
          <div className="header-actions">
            <button
              className="refresh-btn"
              onClick={fetchRegistrations}
              disabled={isLoading}
            >
              {isLoading ? "Yükleniyor..." : "Yenile"}
            </button>
            <button
              className="export-btn"
              onClick={exportToCSV}
              disabled={isLoading || registrations.length === 0}
            >
              CSV İndir
            </button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-number">{registrations.length}</div>
            <div className="stat-label">Toplam Kayıt</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {
                registrations.filter((reg) => {
                  const today = new Date();
                  const regDate = new Date(reg.kayit_tarihi);
                  return regDate.toDateString() === today.toDateString();
                }).length
              }
            </div>
            <div className="stat-label">Bugünkü Kayıtlar</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {
                registrations.filter((reg) => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(reg.kayit_tarihi) > weekAgo;
                }).length
              }
            </div>
            <div className="stat-label">Son 7 Gün</div>
          </div>
        </div>

        <div className="admin-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Ad, soyad, e-posta veya telefon ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="kayit_tarihi">Kayıt Tarihi</option>
              <option value="ad">Ad</option>
              <option value="soyad">Soyad</option>
              <option value="eposta">E-posta</option>
            </select>
            <button
              className={`sort-btn ${sortOrder}`}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div className="registrations-table-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Kayıtlar yükleniyor...</p>
            </div>
          ) : filteredAndSortedRegistrations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Kayıt Bulunamadı</h3>
              <p>
                {searchTerm
                  ? "Arama kriterlerinize uygun kayıt bulunamadı."
                  : "Henüz early access kaydı bulunmuyor."}
              </p>
            </div>
          ) : (
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad Soyad</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRegistrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="id-cell">{registration.id}</td>
                    <td className="name-cell">
                      <div className="name-info">
                        <span className="full-name">
                          {registration.ad} {registration.soyad}
                        </span>
                      </div>
                    </td>
                    <td className="email-cell">
                      <a
                        href={`mailto:${registration.eposta}`}
                        className="email-link"
                      >
                        {registration.eposta}
                      </a>
                    </td>
                    <td className="phone-cell">
                      <a
                        href={`tel:${registration.telno}`}
                        className="phone-link"
                      >
                        {registration.telno}
                      </a>
                    </td>
                    <td className="date-cell">
                      <div className="date-info">
                        <span className="date">
                          {formatDate(registration.kayit_tarihi)}
                        </span>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          className="action-btn email-btn"
                          onClick={() =>
                            window.open(`mailto:${registration.eposta}`)
                          }
                          title="E-posta Gönder"
                        >
                          📧
                        </button>
                        <button
                          className="action-btn phone-btn"
                          onClick={() =>
                            window.open(`tel:${registration.telno}`)
                          }
                          title="Telefon Et"
                        >
                          📞
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredAndSortedRegistrations.length > 0 && (
          <div className="table-footer">
            <p>
              Toplam {filteredAndSortedRegistrations.length} kayıt gösteriliyor
              {searchTerm && ` (${registrations.length} toplam kayıttan)`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarlyAccessAdmin;
