describe("Swaglabs", () => {
  const ITEMS = [
    `[data-test="add-to-cart-sauce-labs-backpack"]`,
    `[data-test="add-to-cart-sauce-labs-bike-light"]`,
    `[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]`,
    `[data-test="add-to-cart-sauce-labs-fleece-jacket"]`,
    `[data-test="add-to-cart-sauce-labs-onesie"]`,
    `[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]`,
  ];

  describe("Login page", () => {
    it("should allow to log in with valid credentials", () => {
      cy.login("standard_user", "secret_sauce");
      cy.url().should("eql", "https://www.saucedemo.com/inventory.html");
    });

    it("should no allow to log in with invalid credentials", () => {
      cy.login("username", "password");
      cy.get('[data-test="error"]').should(
        "have.text",
        "Epic sadface: Username and password do not match any user in this service"
      );
      cy.url().should("eql", "https://www.saucedemo.com/");
    });
  });

  describe("Ordering", () => {
    beforeEach(() => {
      cy.login("standard_user", "secret_sauce");
    });

    it("should add item to cart", () => {
      cy.get(".shopping_cart_badge").should("not.exist");
      cy.get(ITEMS[Math.floor(Math.random() * ITEMS.length)]).click();
      cy.get(".shopping_cart_badge").should("contain", "1");
      cy.contains("Remove");
      cy.get(".shopping_cart_link").click();
      cy.get(".cart_item").should("have.length", 1);
    });

    it("should remove item from the cart", () => {
      cy.get(ITEMS[Math.floor(Math.random() * ITEMS.length)]).click();
      cy.get(".shopping_cart_link").click();

      cy.contains("Remove").click();
      cy.get(".cart_item").should("not.exist");
      cy.get(".shopping_cart_badge").should("not.exist");
      cy.get('[data-test="continue-shopping"]').click();
      cy.get(".shopping_cart_badge").should("not.exist");
    });

    it("should fill checkout information and confirm the order", () => {
      cy.get(ITEMS[Math.floor(Math.random() * ITEMS.length)]).click();
      cy.get(".shopping_cart_link").click();

      cy.get('[data-test="checkout"]').click();
      cy.get('[data-test="firstName"]').type("firstName");
      cy.get('[data-test="lastName"]').type("lastName");
      cy.get('[data-test="postalCode"]').type("123454");
      cy.get('[data-test="continue"]').click();
      cy.get(".cart_item").should("have.length", 1);
      cy.contains("Payment Information:");
      cy.contains("Shipping Information:");
      cy.get('[data-test="finish"]').click();
      cy.contains("THANK YOU FOR YOUR ORDER");
    });
  });
});
