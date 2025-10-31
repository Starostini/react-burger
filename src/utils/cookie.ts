export type CookieOptions = {
    expires?: number | Date;
    path?: string;
};

const formatExpires = (expires?: number | Date) => {
    if (!expires) {
        return "";
    }

    if (typeof expires === "number") {
        const date = new Date();
        date.setTime(date.getTime() + expires * 1000);
        return `; expires=${date.toUTCString()}`;
    }

    return `; expires=${expires.toUTCString()}`;
};

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
    const { path = "/", expires } = options;
    const encoded = encodeURIComponent(value);
    document.cookie = `${name}=${encoded}${formatExpires(expires)}; path=${path}`;
};

export const getCookie = (name: string) => {
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()\\[\\]\\\\\/\+^])/g, "\\$1")}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : null;
};

export const deleteCookie = (name: string, path = "/") => {
    document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=${path}`;
};
