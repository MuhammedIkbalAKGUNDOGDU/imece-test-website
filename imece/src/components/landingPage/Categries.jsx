import React, { useEffect, useState } from "react";
import "../../styles/landingPage_styles/categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = "https://34.22.218.90/api/products/kategoriler/";
  const apiKey = "fb10ca29411e8fa4725e11ca519b732de5c911769ff1956e84d4";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-container">
      <p>Kategoriler</p>
      {isLoading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p>Hata: {error}</p>
      ) : (
        <div className="categories-list scrollbar-hide">
          {categories.map((category, index) => (
            <div key={index} className="categories-box cursor-pointer">
              <img
                src={
                  category.gorsel ||
                  "https://s3-alpha-sig.figma.com/img/ebab/4772/fece3f97244726a20a8e0f7945edd37e?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oq3Gpu9gMnqe~p3NRjPbVQnBSqK5vHexROMkh2yewhm5USW4Z-rexMj87Lxr0qr3aeGuIR0rI8z9KKidZyo68Gf47P-1uuR7VbkhkaKlgyKVeyfR5v8SB4waL~5wnqxzzBokyGpK-dGfVDO6T0sxYlLxh0o5EafLQ-pbrV5PIEn70xYDCKucMpE3aXVCf~NqLG7d3QvH3cMU7JPNqw2osWZUDCTpT61W4FqMzCjuU5qPx7zWcdVrwneIX9f5hMdp-WV7GxZGVVPn85cMaSNhsBfnFsHohZWh7oHlj5-tAqL8-w5OQhjN6G6ABRKjRtTNHVMQx4r0hNr5NsjRJfI1aQ__"
                }
                alt={category.name}
                className="mt-4"
              />
              <p className="text-center capitalize">
                {category.alt_kategori_adi}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
