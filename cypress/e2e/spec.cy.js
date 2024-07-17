describe('Symph Day - QA Tests', () => {
  const validUsername = 'standard_user';
  const validPassword = 'secret_sauce';
  const invalidCredentials = {
    username: '1234',
    password: '1234'
  };
  const userInfo = {
    firstName: 'Cha',
    lastName: 'AAAA',
    postalCode: '1234'
  };
  const expectedError = 'Epic sadface: Username and password do not match any user in this service';

  const products = [
    { name: 'Sauce Labs Backpack', id: '4' },
    { name: 'Sauce Labs Bike Light', id: '0' },
    { name: 'Sauce Labs Bolt T-Shirt', id: '1' },
    { name: 'Sauce Labs Fleece Jacket', id: '5' },
    { name: 'Sauce Labs Onesie', id: '2' },
    { name: 'Test.allTheThings() T-Shirt (Red)', id: '3' }
  ];

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
  });

  it('Login with invalid credentials', () => {
    cy.get('[data-test="username"]').type(invalidCredentials.username);
    cy.get('[data-test="password"]').type(invalidCredentials.password);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('be.visible').and('contain', expectedError);
  });

  it('Login with valid credentials', () => {
    cy.get('[data-test="username"]').type(validUsername);
    cy.get('[data-test="password"]').type(validPassword);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.get('.app_logo').should('be.visible');
  });

  it('Verify product display and add to cart', () => {
    cy.get('[data-test="username"]').type(validUsername);
    cy.get('[data-test="password"]').type(validPassword);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');

    cy.get('.inventory_list').within(() => {
      products.forEach(product => {
        cy.get(`[data-test="item-${product.id}-title-link"] > [data-test="inventory-item-name"]`).should('exist');
      });
    });

    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should('be.visible');
  });

  it('Verify cart functionality', () => {
    cy.get('[data-test="username"]').type(validUsername);
    cy.get('[data-test="password"]').type(validPassword);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.url().should('include', '/cart.html');
    cy.get('[data-test="inventory-item"]').should('be.visible');
    cy.get('[data-test="inventory-item-name"]').click();
    cy.url().should('include', `inventory-item.html?id=${products[0].id}`);

    cy.get('[data-test="item-sauce-labs-backpack-img"]').should('be.visible');
    cy.get('[data-test="inventory-item-name"]').should('be.visible');
    cy.get('[data-test="inventory-item-desc"]').should('be.visible');
    cy.get('[data-test="inventory-item-price"]').should('be.visible');
    cy.get('[data-test="remove"]').should('be.visible');
    cy.get('[data-test="back-to-products"]').should('be.visible');

    cy.get('.back-image').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', '/checkout-step-one.html');
    
    cy.get('[data-test="firstName"]').type(userInfo.firstName);
    cy.get('[data-test="lastName"]').type(userInfo.lastName);
    cy.get('[data-test="postalCode"]').type(userInfo.postalCode);
    cy.get('[data-test="continue"]').should('be.visible').click();
    
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="inventory-item"]').should('be.visible');
    cy.get('[data-test="payment-info-label"]').should('be.visible');
    cy.get('[data-test="shipping-info-label"]').should('be.visible');
    cy.get('[data-test="total-info-label"]').should('be.visible');
    cy.get('[data-test="finish"]').should('be.visible').click();
    
    cy.url().should('include', '/checkout-complete.html');
    cy.get('[data-test="title"]').should('be.visible');
    cy.get('[data-test="complete-header"]').should('be.visible');
    cy.get('[data-test="complete-text"]').should('be.visible');
    cy.get('[data-test="back-to-products"]').should('be.visible').click();
    cy.url().should('include', '/inventory.html');
  });
});
