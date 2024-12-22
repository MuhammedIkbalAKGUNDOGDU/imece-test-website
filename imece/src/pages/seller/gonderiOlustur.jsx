import React from "react";
import "../../styles/seller/gonderiolustur.css";
const gonderiOlustur = () => {
  return (
    <div className="gonderiolusturma-container">
      <div className="gonderiolusturma-left">
        <div>
          <p>Gönderi Oluştur</p>
        </div>
        <div className="gonderiolustur-cont1">
          <p className="notmargin">Medya</p>
          <p className="notmargin gray">Fotoğraf veya bir video paylaş.</p>
          <div className="gonderiolustur-cont1-2">
            <div className="gonderiolustur-cont1-2-3">
              {" "}
              <input type="file" accept="image/*" />
            </div>
            <div className="gonderiolustur-cont1-2-3">
              {" "}
              <input type="file" accept="video/*" />
            </div>
          </div>
        </div>

        <div className="gonderiolustur-cont2">
          <p>Gönderi Detayları</p>
          <label>Metin</label>
          <textarea placeholder="Metin girin..." />
        </div>

        <div className="gonderiolustur-cont3">
          <p>Gönderi Paylaştıktan Sonra Düzenlenebilir</p>
          <div className="gonderiolustur-cont3-1">İptal Et</div>
          <div className="gonderiolustur-cont3-1">Daha Sonra Bitir</div>
          <div className="gonderiolustur-cont3-2">Paylaş</div>
        </div>
      </div>
      <div className="gonderiolusturma-rigth"></div>
    </div>
  );
};

export default gonderiOlustur;
