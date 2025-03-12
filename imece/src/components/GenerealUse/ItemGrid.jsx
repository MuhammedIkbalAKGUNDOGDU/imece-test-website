import React from "react";
import ItemCard3 from "./ItemCard3";
import ItemCard4 from "./ItemCard4";

const ItemGrid = ({ items, cardType = "card3" }) => {
  const CardComponent = cardType === "card4" ? ItemCard4 : ItemCard3;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
        {items.map((item) => (
          <div className="flex justify-center" key={item.id}>
            <div className="w-full max-w-[140px] sm:max-w-[220px] md:max-w-[260px]">
              <CardComponent data={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemGrid;
