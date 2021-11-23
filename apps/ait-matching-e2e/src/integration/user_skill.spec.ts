describe('Navigate user skill', () => {
    it('Check Mode New', function () {
        checkUISkill();
        saveDataSkill();
    });

    function checkUISkill() {
        cy.get('#title_text__gradient').should('have.text', 'Add skill');
        cy.label('skills', ' SKILLS (MAX 50) *');
        // cy.input('skills', 'Fill name and enter to add your skills');
    }

    function inputDataSkill() {
        cy.get('#skills_input').type('code');
        //   cy.get('ait-chip').contains('code US').click();
        cy.get('.select_data').find('ait-chip').first().click();
        cy.get('#skills_input').type('test');
        cy.get('.select_data').find('ait-chip').first().click();
        cy.get('#skills_input').type('python');
        cy.get('.select_data').find('ait-chip').first().click();
    }

    function saveDataSkill() {
        inputDataSkill();
        cy.intercept({
            method: 'POST',
            url: Cypress.env('host') + Cypress.env('api_url'),
        }).as('dataSaved');
        cy.clickButton('save close');
        cy.wait('@dataSaved').then((req) => {
            cy.status(req.response.statusCode);
        })
    }
});