import { useState } from "react";
import AddressSection from "../components/shoppingCart/AddressSection";
import CartItem from "../components/shoppingCart/CartItem";
import PaymentSection from "../components/shoppingCart/PaymentSection";
import Header from "../components/GenerealUse/Header";

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
    <>
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="bg-white w-full max-w-5xl mx-auto p-3 sm:p-4 md:p-6 mt-12">
        <AddressSection />
        <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg my-2 md:my-4">
          <div className="flex flex-col gap-4">{cartItems}</div>
        </div>
        <PaymentSection />
      </div>
    </>
  );
}
