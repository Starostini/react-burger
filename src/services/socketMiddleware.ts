import type {
    ActionCreatorWithoutPayload,
    ActionCreatorWithPayload,
    Middleware,
} from "@reduxjs/toolkit";

interface SocketActions<TMessage> {
    connect: ActionCreatorWithoutPayload | ActionCreatorWithPayload<unknown>;
    disconnect: ActionCreatorWithoutPayload | ActionCreatorWithPayload<unknown>;
    connectionSuccess: ActionCreatorWithoutPayload;
    connectionClosed: ActionCreatorWithoutPayload;
    connectionError: ActionCreatorWithPayload<string>;
    receiveOrders: ActionCreatorWithPayload<TMessage>;
}

interface SocketMiddlewareConfig<TMessage> {
    wsUrl: string;
    actions: SocketActions<TMessage>;
    withToken?: boolean;
    getToken?: () => string | null;
}

export const createSocketMiddleware = <TMessage,>(
    config: SocketMiddlewareConfig<TMessage>
): Middleware => {
    const { wsUrl, actions, withToken = false, getToken } = config;

    return (store) => {
        let socket: WebSocket | null = null;

        return (next) => (action) => {
            if (actions.connect.match(action)) {
                if (socket) {
                    socket.close();
                }

                let url = wsUrl;

                if (withToken) {
                    const token = getToken?.();

                    if (!token) {
                        store.dispatch(actions.connectionError("Отсутствует токен"));
                        return next(action);
                    }

                    const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
                    const separator = url.includes("?") ? "&" : "?";
                    url = `${url}${separator}token=${tokenValue}`;
                }

                socket = new WebSocket(url);

                socket.onopen = () => {
                    store.dispatch(actions.connectionSuccess());
                };

                socket.onerror = () => {
                    store.dispatch(actions.connectionError("Ошибка соединения"));
                };

                socket.onmessage = (event) => {
                    try {
                        const data: TMessage = JSON.parse(event.data);
                        store.dispatch(actions.receiveOrders(data));
                    } catch {
                        store.dispatch(actions.connectionError("Не удалось обработать данные"));
                    }
                };

                socket.onclose = () => {
                    store.dispatch(actions.connectionClosed());
                };
            }

            if (actions.disconnect.match(action)) {
                if (socket) {
                    socket.close();
                }
                socket = null;
            }

            return next(action);
        };
    };
};
