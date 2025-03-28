import React from "react";
import ItemCard3 from "./ItemCard3";
import ItemCard4 from "./ItemCard4";

const ItemGrid = ({ items, cardType = "card3", favorites = [], onFavoriteToggle }) => {
  const CardComponent = cardType === "card4" ? ItemCard4 : ItemCard3;
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
