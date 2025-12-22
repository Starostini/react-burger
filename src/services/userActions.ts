import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../utils/request";
import { saveTokens, clearTokens, getRefreshToken, getAccessToken } from "../utils/token";
import type { AppDispatch } from "./store";

interface UserPayload {
    email: string;
    password: string;
}

interface RegisterPayload extends UserPayload {
    name: string;
}

interface UserInfo {
    email: string;
    name: string;
}

interface AuthResponse {
    success: boolean;
    user: UserInfo;
    accessToken: string;
    refreshToken: string;
}

interface TokenResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
}

interface LogoutResponse {
    success: boolean;
    message?: string;
}

interface UserResponse {
    success: boolean;
    user: UserInfo;
}

const rejectMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string" && error.trim()) {
        return error.trim();
    }

    return "Неизвестная ошибка";
};

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
    "user/register",
    async (payload, thunkAPI) => {
        try {
            const response = await request<AuthResponse>("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            saveTokens(response.accessToken, response.refreshToken);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(rejectMessage(error));
        }
    }
);

export const loginUser = createAsyncThunk<AuthResponse, UserPayload, { rejectValue: string }>(
    "user/login",
    async (payload, thunkAPI) => {
        try {
            const response = await request<AuthResponse>("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            saveTokens(response.accessToken, response.refreshToken);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(rejectMessage(error));
        }
    }
);

export const refreshUserToken = createAsyncThunk<TokenResponse, void, { rejectValue: string }>(
    "user/refreshToken",
    async (_, thunkAPI) => {
        try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                throw new Error("Refresh token отсутствует");
            }

            const response = await request<TokenResponse>("/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: refreshToken }),
            });

            saveTokens(response.accessToken, response.refreshToken);

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(rejectMessage(error));
        }
    }
);

export const logoutUser = createAsyncThunk<LogoutResponse, void, { rejectValue: string }>(
    "user/logout",
    async (_, thunkAPI) => {
        try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                throw new Error("Refresh token отсутствует");
            }

            const response = await request<LogoutResponse>("/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: refreshToken }),
            });

            clearTokens();

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(rejectMessage(error));
        }
    }
);

const authorizedRequest = async <T>(
    thunkAPI: { dispatch: AppDispatch },
    callback: (token: string) => Promise<T>
) => {
    const attempt = async () => {
        const token = getAccessToken();
        if (!token) {
            throw new Error("401 Токен не найден");
        }

        return callback(token);
    };

    try {
        return await attempt();
    } catch (error) {
        if (error instanceof Error && error.message.includes("401")) {
            try {
                await thunkAPI.dispatch(refreshUserToken()).unwrap();
                return await attempt();
            } catch (refreshError) {
                clearTokens();
                throw refreshError;
            }
        }

        throw error;
    }
};

export const fetchUser = createAsyncThunk<UserInfo, void, { rejectValue: string }>(
    "user/fetch",
    async (_, thunkAPI) => {
        try {
            {/*//@ts-expect-error ThunkAPI.dispatch is not assignable to parameter of type 'AppDispatch'*/}
            const response = await authorizedRequest(thunkAPI, (token) =>
                request<UserResponse>("/auth/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    },
                })
            );
            // @ts-expect-error response.user is not assignable to UserInfo
            return response.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(rejectMessage(error));
        }
    }
);

interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
}

export const updateUser = createAsyncThunk<UserInfo, UpdateUserPayload, { rejectValue: string }>(
    "user/update",
    async (payload, thunkAPI) => {
        try {
            {/*//@ts-expect-error ThunkAPI.dispatch is not assignable to parameter of type 'AppDispatch'*/}
            const response = await authorizedRequest(thunkAPI, (token) =>
                request<UserResponse>("/auth/user", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    },
                    body: JSON.stringify(payload),
                })
            );
            // @ts-expect-error response.user is not assignable to UserInfo
            return response.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(rejectMessage(error));
        }
    }
);

export const checkUserAuth = createAsyncThunk<void, void>(
    "user/checkAuth",
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();

            if (accessToken) {
                await dispatch(fetchUser()).unwrap();
                return;
            }

            if (refreshToken) {
                await dispatch(refreshUserToken()).unwrap();
                await dispatch(fetchUser()).unwrap();
                return;
            }
        } catch {
            clearTokens();
        } finally {
            dispatch({ type: "user/setAuthChecked", payload: true });
        }
    }
);

export type { UserInfo, AuthResponse, TokenResponse };
