import { useEffect, useState } from "react";
import mandalina from "../../assets/images/mandalina.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookieManager";

export default function CartItem({ onRemove, data }) {
  const [quantity, setQuantity] = useState(data.miktar);
  const maxKg = 100;
  const apiKey =
    "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";
  const navigate = useNavigate();

  const updateCartQuantity = async (newQuantity) => {
    try {
      await axios.post(
        "https://imecehub.com/api/payment/siparisitem/sepet-ekle/",
        {
          miktar: newQuantity,
          urun_id: data.urun,
        },
        {
          headers: {
            "X-API-Key": apiKey,
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      setQuantity(newQuantity); // Backend başarılıysa local state de güncellenir
    } catch (error) {
      console.error("Miktar güncelleme hatası:", error);
      alert("Miktar güncellenemedi, lütfen tekrar deneyin.");
    }
  };

  const increaseQuantity = () => {
    if (quantity < maxKg) {
      setQuantity(quantity + 1);
      updateCartQuantity(quantity + 1);
    }
  };
  const [productInfo, setProductInfo] = useState(null);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      updateCartQuantity(quantity - 1);
    } else if (quantity === 1) {
      onRemove();
    }
  };
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `https://imecehub.com/api/products/urunler/${data.urun}/`,
          {
            headers: {
              "X-API-Key": apiKey, // Gerekliyse
              Authorization: `Bearer ${getCookie("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProductInfo(response.data);
      } catch (error) {
        console.error("Ürün bilgisi alınırken hata oluştu:", error.message);
      }
    };

    fetchProductData();
  }, [data.urun_id]);

  const handleClick = () => {
    navigate("/order-page", { state: { product: productInfo } });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-4 shadow-md bg-white">
      <div className="flex items-center border-gray-300 md:border-r pr-6">
        <img
          onClick={handleClick}
          src={productInfo?.kapak_gorseli}
          alt="Turuncu Mandalina"
          className="w-20 h-20 rounded-lg object-cover cursor-pointer"
        />
        <div className="ml-4 flex flex-col text-left space-y-1">
          <h3
            onClick={handleClick}
            className="capitalize font-semibold text-base lg:text-lg text-black cursor-pointer"
          >
            {productInfo?.urun_adi}
          </h3>
          <p className="text-gray-500 text-xs/4 lg:text-sm">
            {productInfo?.aciklama}
          </p>
          <p className="text-xs/7 text-gray-400">Muhammet Yusuf Akar</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mt-4 md:mt-0 ml-6 lg:ml-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 rounded-lg px-2 py-1 lg:m-0 bg-gray-100 sm:w-auto">
            <span className="font-bold text-sm sm:text-md mx-2 sm:mx-4">
              {quantity}
            </span>
            <div className="flex border-gray-300">
              <button
                onClick={decreaseQuantity}
                className="px-2 py-1 hover:bg-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <button
                onClick={increaseQuantity}
                className="px-2 py-1 hover:bg-gray-300 border-l border-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              {productInfo?.urun_perakende_fiyati} TL
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 mt-4 md:mt-0">
        <span className="font-bold">Toplam Ürün tutarı:</span>{" "}
        {quantity * productInfo?.urun_perakende_fiyati} TL
      </p>

      <button
        onClick={onRemove}
        className="text-red-500 text-xl hover:text-red-700 mt-4 md:mt-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 12a2 2 0 002 2h8a2 2 0 002-2l3-12M5 6h14"
          />
        </svg>
      </button>
    </div>
  );
}
