describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('diennv', '12345678');
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_experience'));

    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_experience'));
    // checkUIUserExp();
    // resetFormUserExp();
    // checkValidateUserExp();
    // resetFormUserExp();
    // checkDateUserExp();
    insertDataUserExp();
  });
});

// Check title and placeholder
function checkUIUserExp() {
  cy.label('title', ' 題名*');
  cy.input('title', 'デベロッパー');

  cy.label('company_working', ' 会社*');
  cy.input('company_working', 'Aureole IT');

  cy.label('location', ' 位置*');
  cy.input('location', 'ホーチミン市');

  cy.label('employee_type', ' 雇用形態');
  cy.input('employee_type', '開始日');

  cy.get('#is_working').should('have.attr', 'ng-reflect-checked', 'false');
  cy.get('.pcontent').should('have.text', ' 私は現在この役割で働いています ');

  cy.label('start_date_from', ' 開始日');
  cy.getValueDate('start_date_from', new Date().getTime());

  cy.label('description', ' 説明');
  cy.textarea('description', 'テキストを配置します');
}

function checkButtonUserExp() {
  cy.get('cancel_text_button').should('exist');
  cy.get('delete_text_button').should('exist');
  cy.get('reset_text_button').should('exist');
  cy.get('saveAndContinue_text_button').should('exist');
  cy.get('saveAndClose_text_button').should('exist');
}

// Check validate when click save
function checkValidateUserExp() {
  cy.clickButton('saveAndContinue');
  cy.errorMessage('title', '題名 を入力してください。');
  cy.errorMessage('company_working', '会社 を入力してください。');
  cy.errorMessage('location', '位置 を入力してください。');
}

// Check reset Form
function resetFormUserExp() {
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

//check Valid Of Date UserExp
function checkDateUserExp() {
  cy.get('#is_working').click();
  cy.chooseValueDate('start_date_from', '2022', '8', '27');
  cy.clickButton('saveAndClose');
  cy.errorMessage(
    'start-date',
    '現在の日付以下の値で開始日を入力してください。'
  );

  cy.get('#is_working').click();
  cy.chooseValueDate('start_date_from', '2022', '8', '27');
  cy.chooseValueDate('start_date_to', '2022', '8', '1');
  cy.clickButton('saveAndClose');
  cy.errorMessage('start-date', '最終日以下の値で開始日を入力してください。');
}

function insertDataUserExp() {
  // Check save
  cy.chooseMasterData('title', 'Infomation technology');
  cy.chooseMasterData('company_working', 'AIT');
  cy.chooseMasterData('location', 'Hue');
  cy.chooseMasterData('employee_type', 'オレオウ組合');
  cy.get('#is_working').click();
  cy.chooseValueDate('start_date_from', '2021', '8', '1');
  if (!cy.get('#is_working').find('input').check()) {
    cy.chooseValueDate('start_date_to', '2022', '8', '1');
  }
  cy.typeTextarea('description', 'bin test cypress');
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('saveAndClose');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserExperienceInfo.data[0]._key;

    cy.wait(1000);
    cy.visit(Cypress.env('host') + Cypress.env('user_experience') + `${_key}`);
    let query = `
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
              ref_collection: "sys_company"
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
            value
          }
          company_working{
            value
          }
          employee_type{
            value
          }
          location{
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
      console.log(data);
      
      cy.inputValue('title', data.title.value);
      cy.inputValue('company_working', data.company_working.value);
      cy.inputValue('location', data.location.value);
      cy.inputValue('employee_type', data.employee_type.value);
      cy.get('#is_working').should(
        'have.attr',
        'ng-reflect-checked',
        '' + data.is_working
      );
      cy.getValueDate('start_date_from', data.start_date_from);
      // cy.getValueDate('start_date_to', data.start_date_to);
      cy.textareaValue('description', data.description);

      // check disable button Save & Close
      // cy.get('button.button__wrapper__disabled').should('be.disabled');
      // cy.typeTextarea('description', 'a');
      // cy.get('button.button__wrapper').should('not.be.disabled');
      console.log('ok');

      checkDeleteUserExp();
    });
  });
}

// check delete in user_experience
function checkDeleteUserExp() {
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
