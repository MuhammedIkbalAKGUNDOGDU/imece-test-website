import React, { useState } from "react";
import "../styles/auth_Styles/login.css";
import banner from "../assets/images/auth_banner.jpg";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/vectors/google.svg";
import { useNavigate } from "react-router-dom"; // Yönlendirme için hook'u import et

const register = () => {
  const navigate = useNavigate(); // useNavigate hook'unu çağır

  const goToOtherPage = () => {
    navigate("/login"); // Yönlendirme yapılacak sayfanın rotası
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    nickname.trim() !== "" &&
    termsAccepted;
  return (
    <div className="auth-container">
      <div className="auth_inner_container">
        <div className="auth_logo">
          <img src={logo} alt="" />
        </div>
        <form class="login-form">
          <h2>
            {" "}
            <span className="green underlined">İmece'e</span> Hoş geldin
          </h2>
          <label className="green underlined login-label" for="email">
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
            value={nickname}
            placeholder="Kullanıcı adını gir"
            onChange={(e) => setNickname(e.target.value)}
            required
          />

          <label className="green underlined login-label" for="password">
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

          <div class="terms">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <label for="terms">
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

          <div class="or-divider">Yada</div>

          <button type="button" class="login-google-button clickable">
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

export default register;
