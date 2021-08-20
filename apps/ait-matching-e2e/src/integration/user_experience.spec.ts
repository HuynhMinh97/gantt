describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_experience'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_experience'));
    checkTitleAndPlaceholder();
    // checkValidate();
    // checkValidOfDate();
    //insertData();
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

  cy.get('#is_working').should('have.attr', 'ng-reflect-checked', 'false');
  cy.get('#is_working').should(
    'have.text',
    'I am currently working in this role '
  );

  cy.label('start_date_from', ' START DATE');
  cy.getValueDate('start_date_from', new Date().getTime());
  cy.input('start_date_to', 'yyyy/MM/dd');

  cy.label('description', ' DESCRIPTION');
  cy.textarea('description', 'Place your text');

  cy.styleButton('cancel', ' CANCEL ');
  cy.styleButton('reset', ' RESET ');
  cy.styleButton('saveAndContinue', ' SAVE & CONTINUE ');
  cy.styleButton('saveAndClose', ' SAVE & CLOSE ');
}

function checkAllButton(){
  cy.get('cancel_text_button').should('exist');
  cy.get('delete_text_button').should('exist');
  cy.get('reset_text_button').should('exist');
  cy.get('saveAndContinue_text_button').should('exist');
  cy.get('saveAndClose_text_button').should('exist');
}

function checkValidate() {
  // Check validate when click save
  cy.clickButton('saveAndContinue');

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

function checkValidOfDate() {
  // default (case: wrong)
  cy.clickButton('saveAndClose');
  cy.errorMessage(
    'start-date',
    ' start_date_to 以下の値で start_date_from を入力してください。'
  );

  // choose start_date_from > current date (case: wrong)
  cy.get('#is_working').click();
  cy.chooseValueDate('start_date_from', '2021', '8', '27');
  cy.clickButton('saveAndClose');
  cy.errorMessage(
    'start-date',
    ' now_date 以下の値で start_date_from を入力してください。'
  );

  // choose start_date_from > start_date_to (case: wrong)
  cy.get('#is_working').click();
  cy.chooseValueDate('start_date_from', '2021', '8', '27');
  cy.chooseValueDate('start_date_to', '2021', '8', '1');
  cy.clickButton('saveAndClose');
  cy.errorMessage(
    'start-date',
    ' start_date_to 以下の値で start_date_from を入力してください。'
  );

  // choose start_date_to < current date (case: right)
  cy.chooseValueDate('start_date_from', '2021', '8', '13');
  cy.chooseValueDate('start_date_to', '2021', '8', '19');
  cy.clickButton('saveAndClose');
  // cy.clickButton('reset');
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
  cy.clickButton('saveAndClose');
  cy.wait('@dataSaved').then((req) => {
    //console.log(req);
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserExperienceInfo.data[0]._key;

    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_experience') + '/' + `${_key}`
    );
    let query = `
    query {
      findUserExperienceInfo(
        request: {
          collection: "user_experience"
          condition: {
            _key: "${_key}"
            location: {
              attribute: "location"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
            employee_type: {
              attribute: "employee_type"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
            title: {
              attribute: "title"
              ref_collection: "m_title"
              ref_attribute: "code"
            }
            company_working: {
              attribute: "company_working"
              ref_collection: "sys_company"
              ref_attribute: "code"
            }
          }
          company: "${Cypress.env('company')}"
          lang: "${Cypress.env('lang')}"
          user_id: "${Cypress.env('user_id')}"
        }
      ) {
        data {
          _key
          title{
            value
          }
          company_working{
            value
          }
          employee_type{
            value
          }
          location{
            value
          }
          is_working
          start_date_from
          start_date_to
          description
        }
        message
        errors
        status
        numData
        numError
      }
    }
    `;

    cy.request({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
      body: { query },
      failOnStatusCode: false,
    }).then((response) => {
      const data = response.body.data.findUserExperienceInfo.data[0];
      cy.inputValue('title', data.title.value);
      cy.inputValue('company_working', data.company_working.value);
      cy.inputValue('location', data.location.value);
      cy.inputValue('employee_type', data.employee_type.value);
      cy.get('#is_working').should(
        'have.attr',
        'ng-reflect-checked',
        '' + data.is_working
      );
      cy.getValueDate('start_date_from', data.start_date_from);
      cy.getValueDate('start_date_to', data.start_date_to);
      cy.textareaValue('description', data.description);

      // check disable button Save & Close
      cy.get('button.button__wrapper__disabled').should('be.disabled')
      cy.typeTextarea('description', 'a');
      cy.get('button.button__wrapper').should('not.be.disabled')

      // check button Delete
      // cy.intercept({
      //   method: 'POST',
      //   url: Cypress.env('host') + Cypress.env('api_url'),
      // }).as('Deleted');
      // cy.clickButton('delete');
      // //cy.get('#cancel_text_button').click({ force: true });
      // cy.clickButton('ok');
      // cy.wait('@Deleted').then((req) => {
      //   cy.status(req.response.statusCode);
      // });
    });
  });
}
