export class UserExperience {
  // Check title and placeholder
  static checkUIUserExp() {
    const query = `{
    findUserOnboardingInfo(
      request: {
        collection: "user_profile"
        condition: {
          company_working: {
          attribute: "company_working",
          ref_collection: "m_company",
          ref_attribute: "code"
        },
        user_id: "${Cypress.env('user_id')}"
        del_flag: false,
      },
        company: "${Cypress.env('company')}"
        lang: "${Cypress.env('lang')}"
        user_id: "${Cypress.env('user_id')}"
      }
    ) {
      data {
        company_working { 
          _key
          value
        }
      }
      message
      errors
      status
      numData
      numError
    }
  }`;
    cy.request({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
      body: { query },
      failOnStatusCode: false,

    }).then((response) => {
      const data = response.body.data.findUserOnboardingInfo.data[0];
      cy.getValueMaster('company_working', data.company_working);

    })
    cy.label('title', ' TITLE*');
    cy.input('title', 'Developer');
    cy.label('company_working', ' COMPANY*');
    cy.label('location', ' LOCATION*');
    cy.input('location', 'Ho Chi Minh City');
    cy.label('employee_type', ' EMPLOYEE TYPE');
    cy.input('employee_type', 'Select');
    // cy.get('#is_working').should('have.attr', 'ng-reflect-checked', 'false');
    cy.get('.pcontent').should('have.text', ' I am currently working in this role ');
    cy.label('start_date_from', ' START DATE');
    cy.label('description', ' DESCRIPTION');
    cy.textarea('description', 'Place your text');
  }
  static checkDataComboboxExp() {
    cy.dataCombobox('CITY', 'location');
    cy.get('#description_textarea').click();
    cy.dataCombobox('EMPLOYEE_TYPE', 'employee_type');

  }
  // Check validate when click save
  static checkValidateUserExp() {
    cy.clickButton('saveAndContinue');
    cy.errorMessage('title', 'TITLE required.');
    cy.errorMessage('location', 'LOCATION required.');
  }

  // Check reset Form
  static resetFormUserExp() {
    this.inputDataExper();
    cy.clickButton('reset');
    cy.resetForm([
      'title_input',
      'location_input',
      'employee_type_input',
      'is_working',
      'start_date_to_input',
      'description_textarea',
    ]);
  }

  static inputDataExper() {
    cy.chooseMasterData('title', 'Developer');
    cy.chooseMasterData('location', 'Hue');
    cy.get('#description_textarea').click();
    cy.chooseMasterData('employee_type', 'Parttime');
    cy.chooseDate('start_date_to');
    cy.typeTextarea('description', 'TEST Cypress');
  }

  static checkSaveExper() {
    this.inputDataExper();
    cy.intercept({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
    }).as('dataSaved');
    cy.clickButton('saveAndClose');
    cy.wait('@dataSaved').then((req) => {
      cy.status(req.response.statusCode);
    })
  }

  static findUserExperienceInfo(_key: string) {
    const query = `
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
              ref_collection: "m_company"
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
            _key
            value
          }
          company_working{
            _key
            value
          }
          employee_type{
            _key
            value
          }
          location{
            _key
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
      cy.getValueMaster('title', data.title);
      cy.getValueMaster('company_working', data.company_working);
      cy.getValueMaster('location', data.location);
      cy.getValueMaster('employee_type', data.employee_type);
      // cy.get('#is_working').should(
      //   'have.attr',
      //   'ng-reflect-checked',
      //   '' + data.is_working
      // );
      // cy.getValueDate('start_date_from', data.start_date_from);
      cy.textareaValue('description', data.description);

    });

  }
}

