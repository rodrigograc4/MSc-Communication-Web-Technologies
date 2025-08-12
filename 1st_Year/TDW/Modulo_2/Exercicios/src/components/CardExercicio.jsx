import React from 'react';
import { Link } from 'react-router-dom';

function CardExercicio({ to, title }) {
    return (
        <Link
            to={to}
            className="w-80 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-110"
        >
            <div className="w-full h-40 overflow-hidden">
                <iframe
                    src={to}
                    title="Preview"
                    style={{
                        width: '1920px',
                        height: '960px',
                        transform: 'scale(0.167)',
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                        border: 'none'
                    }}
                />
            </div>
            <div
                className="block w-full text-center py-2.5 transition duration-200"
                style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(2px)',
                    color: 'white',
                }}
            >
                {title}
            </div>
        </Link>
    );
}

export default CardExercicio;
