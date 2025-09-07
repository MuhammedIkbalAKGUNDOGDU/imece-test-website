import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/earlyAccess.css";
import { API_BASE_URL } from "../config";
import emailjs from "@emailjs/browser";

const EarlyAccess = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const features = [
    {
      icon: "🎯",
      title: "Ömür Bayu %2 Komisyon İndirimi",
      description: "Erken kayıt olan satıcılar için özel komisyon indirimi",
    },
    {
      icon: "👥",
      title: "Grup Alım Sistemi",
      description: "Müşterileriniz toplu alım yaparak daha fazla satış",
    },
    {
      icon: "💬",
      title: "Müşteri İletişim Ağı",
      description:
        "Türkiye'nin her yerindeki müşterilerinizle doğrudan iletişim kurun",
    },
    {
      icon: "📱",
      title: "Sosyal Medya Entegrasyonu",
      description: "Müşterilerinizle sosyal medya üzerinden güçlü bağlar kurun",
    },
    {
      icon: "📢",
      title: "Ücretsiz Reklam",
      description: "Hikayelerinizi ve kampanyalarınızı ücretsiz yayınlayın",
    },
    {
      icon: "🛒",
      title: "Perakende & Toptan Satış",
      description: "Perakende satış karlılığı, toptan satış kolaylığı",
    },
    {
      icon: "🚀",
      title: "Yeni Nesil E-Ticaret",
      description:
        "Ürününüze uygun grup alım sistemiyle satışlarınızı arttırın!",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch registration count on component mount
  useEffect(() => {
    fetchRegistrationCount();
  }, []);

  // Animate counter when registrationCount changes
  useEffect(() => {
    if (registrationCount > 0) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = registrationCount / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const newDisplayCount = Math.min(
          Math.floor(increment * currentStep),
          registrationCount
        );
        setDisplayCount(newDisplayCount);

        if (currentStep >= steps) {
          clearInterval(timer);
          setDisplayCount(registrationCount);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [registrationCount]);

  const fetchRegistrationCount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/count-early-access/`);
      if (response.ok) {
        const data = await response.json();
        setRegistrationCount((data.toplam_kayit || 0) + 121);
      } else {
        console.error("Failed to fetch registration count");
      }
    } catch (error) {
      console.error("Error fetching registration count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setModalEmail(email);
      setShowModal(true);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalEmail && modalPhone && modalName) {
      setIsSubmitting(true);
      setError("");

      try {
        // Split name into first and last name
        const nameParts = modalName.trim().split(" ");
        const ad = nameParts[0];
        const soyad = nameParts.slice(1).join(" ") || "";

        const response = await fetch(
          `${API_BASE_URL}/users/add-early-access/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ad: ad,
              soyad: soyad,
              eposta: modalEmail,
              telno: modalPhone,
            }),
          }
        );

        if (response.ok) {
          setModalSubmitted(true);
          setSuccessMessage(
            "Kayıt başarılı! Size en kısa sürede dönüş yapacağız."
          );
          // Update the counter after successful registration
          await fetchRegistrationCount();
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Kayıt sırasında bir hata oluştu.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalSubmitted(false);
    setModalEmail("");
    setModalPhone("");
    setModalName("");
    setError("");
    setSuccessMessage("");
  };

  // Format number with leading zeros for display
  const formatCounterNumber = (num) => {
    return num.toString().padStart(3, "0");
  };

  // Handle contact form submission with EmailJS
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (contactEmail && contactPhone) {
      setIsSendingEmail(true);

      try {
        // EmailJS template parameters
        const templateParams = {
          to_email: "info@imecehub.com",
          from_email: contactEmail,
          phone: contactPhone,
          message: contactMessage || "Genel bilgi almak istiyorum.",
          subject: "İmece Hub - Bilgilendirme Talebi",
          reply_to: contactEmail,
          name: contactEmail.split("@")[0], // Email'den isim çıkar
          time: new Date().toLocaleString("tr-TR"), // Türkçe tarih formatı
        };

        // Send email using EmailJS
        const result = await emailjs.send(
          "service_f1b32ft", // EmailJS service ID
          "template_rsphufi", // EmailJS template ID
          templateParams,
          "Y853P3sW1qMfC2sm3" // EmailJS public key
        );

        if (result.status === 200) {
          setShowSuccessModal(true);
          // Clear form after successful sending
          setContactEmail("");
          setContactPhone("");
          setContactMessage("");
        }
      } catch (error) {
        console.error("Email gönderme hatası:", error);
        alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setIsSendingEmail(false);
      }
    }
  };

  return (
    <div className="early-access-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="logo-section">
            <img src="/logo.png" alt="İmece Hub" className="logo" />
          </div>

          <h1 className="hero-title">
            <span className="title-line">Yeni Nesil</span>
            <span className="title-line highlight">E-Ticaret</span>
            <span className="title-line">Platformu</span>
          </h1>

          <p className="hero-subtitle">
            Satıcı olarak erken kayıt ol, avantajları kaçırma
          </p>

          {/* Registration Counter */}
          <div className="registration-counter">
            <div className="counter-content">
              <div className="counter-number">
                {isLoading ? (
                  <span className="counter-loading">...</span>
                ) : (
                  formatCounterNumber(displayCount)
                    .split("")
                    .map((digit, index) => (
                      <span key={index} className="counter-digit">
                        {digit}
                      </span>
                    ))
                )}
              </div>
              <div className="counter-label">Satıcı Kayıt Oldu</div>
            </div>
          </div>

          <div className="cta-section">
            <form onSubmit={handleSubmit} className="email-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresinizi girin"
                  className="email-input"
                  required
                />
                <button type="submit" className="submit-btn">
                  Satıcı Olarak Kayıt Ol
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Group Buying System Section */}
      <section className="group-system-section">
        <div className="container">
          <div className="group-system-content">
            <div className="group-system-header">
              <h2>
                Türkiye'ye grup alım sistemini getirmenin gururunu yaşıyoruz
                <span className="flag-emoji">🇹🇷</span>
              </h2>
              <p className="group-system-subtitle">
                Bu sistem Türk ticaretindeki hantallığı atıp daha seri bir
                ticaretin önünü açacak. Nasıl mı? Gelin birlikte inceleyelim
                <span className="smile-emoji">😊</span>
              </p>
            </div>

            <div className="group-system-explanation">
              <div className="explanation-item">
                <span className="explanation-emoji">👨‍👨‍👧‍👧</span>
                <div className="explanation-text">
                  <strong>Grup Alım Sistemi Nedir?</strong> Grup alım sistemi
                  alıcıların küçük taleplerini birleşerek satıcıya ilettiği bir
                  yapıdır.
                </div>
              </div>

              <div className="explanation-item">
                <span className="explanation-emoji">✂️</span>
                <div className="explanation-text">
                  <strong>Fiyat Makası Kapanır</strong> Bu sistem sayesinde
                  üretici satış ile tüketici alım fiyatı arasındaki makas
                  kapanır.
                </div>
              </div>

              <div className="explanation-item">
                <span className="explanation-emoji">🎊</span>
                <div className="explanation-text">
                  <strong>Eğlenceli Alışveriş</strong> Sevdikleriyle beraber
                  alışveriş yaptığı için alışveriş yük değil daha eğlenceli bir
                  hal alır.
                </div>
              </div>

              <div className="explanation-item">
                <span className="explanation-emoji">📦</span>
                <div className="explanation-text">
                  <strong>Satıcı Avantajı</strong> Satıcı için perakende
                  e-ticaret zorluğundansa yaptığı bir satışta toplu ürün çıkışı
                  yapar, ürünler müşterilerine teslim edilir.
                </div>
              </div>

              <div className="explanation-item highlight-item">
                <span className="explanation-emoji">💰</span>
                <div className="explanation-text">
                  <strong>Her Ürün İçin Uygun</strong> "Benim ürünüm e-ticarete
                  veya grup alıma uygun değil" diye düşünmeyin. Birçok farklı
                  grup alım sistemiyle ürününüze uygun grubu seçebilir ve
                  satışların keyfini çıkarabilirsiniz!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Neden İmece Hub?</h2>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${
                  index === currentFeature ? "active" : ""
                }`}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Erken Kayıt Avantajları</h2>
              <ul className="benefits-list">
                <li>
                  <span className="benefit-icon">🎁</span>
                  <span>Ömür Bayu %2 Komisyon İndirimi</span>
                </li>
                <li>
                  <span className="benefit-icon">👥</span>
                  <span>Grup alım sistemi ile daha fazla satış</span>
                </li>
                <li>
                  <span className="benefit-icon">💬</span>
                  <span>Türkiye genelinde müşteri iletişim ağı</span>
                </li>
                <li>
                  <span className="benefit-icon">📱</span>
                  <span>
                    Platform içi sosyal medya entegrasyonu ile güçlü bağlar
                  </span>
                </li>
                <li>
                  <span className="benefit-icon">📢</span>
                  <span>Ücretsiz hikaye ve kampanya yayını</span>
                </li>
                <li>
                  <span className="benefit-icon">🛍️</span>
                  <span>Perakende satış karlılığı, toptan satış kolaylığı</span>
                </li>
                <li>
                  <span className="benefit-icon">🏪</span>
                  <span>Perakende ve toptan satış imkanları</span>
                </li>
                <li>
                  <span className="benefit-icon">⚡</span>
                  <span>Öncelikli müşteri desteği</span>
                </li>
              </ul>
            </div>

            <div className="benefits-visual">
              <div className="visual-card">
                <div className="card-header">
                  <div className="card-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="mock-interface">
                    <div className="mock-header">İmece Hub Dashboard</div>
                    <div className="mock-stats">
                      <div className="stat-item">
                        <span className="stat-label">Komisyon</span>
                        <span className="stat-value">%2</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Kampanyalar</span>
                        <span className="stat-value">Sınırsız</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <h2>Ekstra Bilgi Almak İstiyorsanız</h2>
            <p>
              Size özel danışmanlık ve detaylı bilgilendirme için bize ulaşın
            </p>

            <div className="contact-form">
              <form className="info-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="form-input"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Telefon numaranız"
                      className="form-input"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Merak ettiğiniz konuları yazabilirsiniz (opsiyonel)"
                    className="form-textarea"
                    rows="4"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`contact-btn ${isSendingEmail ? "loading" : ""}`}
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? (
                    <>
                      <span className="loading-spinner"></span>
                      Gönderiliyor...
                    </>
                  ) : (
                    "Bilgilendirme İste"
                  )}
                </button>
              </form>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@imecehub.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+90 (555) 123 45 67</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Satıcı Olarak Hemen Başla</h2>
            <p>
              Yeni nesil e-ticaret platformunda ürünlerinizi satmaya başlayın
            </p>
            <div className="cta-buttons">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Satıcı Kaydı Yap
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="early-access-footer">
        <div className="container">
          <p>&copy; 2024 İmece Hub. Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Satıcı Kaydı</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {!modalSubmitted ? (
                <form onSubmit={handleModalSubmit} className="modal-form">
                  {error && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Ad Soyad</label>
                    <input
                      type="text"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      placeholder="Adınızı ve soyadınızı girin"
                      className="modal-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label>E-posta</label>
                    <input
                      type="email"
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                      placeholder="E-posta adresinizi girin"
                      className="modal-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      type="tel"
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value)}
                      placeholder="Telefon numaranızı girin"
                      className="modal-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`modal-submit-btn ${
                      isSubmitting ? "loading" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Kayıt Yapılıyor...
                      </>
                    ) : (
                      "Kayıt Ol"
                    )}
                  </button>
                </form>
              ) : (
                <div className="modal-success">
                  <div className="success-icon-large">✓</div>
                  <h3>Kayıt Başarılı!</h3>
                  <p>{successMessage}</p>
                  <button onClick={closeModal} className="modal-close-btn">
                    Tamam
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="modal-content success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-modal-content">
              <div className="success-animation">
                <div className="success-checkmark">
                  <div className="check-icon">✓</div>
                </div>
              </div>
              <h2 className="success-title">Mesajınız Başarıyla Gönderildi!</h2>
              <p className="success-message">
                Bilgilendirme talebiniz alındı. Size en kısa sürede dönüş
                yapacağız.
              </p>
              <div className="success-details">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <span>E-posta adresinize onay mesajı gönderildi</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏰</span>
                  <span>24 saat içinde size dönüş yapacağız</span>
                </div>
              </div>
              <button
                className="success-close-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarlyAccess;
