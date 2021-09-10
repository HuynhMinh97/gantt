describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_language'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_language'));
    // checkInitUserLanguage();
    // resetFormUserLang();
    // checkValidateUserLanguage();
    // resetFormUserLang();
    insertDataUserLanguage();
  });
});

  // Check title and placeholder
  function checkInitUserLanguage() {
    cy.label('language', ' 言語*');
    cy.input('language', '日本');

    cy.label('proficiency', ' 習熟度');
    cy.input('proficiency', '選択する');

    cy.styleButton('cancel', ' キャンセル ');
    cy.styleButton('reset', ' リセット ');
    cy.styleButton('saveAndContinue', ' 保存して続行 ');
    cy.styleButton('saveAndClose', ' 保存して閉じます ');
  }

  // check validate
  function checkValidateUserLanguage() {
    cy.clickButton('saveAndContinue');
    cy.errorMessage('language', '言語 を入力してください。');
  }

  //check reset
  function resetFormUserLang() {
    cy.clickButton('reset');
    cy.resetForm(['language_input', 'proficiency_input']);
  }

  // Check save and delete
  function insertDataUserLanguage() {
    cy.chooseMasterData('language', '日');
    cy.chooseMasterData('proficiency', 'N2');
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
      cy.visit(Cypress.env('host') + Cypress.env('user_language') + `${_key}`);
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

        checkDeleteUserLang();
      });
    });
  }

// check delete in user_experience
function checkDeleteUserLang() {
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
