import React from "react";
import "../../styles/general_styles/filter.css";

const filter = () => {
  return (
    <div className="filter-container">
      <div className="filter-section">
        <h3 className="filter-title">
          Kategori <span>▼</span>
        </h3>
        <ul className="filter-list">
          <li>
            <label>
              <input type="checkbox" /> Meyveler
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Sebzeler
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Yeşillikler
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Mantarlar
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Baklagiller
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Egzotik meyveler
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Kuru yemişler
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Kök sebzeler
            </label>
          </li>
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          Fiyat aralığı <span>▼</span>
        </h3>
        <ul className="filter-list">
          <li>
            <label>
              <input type="radio" name="price" /> 300 - 500 TL
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="price" /> 500 - 700 TL
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="price" /> 700 - 900 TL
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="price" /> 900 - 1100 TL
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="price" /> 1100 - 1300 TL
            </label>
          </li>
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          Değerlendirme puanı <span>▼</span>
        </h3>
        <ul className="filter-list">
          <li>
            <label>
              <input type="radio" name="rating" /> ⭐ 4 yıldız ve üzeri
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="rating" /> ⭐ 3 yıldız ve üzeri
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="rating" /> ⭐ 2 yıldız ve üzeri
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="rating" /> ⭐ 1 yıldız ve üzeri
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default filter;
