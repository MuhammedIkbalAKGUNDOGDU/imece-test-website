import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import Sidebar from "../components/profileComponents/personelProfile/Sidebar";
import Profile from "../components/profileComponents/personelProfile/Profile";
import Orders from "../components/profileComponents/personelProfile/Orders";
import Settings from "../components/profileComponents/personelProfile/Settings";
import { apiKey } from "../config";

export default function ProfilUreticiPage() {
  const [userData, setUserData] = useState(null);
  const [currentMenu, setCurrentMenu] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const accesToken = localStorage.getItem("accessToken");
  const apiUrl = "https://imecehub.com/api/users/kullanicilar/me/";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {/* Mobil Menü Butonu */}
      <button
        className="md:hidden m-4 px-4 py-2 bg-gray-800 text-white rounded"
        onClick={toggleSidebar}
      >
        Menü
      </button>

      <div className="flex flex-col md:flex-row">
        <Sidebar
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          isOpen={isSidebarOpen}
          toggleMenu={toggleSidebar}
        />
        <main className="flex-1 p-4 md:ml-64">{renderContent()}</main>
      </div>
    </div>
  );
}
