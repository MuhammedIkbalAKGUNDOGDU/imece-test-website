import { useState } from "react";
import mandalina from "../../assets/images/mandalina.png";

export default function CartItem({ onRemove }) {
    const [quantity, setQuantity] = useState(11);
    const pricePerKg = 36;
    const maxKg = 55;
    const totalPrice = quantity * pricePerKg;

    const increaseQuantity = () => {
        if (quantity < maxKg) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
      <div className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-4 shadow-md bg-white">
        <div className="flex items-center border-gray-300 md:border-r pr-6">
        <img src={mandalina} alt="Turuncu Mandalina" className="w-20 h-20 rounded-lg object-cover" />
          <div className="ml-4 flex flex-col text-left space-y-1">
            <h3 className="font-semibold text-base lg:text-lg text-black">Turuncu Mandalina</h3>
            <p className="text-gray-500 text-xs/4 lg:text-sm">Tatlı, Sulu, Turuncu, Mandalina, Turunçgil...</p>
            <p className="text-xs/7 text-gray-400">Muhammet Yusuf Akar</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 mt-4 md:mt-0 ml-6 lg:ml-0">
          <div className="flex items-center gap-2">
                <div className="flex items-center border-2 rounded-lg px-2 py-1 lg:m-0 bg-gray-100 sm:w-auto">
                  <span className="font-bold text-sm sm:text-md mx-2 sm:mx-4">{quantity} KG</span>
                  <div className="flex border-gray-300">
                      <button onClick={decreaseQuantity} className="px-2 py-1 hover:bg-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                      </button>
                      <button onClick={increaseQuantity} className="px-2 py-1 hover:bg-gray-300 border-l border-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                      </button>
                  </div>
              </div>
            <div>
                <p className="text-xs text-gray-500">1 KG: {pricePerKg} TL</p>
                <p className="text-xs text-gray-500">Maks KG: {maxKg}</p>
            </div>
          </div>
        </div>
  
        <p className="text-sm text-gray-700 mt-4 md:mt-0"><span className="font-bold">Ürün tutarı:</span> {totalPrice} Türk Lirası</p>
        
        <button onClick={onRemove} className="text-red-500 text-xl hover:text-red-700 mt-4 md:mt-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 12a2 2 0 002 2h8a2 2 0 002-2l3-12M5 6h14" />
            </svg>
        </button>
      </div>
    );
}