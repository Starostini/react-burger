const { orderReducer, createOrder } = require("./orderSlice");

describe("orderReducer", () => {
  const initialState = { data: { number: null }, isLoading: false, error: null };

  it("return default state", () => {
    expect(orderReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("set loading when request pending", () => {
    const state = orderReducer(initialState, { type: createOrder.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("store order number after request fulfilled", () => {
    const state = orderReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: 123456,
    });
    expect(state.isLoading).toBe(false);
    expect(state.data.number).toBe(123456);
  });

  it("store error if request rejected", () => {
    const state = orderReducer(initialState, {
      type: createOrder.rejected.type,
      payload: "Ошибка",
      error: { message: "Ошибка" },
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Ошибка");
  });
});
