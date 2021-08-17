describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(1000);
    cy.visit(Cypress.env('host') + Cypress.env('user_experience'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_experience'));
    checkTitleAndPlaceholder();
    checkValidate();
    // insertData();
  });
});

function checkTitleAndPlaceholder() {
  // Check title and placeholder

  cy.label('title', ' TITLE*');
  cy.input('title', 'Developer');

  cy.label('company_working', ' COMPANY*');
  cy.inputValue('company_working', 'AIT');

  cy.label('location', ' LOCATION*');
  cy.input('location', 'Ho Chi Minh City');

  cy.label('employee_type', ' EMPLOYMENT TYPE*');
  cy.input('employee_type', 'Select');

  cy.get('#is_working').should(
    'have.text',
    'I am currently working in this role '
  );

  cy.label('start_date_from', ' START DATE');
  cy.getValueDate('start_date_from', new Date().getTime());
  cy.input('start_date_to', 'yyyy/MM/dd');

  cy.label('description', ' DESCRIPTION');
  cy.textarea('description', 'Place your text');
}

function checkValidate() {
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
    //'company_working_input',
    'location_input',
    'employee_type_input',
    'is_working',
    //'start_date_from_input',
    'start_date_to_input',
    'description_textarea',
  ]);
}

function insertData() {
  // Check save
  cy.chooseMasterData('title', 'Senior System Designer');
  cy.chooseMasterData('location', 'Hue');
  cy.chooseMasterData('employee_type', 'オレオウ組合');

  cy.get('#is_working').click();
  cy.chooseDate('start_date_from');
  if (!cy.get('#is_working').find('input').check()) {
    cy.chooseDate('start_date_to');
  }
  cy.typeTextarea('description', 'bin test cypress');
  // Check if the data is saved or not
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('SaveAndClose');
  cy.wait('@dataSaved').then((req) => {
    console.log(req);
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserExperienceInfo.data[0]._key;

    cy.wait(1000)
    cy.visit(Cypress.env('host') + Cypress.env('user_experience') + '/' + `${_key}`)
  });
}
