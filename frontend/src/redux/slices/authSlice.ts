import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
    email: string | null
}

const initialState: AuthState = {
    email: null
}

export const authSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        logoutUser: state => {
            state.email = null
        }
    }
})

export const { loginUser, logoutUser } = authSlice.actions

export default authSlice.reducer