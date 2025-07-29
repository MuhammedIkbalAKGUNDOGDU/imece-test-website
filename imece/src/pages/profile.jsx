import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import Sidebar from "../components/profileComponents/personelProfile/Sidebar";
import Profile from "../components/profileComponents/personelProfile/Profile";
import Orders from "../components/profileComponents/personelProfile/Orders";
import Settings from "../components/profileComponents/personelProfile/Settings";
import { apiKey } from "../config";
import { useRef } from "react";
import Profile2 from "../components/profileComponents/Profile";
export default function ProfilUreticiPage() {
  const [userData, setUserData] = useState(null);
  const [currentMenu, setCurrentMenu] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);
  const accesToken = localStorage.getItem("accessToken");
  const apiUrl = "https://imecehub.com/api/users/kullanicilar/me/";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accesToken}`,
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Veri çekme hatası:", err));
  }, [accesToken]);

  const renderContent = () => {
    switch (currentMenu) {
      case "profile":
        return <Profile user={userData} />;
      case "orders":
        return <Orders />;
      case "settings":
        return <Settings />;
      default:
        return <div>Sayfa bulunamadı</div>;
    }
  };

  if (!accessToken) {
    return (
      <>
        <div className="mx-[4%] md:mx-[8%]">
          <Header />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <p className="text-lg font-semibold mb-4">
            Lütfen giriş yapın ya da kaydolun
          </p>
          <div className="flex gap-4">
            <a
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Giriş Yap
            </a>
            <a
              href="/register"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Kaydol
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-[8%]">
        <Header />
      </div>
      {/* Mobil Menü Butonu */}
      {/* <button
        className="md:hidden m-4 px-4 py-2 bg-gray-800 text-white rounded"
        onClick={toggleSidebar}
      >
        Menü
      </button>

      <div className="flex flex-col md:flex-row">
        <Sidebar
          ref={sidebarRef}
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
        />
        <main
          className="flex-1 p-4 md:ml-64"
          onClick={() => {
            if (isSidebarOpen) toggleSidebar(); // Mobilde menü açıkken tıklanınca kapat
          }}
        >
          {renderContent()}
        </main>{" "}
      </div> */}
      <Profile2 />
    </div>
  );
}
