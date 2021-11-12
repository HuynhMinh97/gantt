import { checkResetProject, checkSaveProject, checkUIProject } from "./user_project.spec";

describe('Navigate user profile', () => {
  it('Check Mode New', function () {
    cy.login('lacnt', '12345678');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.visit(Cypress.env('host') + Cypress.env('user_profile'));
    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_profile'));
    checkUI();
    addProjects();
  });

  function checkUI() {
    const query = `
    query {
        findProfile(
        request: {
          collection: "user_profile"
          condition: {
            user_id: "${Cypress.env('user_id')}"
            country_region: {
              attribute: "country_region"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
            province_city: {
              attribute: "province_city"
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
              ref_collection: "m_company"
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
          user_id
          country_region {
            _key
            value
          }
          province_city {
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
          first_name
          last_name
          about
         
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
      const data = response.body.data.findProfile.data[0];
      cy.get('#fullname_input').should('have.text', ' ' + data.last_name + ' ' + data.first_name + ' ');
      cy.get('#company_input').should('have.text', ' ' + data.title.value + " at " + data.company_working.value + ' ');
      cy.get('#country_region_input').should('have.text', data.province_city.value + ', ' + data.country_region.value);
      cy.get('#about_input').should('have.text', ' ' + data.about + ' ')
    });
    getTextMenu('SKILLS', 'SKILLS');
    getTextMenu('PROJECTS', 'PROJECTS');
    getTextMenu('EXPERIENCES', 'EXPERIENCES');
    getTextMenu('CERTIFICATES', 'CERTIFICATES');
    getTextMenu('COURSES', 'COURSES');
    getTextMenu('EDUCATIONS', 'EDUCATIONS');
    getTextMenu('LANGUAGES', 'LANGUAGES');

  }

  function getTextMenu(id, value) {
    cy.get('#menu_item_' + id).should('have.text', ' ' + value + ' ')
  }

  function addSkills() {
    console.log(123);

  }

  function addProjects() {
    cy.get('#openProjects').click();
    checkUIProject();
    checkResetProject();
    checkSaveProject();

  }

  function addExperiences() {
    console.log(123);

  }

  function addCertificates() {
    console.log(123);

  }

  function addCourses() {
    console.log(123);

  }
  function addEducations() {
    console.log(123);

  }

  function addLanguages() {
    console.log(123);

  }

});