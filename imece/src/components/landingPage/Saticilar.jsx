import React, { useRef } from "react";
import "../../styles/landingPage_styles/saticilar.css";
import { useState } from "react";
import { useEffect } from "react";
const Saticilar = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sellers, setSellers] = useState([]);
  const apiUrl = "https://imecehub.com/api/sirketler/";
  const apiKey = "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

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
        // Dummy veriler
        const dummyData = [
          { adi: "Test Şirket 1", logo: "https://picsum.photos/200" },
          { adi: "Test Şirket 2", logo: "https://picsum.photos/201" },
          { adi: "Test Şirket 3", logo: "https://picsum.photos/202" },
          { adi: "Test Şirket 4", logo: "https://picsum.photos/203" },
          { adi: "Test Şirket 5", logo: "https://picsum.photos/204" },
          { adi: "Test Şirket 6", logo: "https://picsum.photos/205" },
          { adi: "Test Şirket 7", logo: "https://picsum.photos/206" },
          { adi: "Test Şirket 8", logo: "https://picsum.photos/207" },
          { adi: "Test Şirket 9", logo: "https://picsum.photos/208" },
          { adi: "Test Şirket 10", logo: "https://picsum.photos/209" },
          { adi: "Test Şirket 1", logo: "https://picsum.photos/200" },
          { adi: "Test Şirket 2", logo: "https://picsum.photos/201" },
          { adi: "Test Şirket 3", logo: "https://picsum.photos/202" },
          { adi: "Test Şirket 4", logo: "https://picsum.photos/203" },
          { adi: "Test Şirket 5", logo: "https://picsum.photos/204" },
          { adi: "Test Şirket 6", logo: "https://picsum.photos/205" },
          { adi: "Test Şirket 7", logo: "https://picsum.photos/206" },
          { adi: "Test Şirket 8", logo: "https://picsum.photos/207" },
          { adi: "Test Şirket 9", logo: "https://picsum.photos/208" },
          { adi: "Test Şirket 10", logo: "https://picsum.photos/209" },
        ];
        
        setSellers([...data, ...dummyData]);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="satici-container">
      <h2 className="satici-baslik">Satıcılar</h2>
      <button onClick={scrollLeft} className="scroll-button scroll-left">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="sellers-wrapper" ref={scrollRef}>
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p>Hata: {error}</p>
        ) : (
          <div className="sellers-list scrollbar-hide">
            {sellers.map((seller, index) => (
              <div key={index} className="seller-card">
                <img 
                  src={seller.logo || "https://s3-alpha-sig.figma.com/img/ebab/4772/fece3f97244726a20a8e0f7945edd37e?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oq3Gpu9gMnqe~p3NRjPbVQnBSqK5vHexROMkh2yewhm5USW4Z-rexMj87Lxr0qr3aeGuIR0rI8z9KKidZyo68Gf47P-1uuR7VbkhkaKlgyKVeyfR5v8SB4waL~5wnqxzzBokyGpK-dGfVDO6T0sxYlLxh0o5EafLQ-pbrV5PIEn70xYDCKucMpE3aXVCf~NqLG7d3QvH3cMU7JPNqw2osWZUDCTpT61W4FqMzCjuU5qPx7zWcdVrwneIX9f5hMdp-WV7GxZGVVPn85cMaSNhsBfnFsHohZWh7oHlj5-tAqL8-w5OQhjN6G6ABRKjRtTNHVMQx4r0hNr5NsjRJfI1aQ__"}
                  alt={seller.adi}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={scrollRight} className="scroll-button scroll-right">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default Saticilar;
