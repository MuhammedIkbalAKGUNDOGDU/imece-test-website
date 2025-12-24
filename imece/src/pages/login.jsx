import { useState, useEffect } from "react";
import "../styles/auth_Styles/login.css";
import banner from "../assets/images/auth_banner.jpg";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/vectors/google.svg";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
import axios from "axios";
import { apiKey } from "../config"; // veya "../constants" dosya ismine göre
import { Check, X, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate(); // useNavigate hook'unu çağır
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Şifre validasyon kuralları
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const apiUrl = "https://imecehub.com/users/rq_login/";

  const errorTranslations = {
    "Invalid email or password.": "E-posta veya şifre hatalı.",
    "Enter a valid email address.": "Geçerli bir e-posta adresi giriniz.",
  };

  const translateError = (error) => {
    return errorTranslations[error] || error;
  };

  const formatErrorMessage = (error) => {
    if (error.response?.data?.errors) {
      const errorMessages = [];
      const errors = error.response.data.errors;
      Object.keys(errors).forEach((key) => {
        errors[key].forEach((err) => {
          errorMessages.push(translateError(err));
        });
      });
      return errorMessages;
    }
    return translateError(
      error.response?.data?.message || "Giriş sırasında bir hata oluştu."
    );
  };

  // Şifre değiştiğinde kuralları kontrol et
  useEffect(() => {
    if (password) {
      setPasswordRules({
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      });
    } else {
      setPasswordRules({
        minLength: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    }
  }, [password]);

  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && termsAccepted;

  const goToOtherPage = () => {
    navigate("/register"); // Yönlendirme yapılacak sayfanın rotası
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Lütfen tüm alanları doldurun ve şartları kabul edin.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        apiUrl,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        }
      );

      if (response.data.status === "success") {
        const accessToken = response.data.tokens.access;
        const refreshToken = response.data.tokens.refresh;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Kullanıcı bilgilerini çek ve rol kontrolü yap
        try {
          const userResponse = await axios.get(
            "https://imecehub.com/api/users/kullanicilar/me/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-API-Key": apiKey,
                "Content-Type": "application/json",
              },
            }
          );
          
          const userRole = userResponse.data?.rol;
          
          // Eğer kullanıcı satıcı ise seller landing sayfasına yönlendir
          if (userRole === "satici") {
            navigate("/seller/landing");
          } else {
            // Normal kullanıcı ise ana sayfaya yönlendir
            navigate("/");
          }
        } catch (userError) {
          console.error("Kullanıcı bilgileri alınamadı:", userError);
          // Kullanıcı bilgileri alınamazsa yine de ana sayfaya yönlendir
          navigate("/");
        }
      }
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setError(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth_inner_container">
        <div onClick={() => navigate("/")} className="auth_logo cursor-pointer">
          <img src={logo} alt="" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">
            {" "}
            <span className="green underlined">İmece&apos;e</span> Hoş geldin
          </h2>
          <label className="green underlined login-label" htmlFor="email">
            E posta
          </label>
          <input
            className="login-input"
            type="email"
            id="email"
            value={email}
            placeholder="E postanı gir"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="green underlined login-label" htmlFor="password">
            Şifre
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Şifreni gir"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: "40px", width: "100%", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                outline: "none"
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Şifre Validasyon Kuralları */}
          {password && (
            <div className="password-rules" style={{ marginTop: "8px", fontSize: "12px" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                color: passwordRules.minLength ? "#10b981" : "#6b7280",
                marginBottom: "4px"
              }}>
                {passwordRules.minLength ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}
                <span>En az 8 karakter</span>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                color: passwordRules.hasUpperCase ? "#10b981" : "#6b7280",
                marginBottom: "4px"
              }}>
                {passwordRules.hasUpperCase ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}
                <span>En az bir büyük harf</span>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                color: passwordRules.hasNumber ? "#10b981" : "#6b7280",
                marginBottom: "4px"
              }}>
                {passwordRules.hasNumber ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}
                <span>En az bir rakam</span>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                color: passwordRules.hasSpecialChar ? "#10b981" : "#6b7280"
              }}>
                {passwordRules.hasSpecialChar ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}
                <span>En az bir özel karakter</span>
              </div>
            </div>
          )}

          <div className="terms">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              <a className="green underlined" href="#">
                Hizmet Koşullarını ve Gizlilik Politikasını
              </a>{" "}
              okudum ve kabul ediyorum.
            </label>
          </div>

          {error && (
            <div className="error-container">
              {Array.isArray(error) ? (
                <ul className="error-list">
                  {error.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className={`login-submit-button ${
              isFormValid && !isLoading ? "login-submit-button-active " : ""
            }`}
            disabled={!isFormValid || isLoading}
            style={{ position: "relative" }}
          >
            {isLoading ? (
              <>
                <span style={{ marginRight: "8px" }}>Yükleniyor...</span>
                <div style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></div>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </>
            ) : (
              "İlerle"
            )}
          </button>

          <div className="or-divider">Yada</div>

          <div className="login-google-button clickable">
            <img className="login-google-logo" src={googleIcon} alt="Google" />{" "}
            <span> Google ile giriş yap</span>
          </div>
        </form>
        <div className="login-redirect">
          Henüz kurulmuş bir hesabınız yok mu?{" "}
          <span onClick={goToOtherPage} className="green pointer">
            Şimdi kayıt olun
          </span>
        </div>
      </div>

      <div className="auth_banner">
        <img src={banner} alt="" />
        <h2 className="auth-banner-imece">imece.com</h2>
      </div>
    </div>
  );
};

export default Login;
