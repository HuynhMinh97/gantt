describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_education'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_education'));
    //checkInitUserEducation();
    //checkValidateUserEducation();
    //checkValidOfDateUserEducation();
    insertDataUserEducation();
  });
});

function checkInitUserEducation() {
  // Check school and placeholder

  cy.label('school', ' SCHOOL*');
  cy.input('school', 'BACK KHOA HCM Technology University');

  cy.label('degree', ' DEGREE');
  cy.input('degree', 'Ex: Engineer`s');

  cy.label('field_of_study', ' FIELD OF STUDY');
  cy.input('field_of_study', 'Ex: Computer');

  cy.label('grade', ' GRADE');
  cy.input('grade', 'Good');

  cy.label('start_date_from', ' START DATE');
  const date =  new Date().toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/').substring(0,7);
  cy.get('#start_date_from_input').should('have.value', date);
  cy.input('start_date_to', 'yyyy/MM');

  cy.label('description', ' DESCRIPTION');
  cy.textarea('description', 'Place your text');

  cy.get('#file_input_file').should('have.value', '');

  cy.styleButton('cancel', ' CANCEL ');
  cy.styleButton('reset', ' RESET ');
  cy.styleButton('saveAndContinue', ' SAVE & CONTINUE ');
  cy.styleButton('saveAndClose', ' SAVE & CLOSE ');
}

function checkButtonUserEducation(){
  cy.get('cancel_text_button').should('exist');
  cy.get('delete_text_button').should('exist');
  cy.get('reset_text_button').should('exist');
  cy.get('saveAndContinue_text_button').should('exist');
  cy.get('saveAndClose_text_button').should('exist');
}

function checkValidateUserEducation() {

  cy.typeText('school', 'a');
  cy.typeText('degree', 'a');
  cy.errorMessage('school', 'SCHOOL を入力してください。');

  // Check validate when click save
  cy.clickButton('saveAndContinue');

  cy.errorMessage('school', 'SCHOOL を入力してください。');
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

function checkValidOfDateUserEducation() {
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

function insertDataUserEducation() {
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
    const _key = req.response.body.data.saveUserEducationInfo.data[0]._key;

    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_education') + '/' + `${_key}`
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
      const dateFrom = new Date(data.start_date_from).toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/').substring(0,7);
      const dateTo = new Date(data.start_date_to).toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/').substring(0,7);
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
