describe('Navigate user job alert', () => {
  it('Check Mode New', function () {
    cy.login('lacnt', '12345678');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.visit(Cypress.env('host') + Cypress.env('user_job_alert'));
    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_job_alert'));
    checkUIJobAlert();
    // checkDataComboboxJobAlert();
    // checkValidateJobAlert();
    checkResetJobAlert();
    checkSaveJobAlert();
  });
});

function checkValidateJobAlert() {
  cy.clickButton('saveContinue');
}

function checkResetJobAlert() {
  // Check reset Form
  inputDataJobAlert();
  cy.clickButton('reset');
  cy.resetForm([
    'industry_input',
    'start_date_to_input',
    'experience_level_input',
    'employee_type_input',
    'location_input',
    'salary_from_input_number',
    'salary_to_input_number'
  ]);
}

function checkSaveJobAlert() {
  inputDataJobAlert();
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('saveContinue');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserJobAlert.data[0]._key;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_job_alert') + `${_key}`
    );
    const query = `
        query {
          findUserJobAlert(
            request: {
              collection: "user_job_query"
              condition: {
                _key: "${_key}"
                del_flag: false
                industry: {
                  attribute: "industry"
                  ref_collection: "m_industry"
                  ref_attribute: "code"
                },
                experience_level: {
                  attribute: "experience_level",
                  ref_collection: "sys_master_data",
                  ref_attribute: code
                },
                employee_type: {
                  attribute: "employee_type",
                  ref_collection: "sys_master_data",
                  ref_attribute: code
                },
                location: {
                    attribute: "location",
                    ref_collection: "sys_master_data",
                    ref_attribute: code
                  },
                del_flag: false,
              }
              company: "${Cypress.env('company')}"
              lang: "${Cypress.env('lang')}"
              user_id: "${Cypress.env('user_id')}"
            }
          ) {
            data {
              _key
              user_id
              industry {
                _key
                value
              }
              experience_level {
                _key
                value
              }
              employee_type {
                _key
                value
              }
              location {
                _key
                value
              }
              start_date_from
              start_date_to
              salary_from
              salary_to
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
      const data = response.body.data.findUserJobAlert.data[0];
      cy.getValueMaster('industry', data.industry);
      cy.getValueMaster('experience_level', data.experience_level);
      cy.getValueMaster('employee_type', data.employee_type);
      cy.getValueMaster('location', data.location);
      // cy.getValueDate('start_date_from', data.start_date_from);
      // cy.getValueDate('start_date_to', data.start_date_to);
      cy.getValueNumber('salary_from', data.salary_from);
      cy.getValueNumber('salary_to', data.salary_to);
    });
  });
}

function checkUIJobAlert() {
  cy.label('industry', ' INDUSTRY');
  cy.input('industry', 'Computer Software');
  cy.label('experience_level', ' EXPERIENCE LEVEL');
  cy.input('experience_level', 'Select');
  cy.label('employee_type', ' EMPLOYMENT TYPE');
  cy.input('employee_type', 'Select');
  cy.label('location', ' LOCATION');
  cy.input('location', 'Ho Chi Minh City');
  cy.label('start_date_from', ' AVAILABLE TIME');
  cy.getValueDate('start_date_from', new Date().getTime());
  cy.label('salary_from', ' SALARY');
  cy.get('#salary_from_input_number').should('have.attr', 'placeholder', '1,000');
  cy.get('#salary_to_input_number').should('have.attr', 'placeholder', '5,000');
  cy.checkButton();
}
function checkDataComboboxJobAlert() {
  cy.dataCombobox('EXPERIENCE_LEVEL', 'experience_level');
  cy.get('#salary_from_input_number');
  cy.dataCombobox('ADDRESS', 'location');
}

function inputDataJobAlert() {
  cy.checkMutiple('industry_input', 3, 'salary_to_input_number');
  cy.chooseMasterData('experience_level', "Director US");
  cy.chooseMasterData('employee_type', "Internship");
  cy.checkMutiple('location_input', 2, 'salary_to_input_number');
  cy.chooseDate('start_date_to');
  cy.typeNumber('salary_from', '0');
  cy.typeNumber('salary_to', '999999999999');

}