import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4"
            style={{
                backgroundImage: 'url(/background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <h1 className="text-4xl font-bold text-white mb-12">Erro 404 - Página não encontrada</h1>
            <p className="text-xl font-bold text-white mb-4">Desculpe, mas a página que procura não foi encontrada.</p>
            <p className="text-xl underline underline-offset-4 font-bold text-white">
                <Link to="/">Voltar à página inicial</Link>
            </p>
        </div>
    );
}
