import React from 'react';
import CardExercicio from '../components/CardExercicio';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';

function IndexPage() {
    return (
        <div>
            <div
                className="flex flex-col items-center justify-center min-h-screen"
                style={{
                    backgroundImage: 'url(/background.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Navbar />
                <div className="flex flex-col items-center rounded-3xl p-6 mt-10 w-4/5"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(3px)',
                        color: 'white',
                    }}>
                    <Banner />
                    <div className="flex flex-col p-6 rounded-3xl w-full"
                        style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: 'white',
                        }}>
                        {/* Título alinhado à esquerda */}
                        <h1 className="text-3xl font-bold text-white pb-6 pl-12 text-left">Índice de Exercícios</h1>

                        {/* Cards centralizados */}
                        <div className="flex flex-wrap justify-center gap-10">
                            <CardExercicio to="/todolist" title="Exercício 1 - ToDo List" />
                            <CardExercicio to="/todolist-proptypes" title="Exercício 2 - Better ToDo" />
                            <CardExercicio to="/atm" title="Exercício 3 - ATM" />
                            <CardExercicio to="/notfound" title="Exercício 4 - Something" />
                            <CardExercicio to="/notfound" title="Exercício 5 - Something" />
                            <CardExercicio to="/notfound" title="Exercício 6 - Something" />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default IndexPage;
