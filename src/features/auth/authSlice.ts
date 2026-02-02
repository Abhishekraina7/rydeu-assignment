import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    user: null | any;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated: (state: AuthState, action: { payload: boolean }) => {
            state.isAuthenticated = action.payload;
        },
    },
});

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
