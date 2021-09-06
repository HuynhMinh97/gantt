describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_onboarding'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_onboarding'));
    checkInitUserOnboarding();
    // checkValidateUserOnboarding();
    // checkValidOfDateUserOnboarding();
    // insertDataUserOnboarding();
  });
});

function checkInitUserOnboarding() {
  // Check school and placeholder

  cy.label('first_name', ' FIRST NAME*');
  cy.input('first_name', 'Please input your first name');

  cy.label('last_name', ' LAST NAME*');
  cy.input('last_name', 'Please input your last name');

  cy.label('katakana', ' KATAKANA*');
  cy.input('katakana', 'Please input your fullname (katakana)');

  cy.label('romaji', ' ROMAJI*');
  cy.input('romaji', 'Please input your fullname (romaji)');

  cy.label('gender', ' GENDER');

  cy.label('bod', ' BORN ON DATE*');
  cy.input('bod', 'yyyy/MM/dd');

  cy.label('phone_number', ' PHONE NUMBER*');
  cy.input('phone_number', 'Please input phone number');

  cy.label('about', ' ABOUT');
  cy.textarea('about', 'Please input about');

  cy.label('country', ' COUNTRY*');
  cy.input('country', 'Please select country');

  cy.label('postcode', ' POSTCODE*');
  cy.input('postcode', 'Please input postcode');

  cy.label('city', ' PROVINE/CITY*');
  cy.input('city', 'Please select city');

  cy.label('district', ' DISTRICT*');
  cy.input('district', 'Please select district');

  cy.label('ward', ' WARD*');
  cy.input('ward', 'Please select ward');

  cy.label('address', ' ADDRESS*');
  cy.input('address', 'Please input address');

  cy.label('skills', ' SKILLS (MAX 10)*');
  cy.input('skills', 'Please select skill');

  cy.label('title', ' TITLE');
  cy.input('title', 'Please select title');

  cy.label('company_working', ' COMPANY WORKING');
  cy.input('company_working', 'Please select company');

  cy.label('industry', ' INDUSTRY*');
  cy.input('industry', 'Please select industry');

  cy.label('floor_building', ' FLOOR/BUILDING');
  cy.input('floor_building', 'Please input floor/building');


  cy.styleButton('cancel', ' CANCEL ');
  cy.styleButton('reset', ' RESET ');
  cy.styleButton('save', ' SAVE ');
}

function checkButtonUserOnboarding() {
  cy.get('cancel_text_button').should('exist');
  cy.get('delete_text_button').should('exist');
  cy.get('reset_text_button').should('exist');
  cy.get('saveAndContinue_text_button').should('exist');
  cy.get('saveAndClose_text_button').should('exist');
}

function checkValidateUserOnboarding() {
  cy.typeText('school', 'a');
  cy.typeText('degree', 'a');
  cy.errorMessage('school', ' SCHOOL を入力してください。');

  // Check validate when click save
  cy.clickButton('saveAndContinue');

  cy.errorMessage('school', ' SCHOOL を入力してください。');
  cy.errorMessage(
    'start-date',
    ' start_date_to 以下の値で start_date_from を入力してください。'
  );

  // Check reset Form
  cy.clickButton('reset');
  cy.resetForm([
    'school_input',
    'degree_input',
    'field_of_study_input',
    'grade_input',
    'file_input_file',
    'start_date_to_input',
    'description_textarea',
  ]);
}

function checkValidOfDateUserOnboarding() {
  // default (case: wrong)
  cy.clickButton('saveAndClose');
  cy.errorMessage(
    'start-date',
    ' start_date_to 以下の値で start_date_from を入力してください。'
  );

  // choose start_date_from > start_date_to (case: wrong)
  cy.chooseValueDate('start_date_from', '2021', '8', '27');
  cy.chooseValueDate('start_date_to', '2021', '8', '1');
  cy.clickButton('saveAndClose');
  cy.errorMessage(
    'start-date',
    ' start_date_to 以下の値で start_date_from を入力してください。'
  );

  // choose start_date_to < current date (case: right)
  cy.chooseValueDate('start_date_from', '2021', '8', '13');
  cy.chooseValueDate('start_date_to', '2021', '9', '19');
  cy.clickButton('saveAndClose');
  // cy.clickButton('reset');
}

function insertDataUserOnboarding() {
  // Check save
  cy.chooseMasterData('school', 'University of Science');
  cy.typeText('field_of_study', 'IT');
  cy.typeText('grade', 'Credit');

  cy.typeText('degree', 'Bachelor');
  cy.chooseValueDate('start_date_to', '2021', '9', '12');
  cy.typeTextarea('description', 'bin test cypress');

  cy.chooseFile('file_input_file', 'anh.jpg');
  cy.wait(1000);
  cy.chooseFile('file_input_file', 'test.docx');
  cy.wait(1000);
  cy.chooseFile('file_input_file', 'AIT-Starter-Component.xlsx');
  cy.wait(1000);
  // Check if the data is saved or not
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('saveAndClose');
  cy.wait('@dataSaved').then((req) => {
    //console.log(req);
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserOnboardingInfo.data[0]._key;

    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_Onboarding') + '/' + `${_key}`
    );
    let query = `
    query {
      findUserOnboardingInfo(
        request: {
          collection: "user_Onboarding"
          condition: {
            _key: "${_key}"
            school: {
              attribute: "school"
              ref_collection: "m_school"
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
          school{
            value
          }
          degree
          grade
          field_of_study
          start_date_from
          start_date_to
          description
          file
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
      const data = response.body.data.findUserOnboardingInfo.data[0];

      cy.inputValue('school', data.school.value);
      cy.inputValue('degree', data.degree);
      cy.inputValue('field_of_study', data.field_of_study);
      cy.inputValue('grade', data.grade);
      const dateFrom = new Date(data.start_date_from)
        .toLocaleDateString('ja-JP')
        .split('/')
        .map((e) => (e.length === 1 ? '0' + e : e))
        .join('/')
        .substring(0, 7);
      const dateTo = new Date(data.start_date_to)
        .toLocaleDateString('ja-JP')
        .split('/')
        .map((e) => (e.length === 1 ? '0' + e : e))
        .join('/')
        .substring(0, 7);
      cy.get('#start_date_from_input').should('have.value', dateFrom);
      cy.get('#start_date_to_input').should('have.value', dateTo);
      cy.textareaValue('description', data.description);

      // cy.getCountFile('file', data.file);

      // check disable button Save & Close
      // cy.get('button.button__wrapper__disabled').should('be.disabled')
      // cy.typeTextarea('description', 'a');
      // cy.get('button.button__wrapper').should('not.be.disabled')

      // check button Delete
      cy.intercept({
        method: 'POST',
        url: Cypress.env('host') + Cypress.env('api_url'),
      }).as('Deleted');
      cy.clickButton('delete');
      //cy.get('#cancel_text_button').click({ force: true });
      cy.clickButton('ok');
      cy.wait('@Deleted').then((req) => {
        cy.status(req.response.statusCode);
      });
    });
  });
}
