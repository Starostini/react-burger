describe("Burger constructor", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/ingredients", { fixture: "ingredients.json" }).as("getIngredientsList");
    cy.intercept("GET", "**/auth/user", { fixture: "user.json" }).as("getUserData");
    cy.intercept("POST", "**/orders", { fixture: "order.json" }).as("createOrder");

    cy.visit("/", {
      onBeforeLoad(win) {
        win.document.cookie = "accessToken=Bearer test-token";
        win.localStorage.setItem("refreshToken", "refresh-token");
      },
    });

    cy.wait("@getIngredientsList");
    cy.wait("@getUserData");
  });

  it("drag items of ingredient, open modals and create order", () => {
    cy.get('[data-cyid="ingredient-card"][data-ingredient-type="main"]').first().as("firstIngredient");

    cy.get("@firstIngredient").click();
    cy.contains("Детали ингредиента").should("be.visible");
    cy.contains("Биокотлета из марсианской Магнолии").should("be.visible");
    cy.get('[data-cyid="modal-close"]').click();

    cy.get('[data-cyid="ingredient-card"][data-ingredient-type="bun"]').first().as("bun");
    cy.get('@bun').dragTo('[data-cyid="bun-drop"]');

    cy.get('@firstIngredient').dragTo('[data-cyid="constructor-fillings"]');
    cy.get('[data-cyid="constructor-fillings"]').contains("Биокотлета из марсианской Магнолии").should("exist");

    cy.contains('button', 'Оформить заказ').as("orderButton");
    cy.get('@orderButton').should("not.be.disabled").click();

    cy.wait('@createOrder').its('request.body.ingredients').should('have.length', 3);
    cy.contains("идентификатор заказа").should("be.visible");
    cy.contains("123456").should("be.visible");

    cy.get('[data-cyid="modal-close"]').click();
    cy.contains("идентификатор заказа").should("not.exist");
  });
});
