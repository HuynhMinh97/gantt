
describe('Navigate user skill', () => {
    it('Check Mode New', function () {
        cy.login('lacnt', '12345678');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000);
        cy.visit(Cypress.env('host') + Cypress.env('user_skills'));
        cy.url().should('eq', Cypress.env('host') + Cypress.env('user_skills'));
        checkUISkill();
        // inputDataSkill();
        saveDataSkill();
      });

    function checkUISkill() {
        // cy.get('.text__gradient').should('have.text', 'Edit skills\n');
        cy.label('skills', ' Skills(MAX 50)*');
        // cy.input('skills', 'Fill name and enter to add your skills');
    }

    function inputDataSkill() {
        cy.get('#skills_input').type('code');
        cy.get('.suggestion__data').find('ait-chip').first().click();
        cy.get('#skills_input').type('t');
        cy.get('.suggestion__data').find('ait-chip').first().click();
        cy.get('#skills_input').type('phy');
        cy.get('.suggestion__data').find('ait-chip').first().click();
    }

    function saveDataSkill() {
        inputDataSkill();
        cy.intercept({
            method: 'POST',
            url: Cypress.env('host') + Cypress.env('api_url'),
        }).as('dataSaved');
        cy.clickButton('save');
        cy.wait('@dataSaved').then((req) => {
            cy.status(req.response.statusCode);
        })
    }
});