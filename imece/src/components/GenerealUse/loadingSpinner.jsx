import React from "react";
import imeceLogo from "../../assets/images/logo.png";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col fixed inset-0 items-center justify-center bg-white/80 z-50 space-y-4">
      <img src={imeceLogo} alt="Loading Logo" className="w-36 h-auto" />
      <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
