import { checkResponse } from "./checkResponse";
import { BASE_URL } from "../base";

export function request<T>(endpoint: string, options?: RequestInit) {
    return fetch(`${BASE_URL}${endpoint}`, options).then((res) => checkResponse<T>(res));
}
