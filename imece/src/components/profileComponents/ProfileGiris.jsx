"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { apiKey } from "../../config";

// API için temel URL - ortamlara göre değiştirilebilir
const API_BASE_URL = "https://imecehub.com/users/seller-info-full/";

export default function ProfileGiris({ sellerInfo, sellerId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    id: sellerId,
    name: "ikbal",
    profession: "tornacı",
    location: "istanbul",
    confirmedSeller: true,
    confirmedSellerExpirationDate: new Date(),
    profileImage: "/placeholder.svg?height=200&width=200",
    backgroundImage: "/placeholder.svg?height=300&width=1200",
    profileImageFile: null,
    backgroundImageFile: null,
    profileImagePreview: null,
    backgroundImagePreview: null,
  });

  // İlk yükleme için profil verilerini getir
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        // Parametrik ID (örneğin route'tan alınmış olabilir)
        const response = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-info-full/",
          data: {
            kullanici_id: sellerId,
          },
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        });

        if (response.data) {
          const profileFromApi = response.data;

          // Tarih varsa dönüştür
          const expirationDate = profileFromApi.confirmedSellerExpirationDate
            ? new Date(profileFromApi.confirmedSellerExpirationDate)
            : new Date();

          // Profil state'ini güncelle
          setProfileData((prev) => ({
            ...prev,
            ...profileFromApi,
            confirmedSellerExpirationDate: expirationDate,
          }));
        }
      } catch (error) {
        console.error("Profil verileri alınamadı:", error);
        console.error("Hata detayı:", error.response?.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [sellerId]);

  // Yükleme durumu için gösterilecek içerik
  if (isLoading) {
    return (
      <div className="max-w-[1580px] min-w-[428px] h-[306px] md:h-[380px] lg:h-[622px] mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 font-primary flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="animate-spin h-12 w-12 text-[#22ff22]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg text-[#1c274c]">
            Profil bilgileri yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1580px] min-w-[428px] h-[306px] md:h-[380px] lg:h-[622px] mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 font-primary">
      {/* Banner Image */}
      <div className="relative h-[111px] md:h-[176px] lg:h-[276px] md:w-full">
        <img
          src={sellerInfo?.profil_banner || profileData.backgroundImage}
          alt="Field landscape"
          className="w-full h-full object-cover"
        />

        {/* Profile Picture */}
        <div className="absolute -mt-14 ml-5 md:-bottom-16 md:left-8">
          <div className="overflow-hidden border-[3px] rounded-[15px] md:border-[5px] md:rounded-2xl md:w-[120px] md:h-[120px] md:mb-7 lg:mb-3 lg:border-[7px] lg:rounded-[30px] border-white w-[81px] h-[81px] lg:w-[189px] lg:h-[189px] relative group">
            <img
              src={sellerInfo?.profil_fotograf}
              alt="Profile picture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info*/}
      <div className="mt-10 px-5 pb-8 lg:mt-20 flex flex-col gap-8">
        <div className="flex">
          {/* left side */}
          <div className="flex-1">
            {/* Name - profession - location */}
            <h1 className="uppercase text-base md:text-2xl lg:text-4xl font-bold lg:font-extrabold text-[#1c274c]">
              {profileData?.magaza_adi}
            </h1>
            <p className="capitalize text-xs mt-1 md:text-lg lg:text-2xl lg:font-medium lg:mt-2 text-[#717171]">
              {profileData.profession}
            </p>
            {/* <p className="text-xs mt-1 md:text-[15px] lg:text-xl lg:font-light lg:mt-2 text-[#898989]">
              {profileData.location}
            </p> */}
          </div>

          {/* right side */}
          <div className="flex-col">
            {/* Farm Info Card */}
            <div>
              <h2 className="capitalize text-[9.2px] md:text-sm lg:text-xl border border-[#d0d0d0] rounded-[10px] font-extrabold text-[#1c274c] py-3 px-3 lg:px-6 lg:py-6 -mt-2">
                {sellerInfo?.magaza_adi}{" "}
              </h2>
            </div>

            {/* Confirmed Seller */}
            {sellerInfo?.imece_onay && (
              <div className="flex items-center mt-2 gap-1 lg:gap-2">
                <p className="text-sm md:text-lg lg:text-3xl font-extrabold text-gradient bg-gradient-to-r from-[#FFE600] to-[#998A00] bg-clip-text text-transparent">
                  imece onaylı Satıcı
                </p>
                <img
                  className="lg:w-[28px] lg:h-[35px]"
                  src="/ikon.png"
                  alt=""
                />
              </div>
            )}

            {/* Confirmed Seller Expiration Date */}
            {sellerInfo?.imece_onay && (
              <div className="text-[10px] lg:text-base font-medium lg:ml-16 lg:mt-1 text-[#1C274C] kanit">
                {format(
                  profileData.confirmedSellerExpirationDate,
                  "dd/MM/yyyy"
                )}{" "}
                Tarihine kadar geçerli
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
