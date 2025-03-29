import React, { useState } from "react";
import "../../styles/general_styles/filter.css";

const Filter = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);

  // Açılıp kapanma için state (Hepsi başlangıçta açık)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

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
    const newPrice = selectedPrice === price ? "" : price;
    setSelectedPrice(newPrice);
    onFilterChange({
      categories: selectedCategories,
      price: newPrice,
      rating: selectedRating,
    });
  };

  const handleRatingChange = (rating) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    onFilterChange({
      categories: selectedCategories,
      price: selectedPrice,
      rating: newRating,
    });
  };

  return (
    <div className="filter-container">
      {/* Kategori */}
      <div className="filter-section">
        <h3 className="filter-title" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
          Kategori <span>{isCategoryOpen ? "▲" : "▼"}</span>
        </h3>
        {isCategoryOpen && (
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
        )}
      </div>

      {/* Fiyat Aralığı */}
      <div className="filter-section">
        <h3 className="filter-title" onClick={() => setIsPriceOpen(!isPriceOpen)}>
          Fiyat aralığı <span>{isPriceOpen ? "▲" : "▼"}</span>
        </h3>
        {isPriceOpen && (
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
        )}
      </div>

      {/* Değerlendirme Puanı */}
      <div className="filter-section">
        <h3 className="filter-title" onClick={() => setIsRatingOpen(!isRatingOpen)}>
          Değerlendirme puanı <span>{isRatingOpen ? "▲" : "▼"}</span>
        </h3>
        {isRatingOpen && (
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
        )}
      </div>
    </div>
  );
};

export default Filter;
