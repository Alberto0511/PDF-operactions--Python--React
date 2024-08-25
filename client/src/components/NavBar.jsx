import React, { useState, useEffect } from "react";
import { GiSun } from "react-icons/gi";
import { GiEvilMoon } from "react-icons/gi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import PdfToWordConverter from "./PdfToWordConverter";
const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {// Cargar el estado del modo oscuro desde localStorage al inicializar el componente
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);
  const toggleDarkMode = () => {   // Alternar el modo oscuro y aplicar la clase al elemento raíz
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", newDarkMode.toString());    // Guardar el estado en localStorage
  };
  const toggleMenu = () => {  // Alternar la visibilidad del menú desplegable
    setShowMenu(!showMenu);
  };

  return (
    <nav className="bg-[#D32F2F] text-gray-800 dark:bg-gray-800 dark:text-white shadow-lg py-4 px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold flex items-center">
          <img
            src="/img-1.webp" // Ruta relativa a la carpeta public
            alt="Logo"
            className="h-10 w-auto" // Ajusta el tamaño según tus necesidades
          />
        </div>

        <div className="relative">
          <button onClick={toggleMenu} className="text-white font-bold text-lg flex items-center">
            Operaciones
            {showMenu ? (
              <IoIosArrowUp className="w-5 h-5 ml-2 transition-transform duration-300" />
            ) : (
              <IoIosArrowDown className="w-5 h-5 ml-2 transition-transform duration-300" />
            )}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-lg">
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                PDF A Word
              </a>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Unir PDF
              </a>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Ordenar PDF
              </a>
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="text-lg flex items-center transition-transform duration-300"
        >
          {darkMode ? (
            <GiSun
              style={{ color: "#EE9B00" }}
              className="text-4xl transition-transform duration-300"
            />
          ) : (
            <GiEvilMoon
              style={{ color: "#ffffff" }}
              className="text-4xl transition-transform duration-300"
            />
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
