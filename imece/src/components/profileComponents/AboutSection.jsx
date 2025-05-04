"use client";

import { useEffect, useState } from "react";

export default function AboutSection({ sellerDescription }) {
  const [aboutText, setAboutText] = useState(sellerDescription);

  useEffect(() => {
    if (sellerDescription) {
      setAboutText(sellerDescription);
    }
  }, [sellerDescription]);


  return (
    <div className="max-w-[1580px] min-w-[428px] mt-15 mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 font-primary p-6">
      <h2 className="text-[#1c274c] text-base md:text-2xl lg:text-[32px] font-extrabold lg:font-bold mb-4">
        Hakkında
      </h2>
      <p className="text-[#000000] mb-2 lg:mb-6 max-w-[1436px] text-sm md:text-lg lg:text-2xl font-normal montserrat">
        {aboutText}
      </p>
    </div>
  );
}
