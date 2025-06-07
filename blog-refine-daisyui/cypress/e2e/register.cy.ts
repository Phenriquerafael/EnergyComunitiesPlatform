describe('Register Page', () => {
  beforeEach(() => {
    cy.clearCookies(); // Limpa cookies para evitar redirecionamento
    cy.clearLocalStorage(); // Limpa localStorage
    cy.visit('/register');
  });

  it('should successfully register a new user', () => {
    cy.intercept('GET', `${Cypress.env('apiUrl')}/roles/all*`, {
      statusCode: 200,
      body: [
        { id: '1', name: 'PROSUMER' },
        { id: '2', name: 'User' },
      ],
    }).as('getRoles');

    cy.wait('@getRoles', { timeout: 10000 });

    // Verifica se o formulário está visível
    cy.get('form[name="register"]', { timeout: 10000 }).should('be.visible');

    // Loga o DOM para depuração
    cy.document().then((doc) => {
      cy.log('HTML da página:', doc.body.innerHTML);
    });

    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="phoneNumber"]').type('1234567890');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('.ant-select').click();
    cy.get('.ant-select-item-option-content').contains('PROSUMER').click();

    cy.intercept('POST', `${Cypress.env('apiUrl')}/signup`, {
      statusCode: 201,
      body: { message: 'Registration successful' },
    }).as('signup');

    cy.get('button[type="submit"]').click();

    cy.wait('@signup').its('request.body').should('deep.equal', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      password: 'Password123!',
      role: '1',
    });

    cy.contains('Registration successful').should('be.visible');
    cy.url().should('include', '/signUp');
  });
});