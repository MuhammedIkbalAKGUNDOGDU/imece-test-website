import React, { useState } from "react";
import "../../styles/general_styles/filter.css";

const Filter = () => {
  // Seçilen checkbox'lar
  const [selectedCategories, setSelectedCategories] = useState([]);
  // Seçilen fiyat aralığı
  const [selectedPrice, setSelectedPrice] = useState("");
  // Seçilen değerlendirme puanı (sayısal değer tutuyoruz)
  const [selectedRating, setSelectedRating] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <h3 className="filter-title">
          Kategori <span>▼</span>
        </h3>
        <ul className="filter-list">
          {[
            "Meyveler",
            "Sebzeler",
            "Yeşillikler",
            "Mantarlar",
            "Baklagiller",
            "Egzotik meyveler",
            "Kuru yemişler",
            "Kök sebzeler",
          ].map((category) => (
            <li key={category}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          Fiyat aralığı <span>▼</span>
        </h3>
        <ul className="filter-list">
          {[
            "300 - 500 TL",
            "500 - 700 TL",
            "700 - 900 TL",
            "900 - 1100 TL",
            "1100 - 1300 TL",
          ].map((price) => (
            <li key={price}>
              <label>
                <input
                  type="radio"
                  name="price"
                  value={price}
                  checked={selectedPrice === price}
                  onChange={() => handlePriceChange(price)}
                />
                {price}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">
          Değerlendirme puanı <span>▼</span>
        </h3>
        <ul className="filter-list">
          {[4, 3, 2, 1].map((rating) => (
            <li key={rating}>
              <label>
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={selectedRating === rating}
                  onChange={() => handleRatingChange(rating)}
                />
                {`⭐ ${rating} yıldız ve üzeri`}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Filter;
