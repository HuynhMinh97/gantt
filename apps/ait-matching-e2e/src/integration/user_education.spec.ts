describe('Navigate user experience', () => {
  it('Check Mode New', function () {
    cy.login('lacnt', '12345678');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_education'));
    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_education'));
    checkUIUserEdu();
    resetFormUserEdu();
    // checkValidUserEdu();
    checkSaveDataEdu();
  });
});

// Check title and placeholder
function checkUIUserEdu() {
  cy.label('school', ' SCHOOL*');
  cy.input('school', 'BACH KHOA Ho Chi Minh Technology University');
  cy.label('degree', ' DEGREE');
  cy.input('degree', "Ex: Engineer's");
  cy.label('field_of_study', ' FIELD OF STUDY');
  cy.input('field_of_study', 'Ex: Computer');
  cy.label('grade', ' GRADE');
  cy.input('grade', 'Good');
  cy.label('start_date_from', ' START DATE');
  cy.label('description', ' DESCRIPTION');
  cy.textarea('description', 'Place your text');

}

// Check reset Form
function resetFormUserEdu() {
  inputDataEdu();
  cy.clickButton('reset');
  cy.resetForm([
    'school_input',
    'degree_input',
    'field_of_study_input',
    'grade_input',
    'start_date_to_input',
    'description_textarea'
  ]);
}

// check message error required and date of user_education
function checkValidUserEdu() {
  cy.clickButton('saveAndContinue');
  cy.errorMessage('school', '学校 を入力してください。');

  cy.chooseValueDate('start_date_from', '2021', '8', '27');
  cy.chooseValueDate('start_date_to', '2020', '8', '1');
  cy.clickButton('saveAndClose');
  cy.errorMessage('start-date', '最終日以下の値で開始日を入力してください。');
}

// Check save and delete in user_education
function checkSaveDataEdu() {
  inputDataEdu();
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('saveAndContinue');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserEducationInfo.data[0]._key;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_education') + `${_key}`
    );
    const query = `
    query {
      findUserEducationInfo(
        request: {
          collection: "user_education"
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
            _key
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
      const data = response.body.data.findUserEducationInfo.data[0];
      cy.getValueMaster('school', data.school);
      cy.getValueInput('degree', data.degree);
      cy.getValueInput('field_of_study', data.field_of_study);
      cy.getValueInput('grade', data.grade);
      cy.textareaValue('description', data.description);
    });
  });
}

function inputDataEdu() {
  cy.chooseMasterData('school', 'Bach Khoa');
  cy.typeText('field_of_study', 'IT');
  cy.typeText('grade', 'Good');
  cy.typeText('degree', 'Bachelor');
  cy.chooseDate('start_date_to');
  cy.typeTextarea('description', 'test cypress');
  cy.chooseFile('file_input_file', 'anh.jpg');
}
