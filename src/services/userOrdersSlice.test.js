const { userOrdersReducer, userOrdersActions } = require("./userOrdersSlice");
const { createOrdersFeedResponse } = require("./test-utils");

describe("userOrdersReducer", () => {
  const initialState = { orders: [], status: "idle", error: null };

  it("return default state", () => {
    expect(userOrdersReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("start connecting", () => {
    const state = userOrdersReducer(initialState, userOrdersActions.connect());
    expect(state.status).toBe("connecting");
  });

  it("set connection as disconnect", () => {
    const state = userOrdersReducer(
      { ...initialState, orders: [{ number: 1 }] },
      userOrdersActions.disconnect()
    );
    expect(state.status).toBe("offline");
    expect(state.orders).toEqual([]);
  });

  it("set connection success", () => {
    const state = userOrdersReducer(initialState, userOrdersActions.connectionSuccess());
    expect(state.status).toBe("online");
  });

  it("should handle connection closed", () => {
    const state = userOrdersReducer(
      { ...initialState, status: "online" },
      userOrdersActions.connectionClosed()
    );
    expect(state.status).toBe("offline");
  });

  it("set connection error", () => {
    const state = userOrdersReducer(initialState, userOrdersActions.connectionError("oops"));
    expect(state.status).toBe("offline");
    expect(state.error).toBe("oops");
  });

  it("check when receive orders", () => {
    const payload = createOrdersFeedResponse();
    const state = userOrdersReducer(initialState, userOrdersActions.receiveOrders(payload));
    expect(state.orders).toEqual(payload.orders);
  });

  it("clear orders", () => {
    const state = userOrdersReducer(
      { orders: [{ number: 1 }], status: "online", error: "" },
      userOrdersActions.clearOrders()
    );
    expect(state).toEqual(initialState);
  });
});
