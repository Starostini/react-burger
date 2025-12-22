declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      dragTo(target: string | Element | JQuery<Element>): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add(
  "dragTo",
  { prevSubject: "element" },
  (subject, target) => {
    const dataTransfer = new DataTransfer();

    const performDrop = (el: Cypress.Chainable<JQuery<Element>>) => {
      cy.wrap(subject).trigger("dragstart", { dataTransfer });
      el
        .trigger("dragenter", { dataTransfer })
        .trigger("dragover", { dataTransfer })
        .trigger("drop", { dataTransfer });
      cy.wrap(subject).trigger("dragend", { dataTransfer });
    };

    if (typeof target === "string") {
      performDrop(cy.get(target));
    } else {
      performDrop(cy.wrap(target));
    }

    return cy.wrap(subject);
  }
);

export {};
