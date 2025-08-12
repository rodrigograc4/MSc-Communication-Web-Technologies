import React from 'react';

function Banner() {
    return (
        <div className="relative flex items-center justify-start h-80 w-full mb-6 rounded-3xl overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, rgba(11,118,112,1) 10%, rgba(2,10,20, 1) 90%)', // Ajuste as cores conforme necessário
            }}>
            {/* Background graphic overlay example */}
            <div className="absolute top-0 left-0 w-full h-full">
                <img
                    src="banner.jpg"
                    alt="Background overlay"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>
            {/* Content on top of the background */}
            <div className="relative z-10 p-16"> {/* Adicionado padding para criar margem ao texto */}
                <p className="text-lg sm:text-xl text-white mb-6">
                    Welcome to TDW M2
                </p>
                <h1 className="text-2xl sm:text-4xl font-bold text-react-yellow mb-6">
                    BROWSE THROUGH YOUR CLASS <br />EXERCISES HERE
                </h1>
                <button className="bg-react-yellow hover:bg-react-yellow-600 text-white py-2 px-4 rounded-full">
                    Browse Now
                </button>
            </div>
        </div>
    );
}

export default Banner;
