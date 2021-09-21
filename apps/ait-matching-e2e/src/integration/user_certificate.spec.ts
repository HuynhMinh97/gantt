describe('Test Cypress', () => {
  it('Check Mode New', function () {
    cy.login('thuannv', '12345678');
    cy.wait(2000);

    cy.visit(Cypress.env('host') + Cypress.env('user_certificate'));

    // cy.url().should('eq', Cypress.env('host') + Cypress.env('user_certificate'));
    checkLabelAndPlaceholder();
    checkButton();
    checkErrorMessage();
    addData();
    checkReset()
    checkSave();
    
  });
});

let datas = {
  name:"Tiếng anh",
  certificate_award_number: "AIT0001",
  grade:"100/100",
  description: "Please input description",
  file: ["anh.jpg","AIT-Starter-Component.xlsx","test.docx"],
  issue_by: "Đại học khoa học huế",
  issue_date_to: ['2021', '12', '25'],    
}
function addData(){
  cy.chooseMasterData("name",datas.name);
  cy.typeText("certificate_award_number",datas.certificate_award_number);
  cy.typeTextarea('grade', datas.grade);
  cy.chooseMasterData("issue_by",datas.issue_by);
  cy.chooseValueDate('issue_date_to', datas.issue_date_to[0],datas.issue_date_to[1],datas.issue_date_to[2]);
  cy.typeTextarea("description",datas.description);
  cy.chooseFile('file_input_file',datas.file[0]);
  cy.chooseFile('file_input_file',datas.file[1]);
  cy.chooseFile('file_input_file',datas.file[2]);
  cy.wait(1000);
}

function checkReset(){
  // Check reset Form
  cy.clickButton('reset');
  cy.resetForm([
    'name_input',
    'certificate_award_number_input',
    'grade_textarea',
    'issue_by_input',
    'issue_date_to_input',
    'description_textarea',
    // 'file_input_file',
  ]);
}

function checkLabelAndPlaceholder(){
    cy.label('name',' NAME*');
    cy.input('name','Japanese N1');

    cy.label('certificate_award_number',' CERTIFICATE NUMBER');
    cy.input('certificate_award_number','Ex: AIT001');

    cy.label('issue_by',' ISSUE BY');
    cy.input('issue_by','BACH KHOA Ho Chi Minh Technology University');

    cy.label('grade',' GRADE');
    cy.textarea('grade','90/120');

    cy.label('issue_date_from',' ISSUE DATE')
    // cy.getValueDate('issue_date_from', new Date().getTime());
    // cy.input('issue_date_to', 'yyyy/MM/dd');
    
    cy.label('description',' DESCRIPTION')
    cy.textarea('description','Place your text');

    cy.get('#file_input_file').should('have.value', '');

    cy.styleButton('cancel', ' CANCEL ');
    cy.styleButton('reset', ' RESET ');
    cy.styleButton('saveContinue', ' SAVE & CONTINUE ');
    cy.styleButton('saveClose', ' SAVE & CLOSE ');
}

function checkButton(){
  cy.get('#cancel_text_button').should('exist');
  cy.get('#reset_text_button').should('exist');
  cy.get('#saveContinue_text_button').should('exist');
  cy.get('#saveClose_text_button').should('exist');
}

function checkErrorMessage() {
  
    cy.clickButton('saveContinue');
    cy.errorMessage('name', 'NAME required.');
    cy.chooseValueDate('issue_date_to', '2021', '8', '13');
    cy.errorMessage(
      'errorDate',
      'Enter START DATE with a value less than or equal to START DATE TO.'
    );
}
function checkSave() {
  addData();
  cy.wait(500);
  // Check if the data is saved or not
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  console.log('@dataSaved');
  
  cy.clickButton('saveContinue');
  cy.wait('@dataSaved').then((req) => {
    console.log(req.response);

    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUsercertificate.data[0]._key;
    const file = [];
    file.push(req.response.body.data.saveUsercertificate.data[0]._key);

    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_certificate') + '/' + `${_key}`
    );
    let query = `
      query {
        findUsercertificate(
          request: {
            collection: "user_certificate_award"
            condition: {
              _key: "${_key}"
              del_flag: false
            }
            company: "${Cypress.env('company')}"
            lang: "${Cypress.env('lang')}"
            user_id: "${Cypress.env('user_id')}"
            options: {}
          }
        ) {
          data {
            _key
            name
            certificate_award_number
            grade
            issue_by
            issue_date_from
            issue_date_to
            description
            file
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
              
      const data = response.body.data.findUsercertificate .data[0];
      console.log(response);
      
      cy.inputValue('name', 'Tiếng anh ');
      cy.inputValue('certificate_award_number', data.certificate_award_number);
      cy.textareaValue('grade', data.grade);
      const dateFrom = new Date(data.issue_date_from).toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/').substring(0,10);
      const dateTo = new Date(data.issue_date_to).toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/').substring(0,10);
      cy.typeTextarea("description",datas.description);
      
      
      // cy.getValueDate('start_date_from', dateFrom);
      // cy.getValueDate('start_date_to', dateTo);
    });
  });
}



  