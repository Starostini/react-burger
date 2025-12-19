const { orderDetailsReducer, clearOrderDetails, fetchOrderByNumber } = require("./orderDetailsSlice");
const { createOrdersFeedItem } = require("./test-utils");

describe("orderDetailsReducer", () => {
  const initialState = { data: null, isLoading: false, error: null, orderNumber: null };

  it("return default state", () => {
    expect(orderDetailsReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("reset state", () => {
    const state = orderDetailsReducer({ ...initialState, data: createOrdersFeedItem() }, clearOrderDetails());
    expect(state).toEqual(initialState);
  });

  it("check when request pending", () => {
    const state = orderDetailsReducer(initialState, {
      type: fetchOrderByNumber.pending.type,
      meta: { arg: "123456" },
    });
    expect(state.isLoading).toBe(true);
    expect(state.orderNumber).toBe(123456);
    expect(state.error).toBeNull();
  });

  it("check when request fulfilled", () => {
    const order = createOrdersFeedItem({ number: 654321 });
    const state = orderDetailsReducer(initialState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload: order,
    });
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(order);
    expect(state.orderNumber).toBe(654321);
  });

  it("check when request rejected", () => {
    const state = orderDetailsReducer(initialState, {
      type: fetchOrderByNumber.rejected.type,
      payload: "Не найден",
      error: { message: "Не найден" },
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Не найден");
  });
});
