import { verify } from "cypress/types/sinon";

describe('Test Cypress', () => {
    it('Check Mode New', function () {
      cy.login('thuannv', '12345678');
      cy.wait(3000);
      cy.visit(Cypress.env('host') + Cypress.env('user_project'));
    //   checkTitleAndPlaceholder();
      // checkValidate();
      //  checkSave();
      addData();
    });
  });
  let datas = {
    name:"thuan",
    start_date_to: ['2021', '8', '25'],
    company_working:"5915623617",
    title:"5914992347",
    description:"111111111111111",
    skills:"",
    responsibility:"111111111",
    achievement:"11111111111"    
}

function addData(){
   cy.typeText("name",datas.name);
   cy.getValueDate('start_date_from', new Date().getTime());
   cy.get('#company_working_input').click();
  //  cy.get('div.option__container').find('have.value', );
  //  cy.get('div.option__container').eq(i).click();
   cy.typeTextarea("description",datas.description);
   cy.typeTextarea("responsibility",datas.responsibility);
   cy.typeTextarea("achievement",datas.achievement);
  cy.checkMutiple('skills_input', 2 ,'description_textarea');
   
 }

function checkValidate() {
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

  function checkReset(){
    // Check reset Form
    cy.clickButton('reset');
    cy.resetForm([
      'name_textarea',
      //'company_working_input',
      'is_online',
      'training_center_input',
      'course_number_textarea',
      //'start_date_from_input',
      'start_date_to_input',
      'description_textarea',
      'file_input_file',
    ]);
 }


  function checkSave() {
    addData();
    cy.wait(500);
    // Check if the data is saved or not
    console.log('thuan');
    cy.intercept({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
    }).as('dataSaved');
    
    cy.clickButton('saveContinue');
    cy.wait('@dataSaved').then((req) => {
      console.log(req.response);

      cy.status(req.response.statusCode);
      const _key = req.response.body.data.saveUserProject.data[0]._key;
      console.log("ttttttttttt", _key);
      
      const file = [];
      file.push(req.response.body.data.saveUserProject.data[0]._key);
  
      cy.wait(1000);
      cy.visit(
        Cypress.env('host') + Cypress.env('user_project') + '/' + `${_key}`
      );
      let query = `
      query {
        findUserProject(
          request: {
            collection: "biz_project"
            condition: {
              _key: "${_key}"
              del_flag: false
              skills: {
                attribute: "skills"
                ref_collection: "m_skill"
                ref_attribute: "_key"
                get_by: "_key"
              }
            }
            company: "${Cypress.env('company')}"
            lang: "${Cypress.env('lang')}"
            user_id: "${Cypress.env('user_id')}"
            options: {}
          }
        ) {
          data {
            _key
            user_id
            company
            create_at
            create_by
            change_at
            change_by
            name
            start_date_from
            start_date_to
            company_working
            title
            description
            responsibility
            achievement
            skills {
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
      }
        `;
  
      cy.request({
        method: 'POST',
        url: Cypress.env('host') + Cypress.env('api_url'),
        body: { query },
        failOnStatusCode: false,
       
      }).then((response) => {
                
        const data = response.body.data.findUserProject.data[0];
        console.log("data",data);
        
        cy.inputValue('name', data.name);
        cy.textareaValue('description', data.description);
        cy.textareaValue("responsibility",data.responsibility);
        cy.textareaValue("achievement",data.achievement);
        cy.inputValue('company_working','Aureole');
        cy.inputValue('title', 'Senior System Designer');
      });
    });
  }

  function checkTitleAndPlaceholder() {
    // Check title and placeholder
  
    cy.label('name', ' NAME*');
    cy.input('name', 'Please input project name');
    
    cy.label('start_date_from', ' START DATE*');
    cy.getValueDate('start_date_from', new Date().getTime());

    cy.input('start_date_to', 'yyyy/MM/dd');

    cy.label('company_working', ' COMPANY*');
    // cy.input('training_center', 'Aureole IT');
  
    cy.label('title',' TITLE*');
    // cy.textarea('title', 'Developer');
  
    cy.label('description', ' DESCRIPTION*');
    cy.textarea('description', 'Please input project name');
  
    cy.label('skills', ' SKILLS (MAX 10)*');
    cy.input('skills', 'Fill name and enter to add your skills');
  
    cy.label('responsibility', ' RESPONSIBILITY*');
    cy.textarea('responsibility', 'Place your text');

    cy.label('achievement', ' ACHIEVEMENT*');
    cy.textarea('achievement', 'Place your text');

    cy.styleButton('cancel', ' CANCEL ');
    cy.styleButton('reset', ' RESET ');
    cy.styleButton('saveContinue', ' SAVE & CONTINUE ');
    cy.styleButton('saveClose', ' SAVE & CLOSE ');
  }