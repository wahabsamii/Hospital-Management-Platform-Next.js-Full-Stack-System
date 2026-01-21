"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    isAuth: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        signInSuccess:(state, action) => {
            state.currentUser = action.payload;
            state.isAuth = true
        },
        updateUser:(state, action) => {
            state.currentUser = action.payload;
        },
        signOutSuccess:(state) => {
            state.currentUser = null;
            state.error = null;
            state.isAuth = false
        }
    }
});


export const {signInSuccess, signOutSuccess, updateUser} = userSlice.actions;
export default userSlice.reducer;