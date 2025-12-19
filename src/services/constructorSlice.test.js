const {
  constructorReducer,
  addIngredient,
  deleteIngredient,
  clearConstructor,
  changeOrder,
} = require("./constructorSlice");
const { createIngredient } = require("./test-utils");

describe("constructorReducer", () => {
  it("return default state", () => {
    const state = constructorReducer(undefined, { type: "UNKNOWN" });
    expect(state).toEqual({ bun: null, items: [] });
  });

  it("check adding bun", () => {
    const bun = createIngredient({ type: "bun", name: "Булка" });
    const state = constructorReducer(undefined, addIngredient(bun));
    expect(state.bun).toEqual(bun);
    expect(state.items).toHaveLength(0);
  });

  it("check adding filling", () => {
    const filling = createIngredient({ uid: "uniq-id-1" });
    const state = constructorReducer(undefined, addIngredient(filling));
    expect(state.items).toEqual([filling]);
  });

  it("remove ingredient by uniq id", () => {
    const first = createIngredient({ uid: "uniq-id-1" });
    const second = createIngredient({ uid: "uniq-id-2" });
    const initial = { bun: null, items: [first, second] };
    const state = constructorReducer(initial, deleteIngredient("uniq-id-1"));
    expect(state.items).toEqual([second]);
  });

  it("clear constructor", () => {
    const bun = createIngredient({ type: "bun" });
    const initial = { bun, items: [createIngredient({ uid: "uid" })] };
    const state = constructorReducer(initial, clearConstructor());
    expect(state).toEqual({ bun: null, items: [] });
  });

  it("change order of ingredients", () => {
    const first = createIngredient({ uid: "uniq-id-1", name: "First" });
    const second = createIngredient({ uid: "uniq-id-2", name: "Second" });
    const third = createIngredient({ uid: "uniq-id-3", name: "Third" });
    const initial = { bun: null, items: [first, second, third] };
    const state = constructorReducer(initial, changeOrder({ from: 0, to: 2 }));
    expect(state.items.map((item) => item.uid)).toEqual(["uniq-id-2", "uniq-id-3", "uniq-id-1"]);
  });
});
