import React from "react";
import "../../styles/general_styles/footer.css";
import instagram from "../../assets/vectors/instagram.svg";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-title1 footer-imece-header">
          <p style={{ fontWeight: "900", fontSize: "50px", margin: "0" }}>
            İmece
          </p>
          <p style={{ fontWeight: "900", fontSize: "32px", margin: "0" }}>
            hakkında
          </p>
        </div>
        <div className="footer-content underlined">
          <div>Hangi çözümleri sunuyoruz?</div>
          <div>Müşterilerimiz kim?</div>
          <div>İmece’in sosyal faydaları nelerdir? </div>
          <div>Neden imece?</div>
          <div>Yatırımcılarımız.</div>
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-title1">
          <p style={{ fontWeight: "900", fontSize: "32px" }}>Sosyal Medya</p>
        </div>

        <div className="footer-content underlined">
          <div className="footer-withimg">
            <img src={instagram} alt="" />
            <div>imecetarimvelojistik</div>
          </div>
          <div className="footer-withimg">
            <img src="" alt="" />
            <div>Lorem, ipsum dolor.</div>
          </div>
          <div className="footer-withimg">
            <img src="" alt="" />
            <div>Lorem, ipsum dolor.</div>
          </div>
        </div>
      </div>
      <div className="footer-content-position">
        <div className="footer-title1">
          {" "}
          <p style={{ fontWeight: "900", fontSize: "32px" }}> İletişim</p>
        </div>

        <div className="footer-content underlined">
          <div className="footer-withimg">
            <img src="" alt="" />
            <p>imecetarimvelojistik@gmail.com</p>
          </div>
          <div className="footer-withimg">
            <img src="" alt="" />
            <p> İmece tarım ve lojistik</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
