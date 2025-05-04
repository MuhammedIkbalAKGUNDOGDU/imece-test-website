import { useState } from "react";

export default function PaymentSection() {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleCardAdd = () => {
    alert("Kart ekleme butonuna tıklandı");
  };

  const handlePurchase = () => {
    if (!termsAccepted) {
      alert("Lütfen satın alım koşullarını onaylayın");
      return;
    }
    alert("Ürün satın alındı");
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg flex flex-col md:flex-row justify-between items-start">
      <div className="w-full md:w-1/3 border-r border-gray-200 pr-6 text-left">
        <h2 className="text-lg font-semibold">Ara Toplam</h2>
        <p className="text-gray-700 mt-2 text-md font-bold">Satın alınan farklı ürün sayısı:<span className="font-normal"> 1 adet</span></p>
        <p className="text-gray-700 mt-2 text-md font-bold">Ürünlerin Tutarı:<span className="font-normal"> 340 Türk Lirası</span></p>
        <p className="text-gray-700 mt-2 text-md font-bold">Taşıma Ücreti:<span className="font-normal"> 20 Türk Lirası</span></p>
        <p className="text-gray-700 mt-2 text-md font-bold">Toplam: <span className="font-normal"> 360 Türk Lirası</span><span className="font-normal text-gray-400"> (Ek ücretler ve vergiler dahil)</span></p>
      </div>

      <div className="w-full md:w-1/3 mt-5 md:mt-0 px-6 flex flex-col border-r border-gray-200">
        <h3 className="text-md font-semibold text-left">Ödeme için kart seç</h3>
        <select className="border p-2 rounded-md w-full mt-2">
          <option>Visa Card</option>
          <option>MasterCard</option>
          <option>Havale / EFT</option>
        </select>

        <h3 className="text-md font-semibold mt-4 text-left">Kupon veya indirim kodu gir</h3>
        <input type="text" placeholder="0000000000" className="border p-2 w-full rounded-md mt-2" />
        <button 
          onClick={handleCardAdd}
          className="w-full mt-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Kart Ekle
        </button>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-start m-auto px-4 mt-5 md:mt-0">
        <button 
          onClick={handlePurchase}
          className={`px-6 py-2 bg-green-500 text-white rounded-md w-full ${
            !termsAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
          }`}
        >
          Ürünü Satın Al
        </button>
        <div className="flex items-center mt-3">
          <input 
            type="checkbox" 
            id="terms" 
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mr-2" 
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            Satın alım koşullarını onaylıyorum
          </label>
        </div>
      </div>
    </div>
  );
}
