import React from 'react';
import Logo from '../../assets/images/logo.png';

const WelcomeScreen = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="w-32 h-32 mb-6 rounded-full flex items-center justify-center overflow-hidden">
        <img src={Logo} alt="İMECE Logo" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">İMECE</h1>
      <div className="text-center space-y-2 mb-8">
        <p className="text-gray-600 font-medium text-lg">
          Grup Alım ile Ucuza Gelsin!
        </p>
        <p className="text-gray-500 text-sm max-w-md">
          Yerel üreticilerden toplu alım yaparak hem tasarruf edin, hem de üreticileri destekleyin.
        </p>
      </div>
      <div className="space-y-3">
        <button className="bg-[#1EFF26] text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors font-medium">
          İMECE Mobil'i İndirin
        </button>
        <p className="text-gray-400 text-xs text-center">
          Yakında App Store ve Google Play'de
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
