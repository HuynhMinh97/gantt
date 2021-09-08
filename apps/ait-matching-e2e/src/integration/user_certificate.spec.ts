import { isValue } from '../../../../libs/shared/src/lib/utils/checks.util';
import { extend } from 'lodash';
import 'cypress-file-upload';
describe('add data', () => {
    it('sign in', function () {
        cy.login('thuannv', '12345678');  
        cy.wait(1000); 
        cy.get("#user",{ timeout: 100 }).click().then(() =>{
           
            // cy.label('name',' Name*')
            // cy.typeText("name","t"); 
            // cy.get("#name_selection_value")
            // cy.contains('test2').click();

            // cy.label('certificate',' CERTIFICATE NUMBER')
            // cy.typeTextarea("certificate","thuan");

            // cy.label('grade',' GRADE')
            // cy.typeTextarea("grade","thuan");

            // cy.label('issue',' Issue BY')
            // cy.typeText("issue","t"); 
            // cy.get("#issue_selection_value")
            // cy.contains('test2').click();

            // cy.label('issueDate',' ISSUE DATE')
           
            cy.chooseFile('file_input_file','hoa.jpg') 
            // // cy.clickButton('saveContinue');
            
            // cy.intercept({
            //     method: 'POST',
            //     url: Cypress.env('host') + Cypress.env('api_url'),
            // }).as('dataSaved')
            // cy.clickButton('saveContinue');
            // cy.log('@dataSaved')
            // cy.wait('@dataSaved').then((req)=>{
            //     cy.log( cy.status(req.response.statusCode));
            //     cy.status(req.response.statusCode)
            // })

            // cy.get("#saveContinue_text_button").click();
            // cy.request('/#/user').then((response) =>{
            //     cy.status(response.status);
            // });
        //    checkLabelAndPlaceholder();
          //  checkErrorMessage();
        });  
              
    });
  });

function checkLabelAndPlaceholder(){
    cy.label('name',' Name*');
    cy.input('name','Japanese N1');

    cy.label('certificate',' CERTIFICATE NUMBER');
    cy.textarea('certificate','EX: AIT001');

    cy.label('issue',' Issue BY');
    cy.input('issue','BACH KHOA Ho Chi Minh Technology University');

    cy.label('grade',' GRADE');
    cy.textarea('grade','90/120');

    cy.label('issueDate',' ISSUE DATE')
    cy.getValueDate('issueDate', new Date().getTime());
    cy.input('immigration', 'yyyy/MM/dd');
    
    cy.label('description',' DESCRIPTION')
    cy.textarea('description','Place your text');
}
function checkErrorMessage() {
    cy.clickButton('saveContinue');
    cy.errorMessage('name', 'Name を入力してください。');
    cy.chooseValueDate('immigration', '2021', '8', '13');
    cy.typeTextarea("certificate","thuan");
    cy.get('#certificate_textarea')
    .invoke('text')  // for input or textarea, .invoke('val')
    .then(text => {
        const someText = text;
        cy.log(someText);
        cy.log(new Date().toString());
    });
    // cy.get('#immigration_input').should('have.css');
    // cy.get('#immigration_input').should('have.value', val)
    // cy.get('#immigration_input').should(($input) => {
    //     const val = $input.val()
    //     cy.log(val);
    //   })
    // if(!cy.get('#immigration_input').find('input').check()){
        
    //     cy.log('thuan');
    // }
    
    
}

  describe('Test Cypress', () => {
    // it('Check Mode New', function () {
    //   cy.login('diennv', '12345678');
    //   cy.wait(2000);
    //   cy.visit(Cypress.env('host') + Cypress.env('user_experience'));
  
    //   cy.url().should('eq', Cypress.env('host') + Cypress.env('user_experience'));
    //   // checkTitleAndPlaceholder();
    //   // checkValidate();
    //   // checkValidOfDate();
    //   insertData();
    // });
  });
  
  function checkTitleAndPlaceholder() {
    // Check title and placeholder
  
    cy.label('title', ' TITLE*');
    cy.input('title', 'Developer');
  
    cy.label('company_working', ' COMPANY*');
    cy.inputValue('company_working', 'AIT');
  
    cy.label('location', ' LOCATION*');
    cy.input('location', 'Ho Chi Minh City');
  
    cy.label('employee_type', ' EMPLOYMENT TYPE*');
    cy.input('employee_type', 'Select');
  
    cy.get('#is_working').should(
      'have.text',
      'I am currently working in this role '
    );
  
    cy.label('start_date_from', ' START DATE');
    cy.getValueDate('start_date_from', new Date().getTime());
    cy.input('start_date_to', 'yyyy/MM/dd');
  
    cy.label('description', ' DESCRIPTION');
    cy.textarea('description', 'Place your text');
  }
  
  function checkValidate() {
    // Check validate when click save
    cy.clickButton('SaveAndContinue');
  
    cy.errorMessage('title', 'TITLE を入力してください。');
    cy.errorMessage('location', 'LOCATION を入力してください。');
    cy.errorMessage('employee_type', 'EMPLOYMENT TYPE を入力してください。');
    cy.errorMessage(
      'start-date',
      ' start_date_to 以下の値で start_date_from を入力してください。'
    );
  
    // Check reset Form
    cy.clickButton('reset');
    cy.resetForm([
      'title_input',
      //'company_working_input',
      'location_input',
      'employee_type_input',
      'is_working',
      //'start_date_from_input',
      'start_date_to_input',
      'description_textarea',
    ]);
  }
  
  function checkValidOfDate(){
    // default (case: wrong)
    cy.clickButton('SaveAndClose');
    cy.errorMessage('start-date', ' start_date_to 以下の値で start_date_from を入力してください。');
  
    // choose start_date_from > current date (case: wrong)
    cy.get('#is_working').click();
    cy.chooseDate
    cy.chooseValueDate('start_date_from', '2021', '8', '27');
    cy.clickButton('SaveAndClose');
    cy.errorMessage('start-date', ' now_date 以下の値で start_date_from を入力してください。');
    // choose start_date_from > start_date_to (case: wrong)
    cy.get('#is_working').click();
    cy.chooseValueDate('start_date_from', '2021', '8', '27');
    cy.chooseValueDate('start_date_to', '2021', '8', '1');
    cy.clickButton('SaveAndClose');
    cy.errorMessage('start-date', ' start_date_to 以下の値で start_date_from を入力してください。');
  
    // choose start_date_to < current date (case: right)
    cy.chooseValueDate('start_date_from', '2021', '8', '13');
    cy.chooseValueDate('start_date_to', '2021', '8', '19');
    cy.clickButton('SaveAndClose');
    // cy.clickButton('reset');
  
  }
  
  function insertData() {
    // Check save
    cy.chooseMasterData('title', 'Senior System Designer');
    cy.chooseMasterData('location', 'Hue');
    cy.chooseMasterData('employee_type', 'オレオウ組合');
  
    cy.get('#is_working').click();
    cy.chooseDate('start_date_from');
    if (!cy.get('#is_working').find('input').check()) {
      cy.chooseDate('start_date_to');
    }
    cy.typeTextarea('description', 'bin test cypress');
    // Check if the data is saved or not
    cy.intercept({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
    }).as('dataSaved');
    cy.clickButton('SaveAndClose');
    cy.wait('@dataSaved').then((req) => {
      //console.log(req);
      cy.status(req.response.statusCode);
      const _key = req.response.body.data.saveUserExperienceInfo.data[0]._key;
  
      cy.wait(1000)
      cy.visit(Cypress.env('host') + Cypress.env('user_experience') + '/' + `${_key}`)
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
      console.log(query);
      
      cy.request({
        method: 'POST',
        url: Cypress.env('host') + Cypress.env('api_url'),
        body: { query },
        failOnStatusCode: false
    
      }).then(response => {
        
        
        //return response.body.data.findUserExperienceInfo.data
      })
    });
  }
// describe('save and continue', () => {
//     it('sign in', function () {
//       cy.login('thuannv', '12345678');
//       cy.get("#user").click();
//       cy.typeText("name","t"); 
//         cy.get("ait-chip")
//         cy.contains('test1').click();
//       cy.typeText("issue","t"); 
//         cy.get("ait-chip")
//         cy.contains('test2').click();
//       cy.typeTextarea("certificate","thuan");
//       cy.typeTextarea("grade","thuan");
//       cy.typeTextarea("description","thuan");
//       cy.chooseDate("immigration");
//       cy.chooseFile('file_input_file','hoa.jpg')
//       cy.get("#saveContinue_text_button").click()
//     });
//   });
// describe('save and close', () => {
//     it('sign in', function () {
//       cy.login('thuannv', '12345678');
//       cy.get("#user").click();
//       cy.typeText("name","t"); 
//         cy.get("ait-chip")
//         cy.contains('test1').click();
//       cy.typeText("issue","t"); 
//         cy.get("ait-chip")
//         cy.contains('test2').click();
//       cy.typeTextarea("certificate","thuan");
//       cy.typeTextarea("grade","thuan");
//       cy.typeTextarea("description","thuan");
//       cy.chooseDate("immigration");
//       cy.chooseFile('file_input_file','hoa.jpg')
//       cy.get("#saveContinue_text_button").click()
//     });
//   });
//   describe('reset', () => {
//     it('sign in', function () {
//       cy.login('thuannv', '12345678');
//       cy.get("#user").click();
//       cy.typeText("name","t"); 
//         cy.get("ait-chip")
//         cy.contains('test1').click();
//       cy.typeText("issue","t"); 
//         cy.get("ait-chip")
//         cy.contains('test2').click();
//       cy.typeTextarea("certificate","thuan");
//       cy.typeTextarea("grade","thuan");
//       cy.typeTextarea("description","thuan");
//       cy.chooseDate("immigration");
//       cy.chooseFile('file_input_file','hoa.jpg')
//       cy.get("#saveContinue_text_button").click()
//     });
//   });
//   describe('cancel', () => {
//     it('sign in', function () {
//       cy.login('thuannv', '12345678');
//       cy.get("#user").click();
//       cy.typeText("name","t"); 
//         cy.get("ait-chip")
//         cy.contains('test1').click();
//       cy.typeText("issue","t"); 
//         cy.get("ait-chip")
//         cy.contains('test2').click();
//       cy.typeTextarea("certificate","thuan");
//       cy.typeTextarea("grade","thuan");
//       cy.typeTextarea("description","thuan");
//       cy.chooseDate("immigration");
//       cy.chooseFile('file_input_file','hoa.jpg')
//       cy.get("#saveContinue_text_button").click()
//     });
//   });
//   describe('edit', () => {
//     it('sign in', function () {
//       cy.login('thuannv', '12345678');
//       cy.get("#user").click();
//       cy.visit("http://localhost:4200/#/user/450dfebb-74a3-904d-d8b2-c37e5a1fa68a");
//     });
//   });
 
 