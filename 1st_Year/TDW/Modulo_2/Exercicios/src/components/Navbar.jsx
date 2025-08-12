import React from 'react';
import { FaMagnifyingGlass } from "react-icons/fa6";

const Navbar = () => {
    return (
        <nav className="w-4/5 flex items-center justify-between p-4 text-white z-10">
            {/* Logo */}
            <div className="flex items-center">
                <img src="logo.png" alt="Logo" className="h-12 w-auto" />
            </div>

            {/* Search Bar (hidden on smaller screens) */}
            <div className="w-1/4 mx-4 flex items-center relative hidden md:flex">
                <FaMagnifyingGlass className="absolute left-6 text-gray-400 z-10" />
                <input
                    type="text"
                    placeholder="Type Something"
                    className="w-full pl-12 pr-4 py-2.5 rounded-3xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(1px)',
                        color: 'white',
                    }}
                />
            </div>

            {/* User Info + Browse Button (hidden on smaller screens) */}
            <div className="flex items-center space-x-4">
                {/* Botão Browse sem estilo de fundo */}
                <button className="text-react-yellow pr-12 py-2.5 focus:outline-none hover:text-blue-500 hidden xl:inline-block">
                    Home
                </button>
                <button className="text-white pr-12 py-2.5 focus:outline-none hover:text-blue-500 hidden xl:inline-block">
                    Browse
                </button>

                {/* Nome e Imagem com estilo de fundo */}
                <div
                    className="flex items-center space-x-3 px-6 py-2.5 rounded-3xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(1px)',
                        color: 'white',
                    }}
                >
                    <span>Rodrigo</span>
                    <img
                        src="profile_pic.jpg"
                        alt="User profile"
                        className="h-7 w-7 rounded-full"
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
