import React, { useState } from "react";
import "../styles/auth_Styles/login.css";
import banner from "../assets/images/auth_banner.jpg";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/vectors/google.svg";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
import axios from "axios";
import { apiKey } from "../config";  // veya "../constants" dosya ismine göre

const login = () => {
  const navigate = useNavigate(); // useNavigate hook'unu çağır
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

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

  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && termsAccepted;

  const goToOtherPage = () => {
    navigate("/register-seller"); // Yönlendirme yapılacak sayfanın rotası
  };
  const googleLogin = () => {
    navigate("/register"); // Yönlendirme yapılacak sayfanın rotası
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Lütfen tüm alanları doldurun ve şartları kabul edin.");
      return;
    }

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
        <div onClick={() => navigate("/")} className="auth_logo cursor-pointer">
          <img src={logo} alt="" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">
            {" "}
            <span className="green underlined">İmece'e</span> Hoş geldin
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
          <input
            className="login-input"
            type="password"
            id="password"
            placeholder="Şifreni gir"
            value={password}
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

export default login;
