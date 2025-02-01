import React, { useState } from "react";
import "../styles/auth_Styles/login.css";
import banner from "../assets/images/auth_banner.jpg";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/vectors/google.svg";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et
import axios from "axios";

const login = () => {
  const navigate = useNavigate(); // useNavigate hook'unu çağır
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = "https://34.22.218.90/users/rq_login/";
  const apiKey = "fb10ca29411e8fa4725e11ca519b732de5c911769ff1956e84d4";

  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && termsAccepted;

  const goToOtherPage = () => {
    navigate("/register"); // Yönlendirme yapılacak sayfanın rotası
  };
  const googleLogin = () => {
    navigate("/register"); // Yönlendirme yapılacak sayfanın rotası
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun submit olayını engelle

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

      if (response.data.status.toLowerCase() === "success") {
        localStorage.setItem("accessToken", response.data.tokens.access);
        localStorage.setItem("refreshToken", response.data.tokens.refresh);
      }

      // Kayıt başarılıysa kullanıcıyı login sayfasına yönlendir
      navigate("/");
    } catch (error) {
      setError(
        "Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin."
      );
      console.error("Kayıt hatası:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth_inner_container">
        <div className="auth_logo">
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

export default login;
