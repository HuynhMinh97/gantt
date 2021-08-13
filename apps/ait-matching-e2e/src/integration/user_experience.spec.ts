describe('Test 1', () => {
  it('sign in', function () {
    cy.login('diennv', '12345678');
    cy.get('#title_input').type('aaa').should('have.value', 'aaa');
  });
});
