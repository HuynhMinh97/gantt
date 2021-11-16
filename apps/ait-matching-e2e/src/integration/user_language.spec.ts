export class UserLanguage {

  // Check title and placeholder
  static checkUILanguage() {
    cy.get('#form_edit_user_language_text__gradient').should('have.text', ' Add language\n');
    cy.label('language', ' LANGUAGE*');
    cy.input('language', 'Japanese');
    cy.label('proficiency', ' PROFICIENCY');
    cy.input('proficiency', 'Select');
  }
  static checkDataCombobox() {
    cy.dataCombobox('LANGUAGE', 'language');
    cy.clickButton('saveAndContinue');
    cy.dataCombobox('LANGUAGE_PROFICIENCY', 'proficiency');

  }
  // check validate
  static checkValidateLanguage() {
    cy.clickButton('saveAndContinue');
    cy.errorMessage('language', '言語 を入力してください。');
  }

  //check reset
  static resetFormLanguage() {
    this.inputDataLanguage();
    cy.clickButton('reset');
    cy.resetForm(['language_input', 'proficiency_input']);
  }

  static inputDataLanguage() {
    cy.chooseMasterData('language', 'English');
    cy.chooseMasterData('proficiency', 'Full professional proficiency US');
  }

  // Check save and delete
  static saveDataLanguage() {
    this.inputDataLanguage();
    cy.intercept({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
    }).as('dataSaved');
    cy.clickButton('saveAndClose');
    cy.wait('@dataSaved').then((req) => {
      cy.status(req.response.statusCode);
    })
  }

  static findUserLanguage(_key: string) {
    const query = `
  query {
    findUserLanguageInfo(
      request: {
        collection: "user_language"
        condition: {
          _key: "${_key}"
          language: {
            attribute: "language"
            ref_collection: "sys_master_data"
            ref_attribute: "code"
          }
          proficiency: {
            attribute: "proficiency"
            ref_collection: "sys_master_data"
            ref_attribute: "code"
          }
          del_flag: false
        }
        company: "${Cypress.env('company')}"
        lang: "${Cypress.env('lang')}"
        user_id: "${Cypress.env('user_id')}"
      }
    ) {
      data {
        _key
        language{
          value
        }
        proficiency{
          value
        }
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
      const data = response.body.data.findUserLanguageInfo.data[0];
      cy.getValueMaster('language', data.language);
      cy.getValueMaster('proficiency', data.proficiency);
    })
  }
}