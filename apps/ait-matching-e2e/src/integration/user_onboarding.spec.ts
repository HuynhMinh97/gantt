describe('Navigate user onboarding', () => {
  it('Check Mode New', function () {
    cy.login('lacnt', '12345678');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.visit(Cypress.env('host') + Cypress.env('/user-onboarding/10222095'));
    cy.url().should('eq', Cypress.env('host') + '');
    // cy.url().should('eq', Cypress.env('host') + Cypress.env('user_onboarding'));
    checkUIUserOnboarding();
    // checkDataComboboxOnboarding();
    // resetFormUserOnboarding();
    // checkValidateUserOnboarding();
    checkSaveDataOnboarding();
  });
});

function checkUIUserOnboarding() {
  cy.label('first_name', ' First Name*');
  cy.input('first_name', 'Please input first name');
  cy.label('last_name', ' Last Name*');
  cy.input('last_name', 'Please input last name');
  cy.label('bod', ' Born On Date');
  cy.label('phone_number', ' Phone Number');
  // cy.input('phone_number', 'Please input phone number');
  cy.label('about', ' About');
  // cy.textarea('about', 'Please input about');
  cy.label('country', ' Country/Region*');
  cy.input('country', 'Please select country/region');
  cy.label('postcode', ' Postcode');
  cy.input('postcode', 'Please input postcode');
  cy.label('city', ' Province/City*');
  cy.input('city', 'Please select province/city');
  cy.label('district', ' District*');
  // cy.input('district', 'Please select district');
  cy.label('ward', ' Ward*');
  cy.input('ward', 'Please select ward');
  // cy.label('address', ' Address*');
  // cy.input('adress', 'Please input adress');

  // Current Job Information 
  cy.label('company_working', ' Company Working*');
  cy.input('company_working', 'Please select company');
  cy.label('current_job_title', ' Your Title*');
  cy.input('current_job_title', 'Please select title');
  // cy.label('current_job_skills', ' Your Skills(Max 10)*');
  cy.input('current_job_skills', 'Please select skill');
  cy.label('industry_working', ' Industry Working*');
  cy.input('industry_working', 'Please select industry');
  cy.label('current_job_level', ' Your Level*');
  cy.input('current_job_level', 'Please select level');

  // job setting
  cy.label('industry', ' Industry');
  cy.input('industry', 'Please select industry');
  cy.label('job_setting_title', ' Title');
  cy.input('job_setting_title', 'Please select title');
  cy.label('location', ' Location');
  cy.input('location', 'Please select location');
  cy.label('job_setting_skills', ' Skills*');
  cy.input('job_setting_skills', 'Please select skill');
  cy.label('job_setting_level', ' Level');
  cy.input('job_setting_level', 'Please select level');
  cy.label('start_date_from', ' Available Time');

  // cy.styleButton('cancel', ' CANCEL ');
  // cy.styleButton('reset', ' RESET ');
  // cy.styleButton('save', ' SAVE ');
}
function checkDataComboboxOnboarding() {
  cy.dataCombobox('COUNTRY', 'country');
  cy.get('#first_name_input');
  cy.dataCombobox('CITY', 'city');
  cy.get('#first_name_input');
  cy.dataCombobox('DISTRICT', 'district');
  cy.get('#first_name_input');
  cy.dataCombobox('WARD', 'ward');
}


function checkValidateUserOnboarding() {
  // Check validate when click save
  cy.clickButton('saveAndContinue');
  cy.errorMessage('school', ' SCHOOL を入力してください。');
  cy.errorMessage(
    'start-date',
    ' start_date_to 以下の値で start_date_from を入力してください。'
  );
}

function resetFormUserOnboarding() {
  inputDataUserOnboarding();
  // Check reset Form
  cy.clickButton('reset');
  cy.resetForm([
    'first_name_input',
    'last_name_input',
    'katakana_input',
    'romaji_input',
    'bod_input',
    'phone_number_input',
    'about_textarea',
    'country_input',
    'postcode_input',
    'city_input',
    'district_input',
    'ward_input',
    'address_input',
    'floor_building_input',
    'company_working_input',
    'title_input',
    'industry_input',
    'skills_input'
  ]);
  cy.chooseRadio(' Other ');
}

function inputDataUserOnboarding() {
  cy.typeText('first_name', 'TRAN THI');
  cy.typeText('last_name', 'TU LINH');
  cy.chooseRadio(' Female ');
  cy.typeText('bod', '19970928');
  cy.typeText('phone_number', '0356312546');
  cy.typeTextarea('about', 'good skill');
  cy.chooseMasterData('country', 'Viet Nam');
  cy.typeText('postcode', '20000');
  cy.chooseMasterData('city', 'Ho Chi Minh');
  cy.chooseMasterData('district', 'Quan 1');
  cy.chooseMasterData('ward', 'DaKao');
  cy.typeText('adress', '9 Dinh Tien Hoang Street');
  cy.typeText('floor_building', 'Floor 9, SFC Building');
  cy.chooseMasterData('company_working', 'AIT');
  cy.chooseMasterData('current_job_title', 'Developer');
  cy.chooseMasterData('industry_working', 'Computer');
  cy.checkMutiple('current_job_skills_input', 3, 'current_job_level_input');
  cy.chooseMasterData('current_job_level', 'R1');
  cy.checkMutiple('industry_input', 3, 'job_setting_level_input');
  cy.chooseMasterData('job_setting_title', 'Developer');
  cy.chooseMasterData('location', 'Hue');
  cy.checkMutiple('job_setting_skills_input', 3, 'current_job_level_input');
  cy.chooseMasterData('job_setting_level', 'R1');
}

function checkSaveDataOnboarding() {
  inputDataUserOnboarding();
  // Check if the data is saved or not
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('save');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
  })
}
