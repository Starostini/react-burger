const { ingredientsReducer, fetchIngredients } = require("./ingredientsSlice");
const { createIngredient } = require("./test-utils");

describe("ingredientsReducer", () => {
  const initialState = { data: [], isLoading: false, error: null };

  it("return the default state", () => {
    const state = ingredientsReducer(undefined, { type: "UNKNOWN" });
    expect(state).toEqual(initialState);
  });

  it("set loading true while fetch pending", () => {
    const state = ingredientsReducer(initialState, { type: fetchIngredients.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("store ingredients when request is success", () => {
    const items = [createIngredient({ id: "uniq-id-1" }), createIngredient({ id: "uniq-id-2" })];
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: items,
    });
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(items);
  });

  it("store error if request failed", () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      payload: "Ошибка",
      error: { message: "Ошибка" },
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Ошибка");
  });
});
