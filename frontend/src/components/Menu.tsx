import { useState } from "react";
import { Link } from "react-router";
import { URLS } from "../navigation/constants";
import { ChevronDown, List } from "react-bootstrap-icons";
import { useAuth } from "../hooks/useAuth";

export const Menu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { email, doLogout } = useAuth();
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }
    const toggleSubMenu = (id: string) => {
        const subMenu = document.getElementById(id);
        const shownSubMenus = document.getElementsByClassName("submenu-shown");
        if (shownSubMenus.length > 0) {
            for (let i = 0; i < shownSubMenus.length; i++) {
                const element = shownSubMenus[i] as HTMLElement;
                if (element.id !== id) {
                    element.classList.toggle("hidden");
                    element.classList.toggle("submenu-shown");
                }
            }
        }
        if (subMenu) {
            subMenu.classList.toggle("hidden");
            subMenu.classList.toggle("submenu-shown");
        }
    }
    const onLogoutClick = () => {
        doLogout();
        window.location.href = URLS.LOGIN;
    }
    return (
        <nav className="bg-black shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-white">Libreria</span>
                    </div>
                    <div className="flex items-center md:hidden">
                        <button onClick={toggleMenu} id="menu-toggle" className="text-white focus:outline-none cursor-pointer">
                            <List />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to={URLS.HOME} className="text-white hover:text-blue-600">Inicio</Link>
                        <Link to={URLS.TOP_SELLERS} className="text-white hover:text-blue-600">BESTSELLLERS</Link>

                        <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('materias')
                            }} className="cursor-pointer text-white hover:text-blue-600">Generos<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="materias" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.GENEROS.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de generos</Link>
                                <Link to={URLS.GENEROS.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Crear Genero</Link>
                            </div>
                        </div>
                        <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('alumnos')
                            }} className="cursor-pointer text-white hover:text-blue-600">Libros<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="alumnos" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <Link to={URLS.LIBROS.LIST} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Lista de libros</Link>
                                <Link to={URLS.LIBROS.CREATE} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Crear Libro</Link>
                            </div>
                        </div>
                  {email && (
    <>
        <div className="hidden md:flex items-center space-x-4">
            <Link to={URLS.CARRITO} className="text-white hover:text-blue-600">
                Mi carrito de Compras
            </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
            <Link to={URLS.COMPRAS.LIST} className="text-white hover:text-blue-600">
                Mis Compras
            </Link>
        </div>
    </>
)}

                        {email && <div className="relative group">
                            <button onClick={() => {
                                toggleSubMenu('authMenu')
                            }} className="cursor-pointer text-white hover:text-blue-600">{email}<span> <ChevronDown size={10} className="inline" /></span></button>
                            <div id="authMenu" className="absolute hidden bg-white shadow-md mt-2 rounded-md z-10">
                                <button onClick={onLogoutClick} className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-gray-100 text-start">Cerrar sesión</button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            <div id="mobile-menu" className={!showMenu ? " hidden " : "" + " md:hidden px-4 pb-4"}>
                <a href="#" className="block text-white py-2">Inicio</a>
                <a href="#" className="block text-white py-2">Generos</a>
                <a href="#" className="block text-white py-2">Libros</a>
            </div>
        </nav>

    );
}