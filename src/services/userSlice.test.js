const { userReducer, setUser, setAuthChecked, clearUserError } = require("./userSlice");
const {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  refreshUserToken,
  logoutUser,
} = require("./userActions");
const { createUser } = require("./test-utils");

describe("userReducer", () => {
  const initialState = { data: null, isLoading: false, error: null, isAuthChecked: false };

  it("return default state", () => {
    expect(userReducer(undefined, { type: "UNKNOWN" })).toEqual(initialState);
  });

  it("set user manually", () => {
    const user = createUser();
    const state = userReducer(initialState, setUser(user));
    expect(state.data).toEqual(user);
  });

  it("set auth as checked", () => {
    const state = userReducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it("clear user error", () => {
    const state = userReducer({ ...initialState, error: "fail" }, clearUserError());
    expect(state.error).toBeNull();
  });

  describe("registerUser", () => {
    it("check when request pending", () => {
      const state = userReducer(initialState, { type: registerUser.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("check when request fulfilled", () => {
      const user = createUser({ name: "TestUser" });
      const state = userReducer(initialState, {
        type: registerUser.fulfilled.type,
        payload: { user },
      });
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
    });

    it("check when request rejected", () => {
      const state = userReducer(initialState, {
        type: registerUser.rejected.type,
        payload: "Ошибка при регистрации",
        error: { message: "Ошибка при регистрации" },
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Ошибка при регистрации");
    });
  });

  describe("loginUser", () => {
    it("check when request pending", () => {
      const state = userReducer(initialState, { type: loginUser.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("check when request fulfilled", () => {
      const user = createUser({ name: "TestUser" });
      const state = userReducer(initialState, {
        type: loginUser.fulfilled.type,
        payload: { user },
      });
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
    });

    it("check when request rejected", () => {
      const state = userReducer(initialState, {
        type: loginUser.rejected.type,
        payload: "Ошибка входа",
        error: { message: "Ошибка входа" },
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Ошибка входа");
    });
  });

  describe("fetchUser", () => {
    it("check when request pending", () => {
      const state = userReducer(initialState, { type: fetchUser.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("check when request fulfilled", () => {
      const user = createUser({ name: "TestUser" });
      const state = userReducer(initialState, {
        type: fetchUser.fulfilled.type,
        payload: user,
      });
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
    });

    it("check when request rejected", () => {
      const state = userReducer(initialState, {
        type: fetchUser.rejected.type,
        payload: "Ошибка получения данных",
        error: { message: "Ошибка получения данных" },
      });
      expect(state.isLoading).toBe(false);
      expect(state.data).toBeNull();
      expect(state.error).toBe("Ошибка получения данных");
    });
  });

  describe("updateUser", () => {
    it("check when request pending", () => {
      const state = userReducer(initialState, { type: updateUser.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("check when request fulfilled", () => {
      const user = createUser({ name: "TestUser" });
      const state = userReducer(initialState, {
        type: updateUser.fulfilled.type,
        payload: user,
      });
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(user);
    });

    it("check when request rejected", () => {
      const state = userReducer(initialState, {
        type: updateUser.rejected.type,
        payload: "Ошибка обновления данных пользователя",
        error: { message: "Ошибка обновления данных пользователя" },
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Ошибка обновления данных пользователя");
    });
  });

  describe("refreshUserToken", () => {
    it("set auth checked when request fulfilled", () => {
      const state = userReducer(initialState, { type: refreshUserToken.fulfilled.type });
      expect(state.isAuthChecked).toBe(true);
    });

    it("store error when request rejected", () => {
      const state = userReducer(initialState, {
        type: refreshUserToken.rejected.type,
        payload: "failed refreshing token",
        error: { message: "failed refreshing token" },
      });
      expect(state.error).toBe("failed refreshing token");
    });
  });

  describe("logoutUser", () => {
    it("check when request pending", () => {
      const state = userReducer(initialState, { type: logoutUser.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("check when request fulfilled", () => {
      const populated = { data: createUser(), isLoading: true, error: "oops", isAuthChecked: false };
      const state = userReducer(populated, { type: logoutUser.fulfilled.type });
      expect(state.data).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it("check when request rejected", () => {
      const state = userReducer(initialState, {
        type: logoutUser.rejected.type,
        payload: "Ошибка выхода",
        error: { message: "Ошибка выхода" },
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Ошибка выхода");
    });
  });
});
