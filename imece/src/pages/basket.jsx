import { useEffect, useState } from "react";
import AddressSection from "../components/shoppingCart/AddressSection";
import CartItem from "../components/shoppingCart/CartItem";
import PaymentSection from "../components/shoppingCart/PaymentSection";
import Header from "../components/GenerealUse/Header";
import axios from "axios";
import { apiKey } from "../config"; // veya "../constants" dosya ismine göre

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]); // JSX değil, sadece ürün verisi
  const token = localStorage.getItem("accessToken");

  // Ürünü sepetten silme işlemi
  const handleDeleteFromCart = async (urun_id) => {
    try {
      const response = await axios.post(
        "https://imecehub.com/api/payment/siparisitem/sepet-ekle/",
        {
          miktar: 0,
          urun_id: urun_id,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Ürün sepetten silindi!");

      // cartItems verisinden sil
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.urun !== urun_id)
      );
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`https://imecehub.com/api/payment/siparisitem/sepet-get/`, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const items = response.data.sepet;
        setCartItems(items); // JSX değil, sadece veri
        console.log(items);
      })
      .catch((error) => {
        console.error("Sepet verileri alınamadı:", error);
      });
  }, []);
  return (
    <>
      <div className="mx-[4%] md:mx-[8%]">
        <Header />
      </div>

      <div className="bg-white w-full max-w-5xl mx-auto p-3 sm:p-4 md:p-6 mt-12">
        <AddressSection />

        {Array.isArray(cartItems) && cartItems.length > 0 ? (
          <div className="bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-lg my-2 md:my-4">
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.urun}
                  data={item}
                  onRemove={() => handleDeleteFromCart(item.urun)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg font-semibold mt-6">
            Sepetiniz boş.
          </div>
        )}

        <PaymentSection />
      </div>
    </>
  );
}
