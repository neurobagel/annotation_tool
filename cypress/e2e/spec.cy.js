describe('My first Test', () => {
    'Goes to the Kitchen sink', () => {
      cy.visit('https://example.cypress.io');
      cy.contains('type').click();
      cy.url().should('include', '/commands/actions');
    };
  }
);

describe('First Annotator Test', () => {
  it(
    'Make sure the annotator loads', () => {
      cy.visit('http://localhost:3000/');
    }
  );
});