import React from "react";
import ItemCard3 from "./ItemCard3";

const ItemGrid = ({ items }) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-6">

      {/* Kartların üst üste binmesini engelleyen düzenleme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 place-items-center">
        {items.map((item) => (
          <ItemCard3 key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemGrid;
