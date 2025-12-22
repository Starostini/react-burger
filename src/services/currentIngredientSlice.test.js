const { currentIngredientReducer, setCurrent, clearCurrent } = require("./currentIngredientSlice");
const { createIngredient } = require("./test-utils");

describe("currentIngredientReducer", () => {
  it("should return the initial state", () => {
    const state = currentIngredientReducer(undefined, { type: "UNKNOWN" });
    expect(state).toEqual({ current: null });
  });

  it("set current ingredient", () => {
    const ingredient = createIngredient({ name: "Булка" });
    const state = currentIngredientReducer(undefined, setCurrent(ingredient));
    expect(state.current).toEqual(ingredient);
  });

  it("clear current ingredient", () => {
    const ingredient = createIngredient();
    const state = currentIngredientReducer({ current: ingredient }, clearCurrent());
    expect(state.current).toBeNull();
  });
});
