describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_language'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_language'));
    // checkInitUserLanguage();
    // checkValidateUserLanguage();
    insertDataUserLanguage();
  });

  function checkInitUserLanguage() {
    // Check languague and placeholder

    cy.label('language', ' LANGUAGE*');
    cy.input('language', 'Please select language');

    cy.label('proficiency', ' PROFICIENCY');
    cy.input('proficiency', 'Please select proficiency');

    cy.styleButton('cancel', ' CANCEL ');
    cy.styleButton('reset', ' RESET ');
    cy.styleButton('saveAndContinue', ' SAVE & CONTINUE ');
    cy.styleButton('saveAndClose', ' SAVE & CLOSE ');
  }

  function checkValidateUserLanguage() {

    cy.typeText('language', 'a');
    cy.typeText('proficiency', 'a');
    cy.errorMessage('language', 'LANGUAGE を入力してください。');
  
    // Check validate when click save
    cy.clickButton('saveAndContinue');
  
    // Check reset Form
    cy.clickButton('reset');
    cy.resetForm([
      'language_input',
      'proficiency_input',
    ]);
  }

  function insertDataUserLanguage() {
    // Check save
    cy.chooseMasterData('language', '日');
    cy.chooseMasterData('proficiency', 'N2');
    // Check if the data is saved or not
    cy.intercept({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
    }).as('dataSaved');
    cy.clickButton('saveAndClose');
    cy.wait('@dataSaved').then((req) => {
      //console.log(req);
      cy.status(req.response.statusCode);
      const _key = req.response.body.data.saveUserLanguageInfo.data[0]._key;
  
      cy.wait(1000);
      cy.visit(
        Cypress.env('host') + Cypress.env('user_language') + '/' + `${_key}`
      );
      let query = `
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
        
        cy.inputValue('language', data.language.value);
        cy.inputValue('proficiency', data.proficiency.value);
        
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
});
