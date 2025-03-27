import React, { useState } from "react";
import axios from "axios"; // Axios'u import et
import "../styles/auth_Styles/login.css";
import banner from "../assets/images/auth_banner.jpg";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/vectors/google.svg";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et

const Register = () => {
  const navigate = useNavigate(); // useNavigate hook'unu çağır

  const apiUrl = "https://imecehub.com/users/rq_register/";
  const apiKey =
    "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";

  const goToOtherPage = () => {
    navigate("/login"); // Yönlendirme yapılacak sayfanın rotası
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    username.trim() !== "" &&
    termsAccepted;

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasMinLength) return "Şifre en az 8 karakter olmalıdır.";
    if (!hasUpperCase) return "Şifre en az bir büyük harf içermelidir.";
    if (!hasNumber) return "Şifre en az bir rakam içermelidir.";
    return null;
  };

  const errorTranslations = {
    "Email already exists.": "Bu e-posta adresi zaten kullanılıyor.",
    "Username already taken.": "Bu kullanıcı adı zaten alınmış.",
    "Password must be at least 8 characters.":
      "Şifre en az 8 karakter olmalıdır.",
    "Enter a valid email address.": "Geçerli bir e-posta adresi giriniz.",
    "Invalid role. Please select 'ALICI' or 'SATICI'.":
      "Geçersiz rol. Lütfen 'ALICI' veya 'SATICI' olarak seçin.",
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
      error.response?.data?.message || "Kayıt sırasında bir hata oluştu."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun submit olayını engelle
    setError("");

    if (!isFormValid) {
      setError("Lütfen tüm alanları doldurun ve şartları kabul edin.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post(
        apiUrl,
        {
          email,
          password,
          username,
          rol: "ALICI",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        }
      );

      if (response.data.status === "success") {
        localStorage.setItem("accessToken", response.data.tokens.access);
        localStorage.setItem("refreshToken", response.data.tokens.refresh);
        navigate("/");
      }
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setError(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth_inner_container">
        <div className="auth_logo">
          <img src={logo} alt="" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>
            {" "}
            <span className="green underlined">İmece'ye</span> Hoş geldin
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

          <label className="green underlined login-label" htmlFor="username">
            Kullanıcı Adı
          </label>
          <input
            className="login-input"
            type="text"
            id="username"
            value={username}
            placeholder="Kullanıcı adını gir"
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="green underlined login-label" htmlFor="password">
            Şifre
          </label>
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            placeholder="Şifreni gir"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
              isFormValid ? "login-submit-button-active " : ""
            }`}
            disabled={!isFormValid}
          >
            İlerle
          </button>

          <div className="or-divider">Yada</div>

          <button type="button" className="login-google-button clickable">
            <img className="login-google-logo" src={googleIcon} alt="Google" />{" "}
            <span> Google ile giriş yap</span>
          </button>
        </form>
        <div className="login-redirect">
          Henüz kurulmuş bir hesabınız yok mu?{" "}
          <span className="green pointer" onClick={goToOtherPage}>
            Şimdi oturum açın
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

export default Register;
