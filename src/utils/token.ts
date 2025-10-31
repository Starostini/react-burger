import { deleteCookie, getCookie, setCookie } from "./cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const saveTokens = (accessToken: string, refreshToken: string) => {
    setCookie(ACCESS_TOKEN_KEY, accessToken, { expires: 60 * 20 });
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
    deleteCookie(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getAccessToken = () => getCookie(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) ?? null;
