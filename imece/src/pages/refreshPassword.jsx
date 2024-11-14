import React from "react";
import "../styles/auth_Styles/login.css";
import banner from "../assets/images/auth_banner.jpg";
import logo from "../assets/images/logo.png";
import googleIcon from "../assets/vectors/google.svg";
import { useNavigate } from "react-router-dom";  // Yönlendirme için hook'u import et

const refreshPassword = () => {
  const navigate = useNavigate();  // useNavigate hook'unu çağır

  const goToOtherPage =() =>{
    navigate("/login");  // Yönlendirme yapılacak sayfanın rotası deneme
  }

  return (
    <div className="auth-container">
      <div className="auth_inner_container">
        <div className="auth_logo">
          <img src={logo} alt="" />
        </div>
        <form class="login-form">
            <h2> <span className="green underlined">İmece'e</span> Hoş geldin</h2>
            <label className="green underlined login-label" for="email">Yeni Şifre</label>
            <input className="login-input" type="email" id="email" placeholder="E postanı gir" required/>

            <label className="green underlined login-label" for="password">Yeni Şifreni Doğrula</label>
            <input className="login-input" type="password" id="password" placeholder="Şifreni gir" required/>

            <button type="submit" class="login-submit-button " disabled>İlerle</button>

            <div class="or-divider">Yada</div>

            <button type="button" class="login-google-button clickable"> 
                <img className="login-google-logo" src={googleIcon} alt="Google"/> <span> Google ile giriş yap</span>
            </button>
        </form>
        <div className="login-redirect">Zaten bir hesabınız var mı? <span onClick={goToOtherPage} className="green pointer" >Şimdi giriş yapın</span></div>
      </div>
      
      <div className="auth_banner">
       
        <img src={banner} alt="" />
        <h2 className="auth-banner-imece" >imece.com</h2>
      </div>
    </div>
  );
};

export default refreshPassword;
