
export function checkValidateProject() {
  // Check validate when click save
  cy.chooseValueDate('start_date_to', '2021', '8', '13');
  cy.errorMessage(
    'messagError',
    'start_date_to以下の値でstart_date_fromを入力してください。'
  );
  cy.chooseValueDate('start_date_to', '2021', '9', '13');
  cy.clickButton('saveContinue');
  cy.errorMessage('name', 'NAME を入力してください。');
  cy.errorMessage('description', 'DESCRIPTION を入力してください。');
  cy.errorMessage('skills', 'SKILLS (MAX 10) を入力してください。');
  cy.errorMessage('responsibility', 'RESPONSIBILITY を入力してください。');
  cy.errorMessage('achievement', 'ACHIEVEMENT を入力してください。');
  // cy.clickButton('reset');
}

export function checkResetProject() {
  // Check reset Form
  inputDataProject();
  cy.clickButton('reset');
  cy.resetForm([
    'name_input',
    'start_date_to_input',
    'description_textarea',
    'skills_input',
    'responsibility_textarea',
    'achievement_textarea',
  ]);
}

export function checkSaveProject() {
  inputDataProject();
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');

  cy.clickButton('saveClose');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
  })
  //   const _key = req.response.body.data.saveUserProject.data[0]._key;
  //   // eslint-disable-next-line cypress/no-unnecessary-waiting
  //   cy.wait(1000);
  //   cy.visit(
  //     Cypress.env('host') + Cypress.env('user_project') + `${_key}`
  //   );
  //   const query = `
  //     query {
  //       findUserProject(
  //         request: {
  //           collection: "biz_project"
  //           condition: {
  //             _key: "${_key}"
  //             del_flag: false
  //             skills: {
  //               attribute: "skills"
  //               ref_collection: "m_skill"
  //               ref_attribute: "_key"
  //               get_by: "_key"
  //             },
  //             company_working: {
  //               attribute: "company_working",
  //               ref_collection: "sys_company",
  //               ref_attribute: code
  //             },
  //             title: {
  //               attribute: "title",
  //               ref_collection: "m_title",
  //               ref_attribute: code
  //             },
  //             del_flag: false,
  //           }
  //           company: "${Cypress.env('company')}"
  //           lang: "${Cypress.env('lang')}"
  //           user_id: "${Cypress.env('user_id')}"
  //         }
  //       ) {
  //         data {
  //           _key
  //           user_id
  //           company
  //           name
  //           start_date_from
  //           start_date_to
  //           company_working {
  //             _key
  //             value
  //           }
  //           title {
  //             _key
  //             value
  //           }
  //           description
  //           responsibility
  //           achievement
  //           skills {
  //             _key
  //             value
  //           }
  //         }
  //         message
  //         errors
  //         status
  //         numData
  //         numError
  //       }
  //     }
  //       `;

  //   cy.request({
  //     method: 'POST',
  //     url: Cypress.env('host') + Cypress.env('api_url'),
  //     body: { query },
  //     failOnStatusCode: false,

  //   }).then((response) => {
  //     const data = response.body.data.findUserProject.data[0];
  //     cy.inputValue('name', data.name);
  //     cy.textareaValue('description', data.description);
  //     cy.textareaValue("responsibility", data.responsibility);
  //     cy.textareaValue("achievement", data.achievement);
  //     cy.getValueMaster('company_working', data.company_working);
  //     cy.getValueMaster('title', data.title);
  //   });
  // });
}

export function checkUIProject() {
  // Check title and placeholder
  const query = `{
          findKey(
            request: {
              collection: "user_profile"
              condition: {
                company_working: {
                attribute: "company_working",
                ref_collection: "m_company",
                ref_attribute: "code"
              },
              title: {
                attribute: "title",
                ref_collection: "m_title",
                ref_attribute: "code"
              }
                user_id: "${Cypress.env('user_id')}"
                del_flag: false
              }
              company: "${Cypress.env('company')}"
              lang: "${Cypress.env('lang')}"
              user_id: "${Cypress.env('user_id')}"
            }
          ) {
            data {
              title { 
                _key
                value
              }
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
    const data = response.body.data.findKey.data[0];
    cy.getValueMaster('company_working', data.company_working);
    cy.getValueMaster('title', data.title);

  })

  cy.label('name', ' NAME*');
  cy.input('name', 'Please input project name');
  cy.label('start_date_from', ' START DATE*');
  cy.label('company_working', ' COMPANY*');
  cy.label('title', ' TITLE*');
  cy.label('description', ' DESCRIPTION*');
  cy.textarea('description', 'Place your text');
  cy.label('skills', ' SKILLS (MAX 10)*');
  cy.input('skills', 'Fill name and enter to add your skills');
  cy.label('responsibility', ' RESPONSIBILITY*');
  cy.textarea('responsibility', 'Place your text');
  cy.label('achievement', ' ACHIEVEMENT*');
  cy.textarea('achievement', 'Place your text');

}

function inputDataProject() {
  cy.typeText("name", "OK");
  cy.typeTextarea("description", "description test");
  cy.typeTextarea("responsibility", "responsibility test");
  cy.typeTextarea("achievement", "achievement test");
  cy.checkMutiple('skills_input', 3, 'description_textarea');
}