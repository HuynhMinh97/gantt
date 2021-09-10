describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_education'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_education'));
    // checkUIUserEdu();
    // resetFormUserEdu()
    // checkValidUserEdu();

    dataProcessingUserEdu();
  });
});

// Check title and placeholder
function checkUIUserEdu() {
  cy.label('school', ' 学校*');
  cy.input('school', 'BACK KHOA HCM テクノロジー大学');

  cy.label('degree', ' 程度');
  cy.input('degree', '例：エンジニア');

  cy.label('field_of_study', ' 研究分野');
  cy.input('field_of_study', '例：コンピューター');

  cy.label('grade', ' 学年');
  cy.input('grade', '良い');

  cy.label('start_date_from', ' 開始日');
  const date = new Date()
    .toLocaleDateString('ja-JP')
    .split('/')
    .map((e) => (e.length === 1 ? '0' + e : e))
    .join('/')
    .substring(0, 7);
  cy.get('#start_date_from_input').should('have.value', date);
  cy.input('start_date_to', 'yyyy/MM');

  cy.label('description', ' 説明');
  cy.textarea('description', 'テキストを配置します');

  cy.get('#file_input_file').should('have.value', '');
}

// check button
function checkButtonUserEdu() {
  cy.get('cancel_text_button').should('exist');
  // cy.get('delete_text_button').should('exist');
  cy.get('reset_text_button').should('exist');
  cy.get('saveAndContinue_text_button').should('exist');
  cy.get('saveAndClose_text_button').should('exist');
}

// Check reset Form
function resetFormUserEdu() {
  cy.clickButton('reset');
  cy.resetForm([
    'school_input',
    'degree_input',
    'field_of_study_input',
    'grade_input',
    'file_input_file',
    'start_date_to_input',
    'description_textarea',
    'file_input_file',
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
function dataProcessingUserEdu() {
  cy.chooseMasterData('school', 'Đại học khoa học Huế');
  cy.typeText('field_of_study', 'IT');
  cy.typeText('grade', 'Credit');
  cy.typeText('degree', 'Bachelor');
  cy.chooseValueDate('start_date_to', '2021', '9', '12');
  cy.typeTextarea('description', 'bin test cypress');
  cy.chooseFile('file_input_file', 'anh.jpg');
  cy.wait(500);
  cy.chooseFile('file_input_file', 'test.docx');
  cy.wait(500);
  cy.chooseFile('file_input_file', 'AIT-Starter-Component.xlsx');
  cy.wait(500);

  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('saveAndClose');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserEducationInfo.data[0]._key;

    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_education') + `${_key}`
    );
    let query = `
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
      cy.get('button.button__wrapper__disabled').should('be.disabled');
      cy.typeTextarea('description', 'a');
      cy.get('button.button__wrapper').should('not.be.disabled');

      checkDeleteUserEdu();
    });
  });
}

// check delete in user_education
function checkDeleteUserEdu() {
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('Deleted');
  cy.clickButton('delete');
  cy.clickButton('ok');
  cy.wait('@Deleted').then((req) => {
    cy.status(req.response.statusCode);
  });
}
