import React, { useState } from "react";
import "../../styles/general_styles/filter.css";

const Filter = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    onFilterChange({
      categories: updatedCategories,
      price: selectedPrice,
      rating: selectedRating,
    });
  };

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
    onFilterChange({
      categories: selectedCategories,
      price,
      rating: selectedRating,
    });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    onFilterChange({
      categories: selectedCategories,
      price: selectedPrice,
      rating,
    });
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <h3 className="filter-title">
          Kategori <span>▼</span>
        </h3>
        <ul className="filter-list">
          {[
            { ad: "Meyveler", kategori: 1 },
            { ad: "Sebzeler", kategori: 2 },
            { ad: "Elektronik", kategori: 3 },
            { ad: "Moda ve Giyim", kategori: 4 },
            { ad: "Ev ve Yaşam", kategori: 5 },
            { ad: "Kozmetik ve Kişisel Bakım", kategori: 6 },
            { ad: "Spor ve Outdoor", kategori: 7 },
            { ad: "Anne & Bebek Ürünleri", kategori: 8 },
            { ad: "Kitap, Film, Müzik ve Hobi", kategori: 9 },
            { ad: "Otomobil ve Motosiklet", kategori: 10 },
            { ad: "Süpermarket & Gıda", kategori: 11 },
            { ad: "Pet Shop (Evcil Hayvan Ürünleri)", kategori: 12 },
            { ad: "Sağlık ve Medikal Ürünler", kategori: 13 },
          ].map((category) => (
            <li key={category.kategori}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.kategori)}
                  onChange={() => handleCategoryChange(category.kategori)}
                />
                {category.ad}
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
            "0 - 300 TL",
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
