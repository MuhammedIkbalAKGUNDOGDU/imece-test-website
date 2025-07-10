import React from "react";
import ItemCard3 from "./ItemCard3";
import ItemCard4 from "./ItemCard4";

const ItemGrid = ({
  items,
  cardType = "card3",
  onFavoriteToggle,
  favorites = [],
}) => {
  const CardComponent = cardType === "card4" ? ItemCard4 : ItemCard3;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => {
          const itemId = item.urun_id || item.id;
          return (
            <div className="flex justify-center" key={itemId}>
              <CardComponent
                data={item}
                isFavorite={favorites.includes(itemId)}
                onFavoriteToggle={onFavoriteToggle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemGrid;
