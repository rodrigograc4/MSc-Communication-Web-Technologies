// ex3/balanceSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const balanceSlice = createSlice({
    name: 'balance',
    initialState: {
        amount: 0,
        history: [],
    },
    reducers: {
        depositar: (state, action) => {
            state.amount += action.payload;
            state.history.unshift({ type: 'Deposit', amount: action.payload });
            if (state.history.length > 5) state.history.pop();
        },
        levantar: (state, action) => {
            if (state.amount >= action.payload) {
                state.amount -= action.payload;
                state.history.unshift({ type: 'Withdraw', amount: action.payload });
                if (state.history.length > 5) state.history.pop();
            }
        },
    },
});

export const { depositar, levantar } = balanceSlice.actions;
export default balanceSlice.reducer;
