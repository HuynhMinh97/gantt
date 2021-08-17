describe('Test Cypress', () => {
  it('sign in', function () {
    cy.login('diennv', '12345678');
    cy.wait(1000);
    cy.visit('http://localhost:4200/#/user-experience');

    if (cy.url().should('eq', 'http://localhost:4200/#/user-experience')) {
      // Check title and placeholder
      cy.label('title', ' TITLE*');
      cy.input('title', 'Developer');

      cy.label('company_working', ' COMPANY*');
      cy.get('#company_working_chip_input').should('have.text', 'AIT');

      cy.label('location', ' LOCATION*');
      cy.input('location', 'Ho Chi Minh City');

      cy.label('employee_type', ' EMPLOYMENT TYPE*');
      cy.input('employee_type', 'Select');

      cy.label('start_date_from', ' START DATE');
      cy.getValueDate('start_date_from', new Date().getTime());
      cy.input('start_date_to', 'yyyy/MM/dd');

      cy.label('description', ' DESCRIPTION');
      cy.textarea('description', 'Place your text');

      // Check validate when click save
      cy.clickButton('SaveAndContinue');

      cy.errorMessage('title', 'TITLE を入力してください。');
      cy.errorMessage('location', 'LOCATION を入力してください。');
      cy.errorMessage('employee_type', 'EMPLOYMENT TYPE を入力してください。');
      cy.errorMessage(
        'start-date',
        ' start_date_to 以下の値で start_date_from を入力してください。'
      );

      // Check reset Form
      cy.clickButton('reset');
      cy.resetForm([
        'title_input',
        'company_working_input',
        'location_input',
        'employee_type_input',
        'is_working',
        //'start_date_from_input',
        'start_date_to_input',
        'description_textarea',
        // 'title_error_message_0',
        // 'company_working_error_message_0',
        // 'location_error_message_0',
        // 'employee_type_error_message_0',
      ]);

      // Check save
      cy.typeText('title', 'uu');
      cy.get('ait-chip').contains('nuuu').click();
      cy.typeText('company_working', 'a');
      cy.get('ait-chip');
      cy.contains('AIT').click();
      cy.typeText('location', 'a');
      cy.get('ait-chip');
      cy.contains('Japan').click();
      cy.get('#employee_type_input').then(() => {
        cy.get('#employee_type_input').first().click();
        cy.get('.option__container').contains(' オレオウ組合 ').click();
      });
      cy.get('#is_working').click();
      cy.chooseDate('start_date_from');
      if (!cy.get('#is_working').find('input').check()) {
        cy.chooseDate('start_date_to');
      }
      cy.typeTextarea('description', 'bin test cypress');
      cy.clickButton('SaveAndContinue');
      cy.wait(1000)
      cy.request('http://localhost:4200/#/user-experience').then(
        (response) => {
          expect(response.status).to.eq(200);
        }
      );
    }
  });
});
