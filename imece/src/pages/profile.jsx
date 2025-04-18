import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import Profile from "../components/profileComponents/Profile"

export default function ProfilUreticiPage() {
  const [userData, setUserData] = useState(null);
  const apiUrl = "https://imecehub.com/api/users/kullanicilar/me/";
  const accesToken = localStorage.getItem("accessToken");
  const apiKey =
    "WNjZXNttoxNzM5Mzc3MDM3LCJpYXQiOUvKrIq06hpJl_1PenWgeKZw_7FMvL65DixY";

  useEffect(() => {
    // API isteği
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accesToken}`,
          "X-API-Key": apiKey, // API anahtarı
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setUserData(response.data); // Kullanıcı verisini state'e at
        console.log("data : ", response.data);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, [accesToken]);

  return (
    <div>
      <div className="mx-[4%] md:mx-[8%] mb-8">
        <Header />
      </div>
      <Profile />
     </div>
  );
}
