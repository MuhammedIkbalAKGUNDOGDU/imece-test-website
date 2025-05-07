import React, { forwardRef } from "react";

const Sidebar = forwardRef(({ currentMenu, setCurrentMenu, isOpen, toggleMenu }, ref) => {
  const menus = [
    { key: "profile", label: "Profilim" },
    { key: "orders", label: "Siparişlerim" },
    { key: "settings", label: "Ayarlar" },
  ];

  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 h-full bg-green-500 text-white w-64 z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:w-64 transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 font-bold text-lg border-b border-green-700">İmecehub.com</div>
      <ul>
        {menus.map((menu) => (
          <li
            key={menu.key}
            onClick={() => {
              setCurrentMenu(menu.key);
              if (isOpen) toggleMenu();
            }}
            className={`p-4 cursor-pointer hover:bg-green-700 ${
              currentMenu === menu.key ? "bg-green-700" : ""
            }`}
          >
            {menu.label}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default Sidebar;
