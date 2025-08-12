// ex3/components/ATM.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { depositar, levantar } from '../balanceSlice';
import InputAmount from '../components/InputAmount';
import Buttons from '../components/Buttons';
import Historic from '../components/Historic';

function ATM() {
    const [amount, setAmount] = useState("");
    const balance = useSelector((state) => state.balance.amount);
    const history = useSelector((state) => state.balance.history);
    const dispatch = useDispatch();

    const handleDeposit = () => {
        if (amount <= 0) return;
        dispatch(depositar(Number(amount)));
        setAmount("");
    };

    const handleWithdraw = () => {
        if (amount <= 0) return;
        dispatch(levantar(Number(amount)));
        setAmount("");
    };

    return (
        <div className="min-h-screen bg-dark-pink flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-6 bg-off-white to-pink-300 shadow-2xl rounded-lg min-h-[300px] p-12">
                <h1 className="text-4xl font-bold text-center text-strong-magenta mb-12 mx-32">
                    ATM Machine
                </h1>
                <div className="flex space-x-10 mb-6">
                    <h3 className="text-2xl font-semibold text-magenta">Current balance: <span className='text-black'>${balance}</span></h3>
                </div>
                <div className="flex w-full space-x-10 mb-6">
                    <InputAmount amount={amount} setAmount={setAmount} />
                    <Buttons handleDeposit={handleDeposit} handleWithdraw={handleWithdraw} />
                </div>
                <Historic history={history} />
            </div>
        </div>
    );
}

export default ATM;
