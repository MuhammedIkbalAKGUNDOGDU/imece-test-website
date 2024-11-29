import React from "react";
import star from "../../assets/vectors/star.svg";
import { FaArrowRightLong } from "react-icons/fa6";

const itemCard = () => {
  return (
    <div className="popular-box  pointer">
      {/* burada bulunan css claslarının popular ile baslayanlari popular.css dosyasında bulunuyor*/}

      <div className="popular-image">
        <img
          src="https://s3-alpha-sig.figma.com/img/ebab/4772/fece3f97244726a20a8e0f7945edd37e?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oq3Gpu9gMnqe~p3NRjPbVQnBSqK5vHexROMkh2yewhm5USW4Z-rexMj87Lxr0qr3aeGuIR0rI8z9KKidZyo68Gf47P-1uuR7VbkhkaKlgyKVeyfR5v8SB4waL~5wnqxzzBokyGpK-dGfVDO6T0sxYlLxh0o5EafLQ-pbrV5PIEn70xYDCKucMpE3aXVCf~NqLG7d3QvH3cMU7JPNqw2osWZUDCTpT61W4FqMzCjuU5qPx7zWcdVrwneIX9f5hMdp-WV7GxZGVVPn85cMaSNhsBfnFsHohZWh7oHlj5-tAqL8-w5OQhjN6G6ABRKjRtTNHVMQx4r0hNr5NsjRJfI1aQ__"
          alt=""
        />
      </div>
      <div className="popular-name">Lorem, ipsum.</div>
      <div className="popular-rating">
        <img src={star} alt="" />
        <img src={star} alt="" />
        <img src={star} alt="" />
        <img src={star} alt="" />
        <img src={star} alt="" />
      </div>
      <div className="popular-expression">
        <p>Ürün hakkında bilgi içerikli metin..............</p>
      </div>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <div className="popular-link">
          <p> İncele</p>
          <div className="popular-arrow">
            {" "}
            <FaArrowRightLong className="arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default itemCard;
