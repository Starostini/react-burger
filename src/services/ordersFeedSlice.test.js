const { ordersFeedReducer, ordersFeedActions } = require("./ordersFeedSlice");
const { createOrdersFeedResponse } = require("./test-utils");

describe("ordersFeedReducer", () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    status: "idle",
    error: null,
  };

  it("return default state", () => {
    expect(ordersFeedReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("set connection state", () => {
    const state = ordersFeedReducer(initialState, ordersFeedActions.connect());
    expect(state.status).toBe("connecting");
    expect(state.error).toBeNull();
  });

  it("check when connection goes disconnect", () => {
    const state = ordersFeedReducer(
      { ...initialState, status: "online" },
      ordersFeedActions.disconnect()
    );
    expect(state.status).toBe("offline");
    expect(state.orders).toEqual([]);
  });

  it("check when connection goes success", () => {
    const state = ordersFeedReducer(initialState, ordersFeedActions.connectionSuccess());
    expect(state.status).toBe("online");
    expect(state.error).toBeNull();
  });

  it("check when connection goes closed", () => {
    const state = ordersFeedReducer(
      { ...initialState, orders: [{ number: 1 }] },
      ordersFeedActions.connectionClosed()
    );
    expect(state.status).toBe("offline");
    expect(state.orders).toEqual([]);
  });

  it("check when connection get error", () => {
    const state = ordersFeedReducer(initialState, ordersFeedActions.connectionError("fail"));
    expect(state.error).toBe("fail");
    expect(state.status).toBe("offline");
  });

  it("check when request receive orders", () => {
    const payload = createOrdersFeedResponse({ total: 100, totalToday: 15 });
    const state = ordersFeedReducer(initialState, ordersFeedActions.receiveOrders(payload));
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(15);
  });
});
