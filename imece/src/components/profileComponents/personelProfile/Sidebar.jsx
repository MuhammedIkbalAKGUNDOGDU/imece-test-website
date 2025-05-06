import React from "react";

export default function Sidebar({ currentMenu, setCurrentMenu, isOpen, toggleMenu }) {
  const menus = [
    { key: "profile", label: "Profilim" },
    { key: "orders", label: "Siparişlerim" },
    { key: "settings", label: "Ayarlar" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:w-64 transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 font-bold text-lg border-b border-gray-700">Menü</div>
      <ul>
        {menus.map((menu) => (
          <li
            key={menu.key}
            onClick={() => {
              setCurrentMenu(menu.key);
              if (isOpen) toggleMenu(); // mobilde tıklayınca menüyü kapat
            }}
            className={`p-4 cursor-pointer hover:bg-gray-700 ${
              currentMenu === menu.key ? "bg-gray-700" : ""
            }`}
          >
            {menu.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
