describe('Navigate user onboarding', () => {
  it('Check Mode New', function () {
    cy.login('lacnt', '12345678');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.visit(Cypress.env('host') + Cypress.env('user_onboarding'));
    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_onboarding'));
    checkUIUserOnboarding();
    // checkDataComboboxOnboarding();
    resetFormUserOnboarding();
    // checkValidateUserOnboarding();
    checkSaveDataOnboarding();
  });
});

function checkUIUserOnboarding() {
  cy.label('first_name', ' FIRST NAME*');
  cy.input('first_name', 'PHUC');
  cy.label('last_name', ' LAST NAME*');
  cy.input('last_name', 'LAM QUANG');
  // cy.label('katakana', ' KATAKANA*');
  // cy.input('katakana', 'Please input your fullname (katakana)');
  // cy.label('romaji', ' ROMAJI*');
  // cy.input('romaji', 'Please input your fullname (romaji)');
  cy.label('gender', ' GENDER');
  cy.label('bod', ' BORN ON DATE*');
  cy.input('bod', '1985/01/01');
  cy.label('phone_number', ' PHONE NUMBER*');
  cy.input('phone_number', '0912345678');
  cy.label('about', ' ABOUT');
  cy.textarea('about', 'Place your text');
  cy.label('country', ' COUNTRY/REGION*');
  cy.input('country', 'Vietnam');
  cy.label('postcode', ' POSTCODE*');
  cy.input('postcode', '700000');
  cy.label('city', ' PROVINE/CITY*');
  cy.input('city', 'Ho Chi Minh City');
  cy.label('district', ' DISTRICT*');
  cy.input('district', 'District 1');
  cy.label('ward', ' WARD*');
  cy.input('ward', 'Dakao');
  cy.label('address', ' ADDRESS*');
  cy.input('address', '9 Dinh Tien Hoang Street');
  cy.label('floor_building', ' FLOOR/BUILDING');
  cy.input('floor_building', 'Floor 9, SFC Building');
  cy.label('company_working', ' COMPANY WORKING');
  cy.input('company_working', 'Aureole IT');
  cy.label('title', ' TITLE');
  cy.input('title', 'Technical Manager');
  cy.label('industry', ' INDUSTRY*');
  cy.input('industry', 'Computer Software');
  cy.label('skills', ' SKILLS (MAX 10)*');
  cy.input('skills', 'Fill name and enter to add your skills');

  cy.styleButton('cancel', ' CANCEL ');
  cy.styleButton('reset', ' RESET ');
  cy.styleButton('save', ' SAVE ');
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
  cy.typeText('address', '9 Dinh Tien Hoang Street');
  cy.typeText('floor_building', 'Floor 9, SFC Building');
  cy.chooseMasterData('company_working', 'AIT');
  cy.chooseMasterData('title', 'Developer');
  cy.chooseMasterData('industry', 'Computer');
  cy.checkMutiple('skills_input', 3, 'floor_building');

}

function checkSaveDataOnboarding() {
  inputDataUserOnboarding();
  // Check if the data is saved or not
  cy.intercept({
    method: 'POST',
    url: Cypress.env('host') + Cypress.env('api_url'),
  }).as('dataSaved');
  cy.clickButton('saveAndContinue');
  cy.wait('@dataSaved').then((req) => {
    cy.status(req.response.statusCode);
    const _key = req.response.body.data.saveUserOnboardingInfo.data[0].user_id;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.visit(
      Cypress.env('host') + Cypress.env('user_Onboarding') + '' + `${_key}`
    );
    const query = `
    query {
      findUserOnboardingInfo(
        request: {
          collection: "user_profile"
          condition: {
            user_id: "${_key}"
            gender: {
              attribute: "gender"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
            country: {
              attribute: "country"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
            city: {
              attribute: "city"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
            district: {
              attribute: "district"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
            ward: {
              attribute: "ward"
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
            industry: {
              attribute: "industry"
              ref_collection: "m_industry"
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
          user_id
          country {
            _key
            value
          }
          city {
            _key
            value
          }
          district {
            _key
            value
          }
          ward {
            _key
            value
          }
          company_working {
            _key
            value
          }
          title {
            _key
            value
          }
          industry {
            _key
            value
          }
          gender {
            _key
            value
          }
          first_name
          last_name
          katakana
          romaji
          bod
          phone_number
          about
          postcode
          address
          floor_building
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
      const dataUserOnboarding = response.body.data.findUserOnboardingInfo.data[0];
      cy.getValueInput('first_name', dataUserOnboarding.first_name);
      cy.getValueInput('last_name', dataUserOnboarding.last_name);
      cy.getValueDate('dob', dataUserOnboarding.dob);
      cy.getValueInput('phone_number', dataUserOnboarding.phone_number);
      cy.typeTextarea("about", dataUserOnboarding.about);
      cy.getValueMaster('country', dataUserOnboarding.country);
      cy.getValueInput('postcode', dataUserOnboarding.postcode);
      cy.getValueMaster('city', dataUserOnboarding.city);
      cy.getValueMaster('district', dataUserOnboarding.district);
      cy.getValueMaster('ward', dataUserOnboarding.ward);
      cy.getValueInput('address', dataUserOnboarding.address);
      cy.getValueInput('floor_building', dataUserOnboarding.floor_building);
      cy.getValueMaster('company_working', dataUserOnboarding.company_working);
      cy.getValueMaster('industry', dataUserOnboarding.industry);
      cy.getValueMaster('title', dataUserOnboarding.title);

    });
  });
}
