import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logoutUser, refreshUserToken, registerUser, fetchUser, updateUser } from "./userActions";
import type { UserInfo } from "./userActions";

interface UserState {
    data: UserInfo | null;
    isLoading: boolean;
    error: string | null;
    isAuthChecked: boolean;
}

const initialState: UserState = {
    data: null,
    isLoading: false,
    error: null,
    isAuthChecked: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserInfo | null>) {
            state.data = action.payload;
        },
        setAuthChecked(state, action: PayloadAction<boolean>) {
            state.isAuthChecked = action.payload;
        },
        clearUserError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user;
                state.isAuthChecked = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = String(action.payload ?? action.error.message ?? "Не удалось зарегистрироваться");
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.user;
                state.isAuthChecked = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = String(action.payload ?? action.error.message ?? "Не удалось авторизоваться");
            })
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.isAuthChecked = true;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.data = null;
                state.error = String(action.payload ?? action.error.message ?? "Не удалось получить данные пользователя");
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = String(action.payload ?? action.error.message ?? "Не удалось обновить данные пользователя");
            })
            .addCase(refreshUserToken.fulfilled, (state) => {
                state.isAuthChecked = true;
            })
            .addCase(refreshUserToken.rejected, (state, action) => {
                state.error = String(action.payload ?? action.error.message ?? "Не удалось обновить токен");
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.data = null;
                state.isAuthChecked = true;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = String(action.payload ?? action.error.message ?? "Не удалось выйти из системы");
            });
    },
});

export const { setUser, setAuthChecked, clearUserError } = userSlice.actions;
export const userReducer = userSlice.reducer;
