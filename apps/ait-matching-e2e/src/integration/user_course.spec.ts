import 'cypress-file-upload';
describe('Navigate user course', () => {
  it('Check Mode New', function () {
    cy.login('lacnt', '12345678');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.visit(Cypress.env('host') + Cypress.env('user_course'));
    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_course'));
    checkUICourse();
    // checkValidateCourse();
    checkResetCourse();
    checkSaveCourse();

  });
});

function checkUICourse() {
  // Check title and placeholder
  cy.label('name', ' NAME*');
  cy.input('name', 'EX: Project Management');
  cy.get('#is_online').should(
    'have.text',
    'Online?'
  );

  cy.label('training_center', ' CENTER');
  cy.input('training_center', 'BACH KHOA Ho Chi Minh Technology University');
  cy.label('course_number', ' CERTIFICATE');
  cy.textarea('course_number', 'EX: AIT001');
  cy.label('start_date_from', ' START DATE');
  cy.getValueDate('start_date_from', new Date().getTime());
  cy.label('description', ' DESCRIPTION');
  cy.textarea('description', 'Place your text');
}

function checkValidateCourse() {
  // Check validate when click save
  cy.chooseValueDate('start_date_to', '2021', '8', '13');
  cy.clickButton('saveContinue');
  cy.errorMessage('name', 'NAME required.');
  cy.errorMessage(
    'messagError',
    'Enter START DATE with a value less than or equal to START DATE TO.'
  );
}

function checkResetCourse() {
  addDataCourse();
  // Check reset Form
  cy.clickButton('reset');
  cy.resetForm([
    'name_input',
    'is_online',
    'training_center_input',
    'course_number_input',
    'start_date_to_input',
    'description_textarea'
  ]);
}

function addDataCourse() {
  cy.typeText("name", "Lập trình viên");
  cy.get('#is_online').click();
  cy.chooseMasterData('training_center', "bách khoa");
  cy.typeText("course_number", "A123");
  cy.chooseDate('start_date_to');
  cy.typeTextarea("description", "TEST");
  cy.chooseFile('file_input_file', "test.docx");

}

function checkSaveCourse() {
  addDataCourse();
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('saveContinue');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveCourse.data[0]._key;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_course') + `${_key}`
    );
    const query = `
        query {
          findCourse(
            request: {
              collection: "user_course"
              condition: {
                training_center: {
                  attribute: "training_center",
                  ref_collection: "m_training_center",
                  ref_attribute: code
                },
                _key: "${_key}"
                del_flag: false
              }
              company: "${Cypress.env('company')}"
              lang: "${Cypress.env('lang')}"
              user_id: "${Cypress.env('user_id')}"
            }
          ) {
            data {
              _key
              name
              is_online
              training_center{
                _key
                value
              }
              course_number
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
      const data = response.body.data.findCourse.data[0];
      cy.getValueInput('name', data.name);
      cy.getValueMaster('training_center', data.training_center);
      cy.textareaValue('description', data.description);
      cy.getValueInput('course_number', data.course_number);
      // cy.getValueDate('start_date_from', data.start_date_from);
      // cy.getValueDate('start_date_to', data.start_date_to);
    });
  });
}

