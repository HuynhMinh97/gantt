import 'cypress-file-upload';
export class UserCertificate {

  static inputDataCer() {
    cy.chooseMasterData("name", "BANG DAI HOC US");
    cy.typeText("certificate_award_number", "123");
    cy.typeTextarea('grade', "90/120");
    cy.chooseMasterData("issue_by", "bách khoa US");
    cy.chooseDate('issue_date_to');
    cy.typeTextarea("description", "test OK");
    cy.chooseFile('file_input_file', "anh.jpg");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
  }

  static checkResetCertificate() {
    this.inputDataCer();
    // Check reset Form
    cy.clickButton('reset');
    cy.resetForm([
      'name_input',
      'certificate_award_number_input',
      'grade_textarea',
      'issue_by_input',
      'issue_date_to_input',
      'description_textarea',
    ]);
  }

  static checkUICertificate() {
    cy.label('name', ' NAME*');
    cy.input('name', 'Japanese N1');
    cy.label('certificate_award_number', ' CERTIFICATE NUMBER');
    cy.input('certificate_award_number', 'Ex: AIT001');
    cy.label('issue_by', ' ISSUE BY');
    cy.input('issue_by', 'BACH KHOA Ho Chi Minh Technology University');
    cy.label('grade', ' GRADE');
    cy.textarea('grade', '90/120');
    cy.label('issue_date_from', ' ISSUE DATE')
    // cy.getValueDate('issue_date_from', new Date().getTime());
    cy.label('description', ' DESCRIPTION')
    cy.textarea('description', 'Place your text');
    cy.get('#file_input_file').should('have.value', '');
  }

  static checkValidateCertificate() {
    cy.clickButton('saveContinue');
    cy.errorMessage('name', 'NAME required.');
    cy.chooseValueDate('issue_date_to', '2021', '8', '13');
    cy.errorMessage(
      'errorDate',
      'Enter START DATE with a value less than or equal to START DATE TO.'
    );
  }
  static checkSaveCertificate() {
    this.inputDataCer();
    cy.intercept({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
    }).as('dataSaveda');
    cy.clickButton('saveClose');
    cy.wait('@dataSaveda').then((req) => {
      cy.status(req.response.statusCode);
    })
  }
  static findUsercertificate(_key: string) {
    const query = `
  query {
    findUsercertificate(
      request: {
        collection: "user_certificate_award"
        condition: {
          _key: "${_key}"
          del_flag: false,
          name: {
            attribute: "name"
            ref_collection: "m_certificate_award"
            ref_attribute: "code"
          }
          issue_by: {
            attribute: "issue_by"
            ref_collection: "m_training_center"
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
        name {
          _key
          value
        }
        certificate_award_number
        grade
        issue_by {
          _key
          value
        }
        issue_date_from
        issue_date_to
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
      const data = response.body.data.findUsercertificate.data[0];
      cy.getValueMaster('name', data.name);
      cy.inputValue('certificate_award_number', data.certificate_award_number);
      cy.textareaValue('grade', data.grade);
      cy.getValueMaster('issue_by', data.issue_by);
      cy.textareaValue("description", data.description);
      // cy.getValueDate('issue_date_from', data.issue_date_from);
      // cy.getValueDate('issue_date_to', data.issue_date_to);
    });
  }
}


