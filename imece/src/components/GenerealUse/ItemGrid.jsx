import React, { useEffect, useState } from "react";
import ItemCard3 from "./ItemCard3";
import ItemCard4 from "./ItemCard4";
import axios from "axios";

const ItemGrid = ({ items, cardType = "card3", onFavoriteToggle }) => {
  const [favorites, setFavorites] = useState([]);
  const CardComponent = cardType === "card4" ? ItemCard4 : ItemCard3;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const apiKey = "senin_api_keyin"; // veya import ettiğin config dosyasından al

        const res = await axios.get(
          "https://imecehub.com/api/users/favori-urunler/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        const favs = res.data.map((item) => item.urun); // sadece ID'leri al
        setFavorites(favs);
      } catch (error) {
        console.error("Favori ürünler alınamadı:", error);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div className="flex justify-center" key={item.urun_id || item.id}>
            <CardComponent
              data={item}
              isFavorite={favorites.includes(item.urun_id || item.id)}
              onFavoriteToggle={onFavoriteToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemGrid;
