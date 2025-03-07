import { useState } from "react";
import AddressSection from "../components/shoppingCart/AddressSection";
import CartItem from "../components/shoppingCart/CartItem";
import PaymentSection from "../components/shoppingCart/PaymentSection";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    <CartItem key={0} onRemove={() => removeItem(0)} />,
  ]);

  const addItem = () => {
    const newItem = (
      <CartItem
        key={cartItems.length}
        onRemove={() => removeItem(cartItems.length)}
      />
    );
    setCartItems([...cartItems, newItem]);
  };

  const removeItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white w-full max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
      <AddressSection />
      <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg my-2 md:my-4">
        <div className="flex flex-col gap-4">{cartItems}</div>
        <button
          onClick={addItem}
          className="w-full flex items-center justify-center border border-dashed p-3 sm:p-4 text-sm sm:text-base text-gray-600 rounded-lg mt-4 hover:bg-gray-50"
        >
          + Ürün ekle
        </button>
      </div>
      <PaymentSection />
    </div>
  );
}
