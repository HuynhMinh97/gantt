import 'cypress-file-upload';
describe('Test Cypress', () => {
    it('Check Mode New', function () {
        cy.login('thuannv', '12345678');  
        cy.wait(3000); 
        cy.get("#user",{ timeout: 100 }).click().then(() =>{

            // checkTitleAndPlaceholder();
            //checkValidate();
            //checkValidOfDate();
            addData();
            // checkReset();
            //  checkSave()
        });
     
    });
  });

  let datas = {
      name:"thuan",
      course_number: "AIT0001",
      description: "Please input description",
      file: "hoa.jpg",
      is_online: true,
      start_date_to: ['2021', '8', '25'],
      training_center: "Computer Network Architect",       
  }
  function checkTitleAndPlaceholder() {
    // Check title and placeholder
  
    cy.label('name', ' Name*');
    cy.textarea('name', 'Ex: Project Management');

    cy.get('#is_online').should(
        'have.text',
        ' Online? '
      );
  
    cy.label('training_center', ' Center');
    cy.input('training_center', 'BACH KHOA Ho Chi Minh Technology University');
  
    cy.label('course_number',' Certificate');
    cy.textarea('course_number', 'EX: AIT001');
  
    cy.label('start_date_from', ' start date');
    cy.getValueDate('start_date_from', new Date().getTime());
  
    cy.input('start_date_to', 'yyyy/MM/dd');
  
    cy.label('description', ' DESCRIPTION');
    cy.textarea('description', 'Place your text');

  }
  
  function checkValidate() {
    // Check validate when click save
    cy.chooseValueDate('start_date_to', '2021', '8', '13');

    cy.clickButton('saveContinue'); 
    
    cy.errorMessage('name', 'Name を入力してください。');
    cy.errorMessage(
      'messagError',
      'start_date_to以下の値でstart_date_fromを入力してください。'
    );
  
   
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

  function addData(){
    cy.typeTextarea("name",datas.name);
    if(datas.is_online){
      cy.get('#is_online').click();
    }
    cy.chooseMasterData('training_center',datas.training_center);
    cy.typeTextarea("course_number",datas.course_number);
    cy.chooseValueDate('start_date_to', datas.start_date_to[0],datas.start_date_to[1],datas.start_date_to[2]);
    cy.typeTextarea("description",datas.description);
    cy.chooseFile('file_input_file',datas.file);
    cy.wait(1000);
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
      const _key = req.response.body.data.saveCourse.data[0]._key;
      const file = [];
      file.push(req.response.body.data.saveCourse.data[0]._key);
  
      cy.wait(1000);
      cy.visit(
        Cypress.env('host') + Cypress.env('user_course') + '/' + `${_key}`
      );
      let query = `
        query {
          findCourse(
            request: {
              collection: "user_course"
              condition: {
                _key: "${_key}"
                del_flag: false
              }
              company: "${Cypress.env('company')}"
              lang: "${Cypress.env('lang')}"
              user_id: "${Cypress.env('user_id')}"
            }
          ) {
            data {
              _key
              name
              is_online
              training_center
              course_number
              start_date_from
              start_date_to
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
                
        const data = response.body.data.findCourse.data[0];
        console.log("data",data);
        
        cy.textareaValue('name', data.name);
        cy.textareaValue('description', data.description);
        cy.textareaValue('course_number', data.course_number);
        const dateFrom = new Date(data.start_date_from).toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/').substring(0,10);
        const dateTo = new Date(data.start_date_to).toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/').substring(0,10);
        cy.getValueDate('start_date_from', dateFrom);
        cy.getValueDate('start_date_to', dateTo);
        cy.inputValue('training_center', datas.training_center);
        console.log("thuan111111111112",file);
        console.log("thuan111111111111",data.file);
        getFile(data.file);

  
        // check disable button Save & Close
        // cy.get('button.button__wrapper__disabled').should('be.disabled')
        // cy.typeTextarea('description', 'a');
        // cy.get('button.button__wrapper').should('not.be.disabled')
  
      });
    });
  }
  
  function getFile(value:[]){
    console.log(value);
    const token ="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2tleSI6ImY5ZTQxYzA0LTEwY2YtNGUyMi05M2QzLTIwODRiNzI5ZjJjOCIsImlhdCI6MTYyOTc5Mjc3NSwiZXhwIjoxNjI5ODc5MTc1fQ.a8kscr080YkWNVy_vLEuOXycd2H_Jsp3htvRDfmgPLk"
    let query =`
    query {
      findBinaryData(
        request: {
          collection: "sys_binary_data"
          condition: { _key: { value: ["${value}"] } }
          company: "${Cypress.env('company')}"
          lang: "${Cypress.env('lang')}"
          user_id: "${Cypress.env('user_id')}"
        }
      ) {
        data {
          _key
          data_base64
          file_type
          size
          name
          create_at
        }
        message
        errors
        status
        numData
        numError
      }
    }
    
    `
    cy.request({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
      body: { query },
      failOnStatusCode: false,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log("ttttttttttttttt",response);
      
    })
  }