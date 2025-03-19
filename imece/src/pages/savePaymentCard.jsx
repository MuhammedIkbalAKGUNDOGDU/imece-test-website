import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/GenerealUse/Header";

const SavePaymentCard = () => {
  const navigate = useNavigate();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const maskCardNumber = (number) => {
    if (!number) return '0000 0000 0000 0000';
    const first4 = number.substring(0, 4);
    const middle8 = '****-****';
    const last4 = number.substring(12, 16);
    return `${first4}-${middle8}-${last4}`;
  };

  // Ekran boyutuna göre tam sığdırma kontrolü
  useEffect(() => {
    const checkScreenSize = () => {
      setIsFullScreen(window.innerHeight >= 720);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Form validasyonunu kontrol et
  useEffect(() => {
    setIsFormValid(
      cardNumber.length === 16 &&
      expiryDate.length === 5 &&
      cvv.length === 3 &&
      ownerName.trim() !== ""
    );
  }, [cardNumber, expiryDate, cvv, ownerName]);

  return (
    <div className="landingPage min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6 flex flex-col mt-2 lg:mt-5 mb-20">
        {/* Header container */}
        <div className="w-full px-2 md:px-12 mb-6">
          <button 
            className="flex items-center text-[#22FF22] font-semibold mb-0 md:mb-10 lg:mb-0 text-lg sm:text-xl"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" /> Geri dön
          </button>
        </div>

        <div className="flex justify-center px-2 sm:px-4 mt-2 md:-mt-4 lg:mt-0">
          <div className="flex flex-col bg-white rounded-xl shadow-xl w-full max-w-7xl px-3 sm:px-8 md:px-16 lg:px-32 xl:px-80 py-6 sm:py-8 md:py-10 mt-4 sm:mt-6 border border-gray-300">
            {/* Kart Görünümü */}
            <div className="flex justify-center mb-6 -mt-16 sm:-mt-24 md:-mt-32">
              <div className="w-[260px] sm:w-[380px] md:w-[500px] h-44 sm:h-60 md:h-72 bg-gradient-to-r from-blue-900 to-gray-800 rounded-xl shadow-lg p-4 sm:p-8 md:p-10">
                <div className="flex justify-between items-start">
                  <div className="w-6 h-6 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-yellow-400 rounded-lg"></div>
                  <div className="text-white text-md sm:text-xl md:text-2xl font-bold">VISA</div>
                </div>
                
                <div className="text-white text-md sm:text-2xl md:text-3xl font-mono tracking-wider mt-3 sm:mt-5 md:mt-6">
                  {maskCardNumber(cardNumber)}
                </div>
                <div className="text-white text-xs sm:text-lg md:text-xl font-mono tracking-wider mt-1 sm:mt-2">
                  {ownerName || "Kart Sahibinin Adı"}
                </div>
                <div className="flex justify-between items-end mt-4 sm:mt-6 md:mt-7">
                  <div>
                    <div className="text-gray-300 text-[0.60rem] sm:text-sm">Geçerlilik Tarihi</div>
                    <div className="text-white text-xs sm:text-lg md:text-xl">{expiryDate || '00/00'}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-[0.70rem] sm:text-sm">CVV</div>
                    <div className="text-white text-xs sm:text-lg md:text-xl">{cvv ? '***' : '000'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto space-y-3 mt-4">
              {/* Form Fields */}
              <div className="mx-2 sm:mx-4 md:mx-8 space-y-3">
                {/* Kart Numarası */}
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base font-bold mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent p-3 sm:p-4 text-base sm:text-lg focus:outline-none border border-gray-300 rounded-lg"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").substring(0, 16);
                      setCardNumber(value);
                    }}
                  />
                </div>

                {/* Son Kullanma Tarihi ve CVV */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-gray-700 text-sm sm:text-base font-bold mb-1">Son Kullanım Tarihi</label>
                    <input
                      type="text"
                      className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-lg shadow-sm"
                      placeholder="00 / 00"
                      maxLength={5}
                      value={expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "").substring(0, 4);
                        if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
                        setExpiryDate(value);
                      }}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="block text-gray-700 text-sm sm:text-base font-bold mb-1">CVV</label>
                    <input
                      type="password"
                      className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-lg shadow-sm"
                      placeholder="000"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
                    />
                  </div>
                </div>

                {/* Kart Sahibinin Adı ve Kart İsmi */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base font-bold mb-1">Kart Sahibinin Adı</label>
                    <input
                      type="text"
                      className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Kart Sahibinin Adı"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base font-bold mb-1">Kart İsmi</label>
                    <input
                      type="text"
                      className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-lg shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Kart İsmini Girin"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      disabled={!saveCard}
                    />
                  </div>
                </div>

                {/* Kaydet ve Checkbox */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 pt-3">
                  <label className="flex items-center text-gray-700 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      className="w-5 h-5 mr-3 rounded border-gray-300"
                      checked={saveCard}
                      onChange={() => {
                        setSaveCard(!saveCard);
                        if (!saveCard) setCardName("");
                      }}
                    />
                    Kartı daha sonrası için kaydet
                  </label>
                  <button
                    className={`${
                      isFormValid 
                        ? 'bg-[#22FF22] hover:bg-green-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    } text-white font-bold w-full sm:w-auto py-3 sm:py-4 px-8 sm:px-20 text-base sm:text-lg rounded-lg transition-colors`}
                    onClick={() => isFormValid && alert("Kart başarıyla kaydedildi!")}
                    disabled={!isFormValid}
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePaymentCard;
