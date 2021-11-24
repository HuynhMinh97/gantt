import { UserCertificate } from "./user_certificate.spec";
import { UserCourse } from "./user_course.spec";
import { UserEducation } from "./user_education.spec";
import { UserExperience } from "./user_experience.spec";
import { UserLanguage } from "./user_language.spec";
import { UserProject } from "./user_project.spec";

describe('Navigate user profile', () => {
  it('Check Mode New', function () {
    cy.login('lacnt', '12345678');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.visit(Cypress.env('host') + Cypress.env('user_profile'));
    cy.url().should('eq', Cypress.env('host') + Cypress.env('user_profile'));
    checkUI();
    findUserOnboarding();
    addProjects();
    addExperiences();
    addCertificates();
    addCourses();
    addEducations();
    addLanguages();

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

  function findUserOnboarding() {
    cy.get('.view_contact').click();
    const query = `
    query {
      findUserOnboardingInfo(
        request: {
          collection: "user_profile"
          condition: {
            user_id: "${Cypress.env('user_id')}"
            gender: {
              attribute: "gender"
              ref_collection: "sys_master_data"
              ref_attribute: "code"
            }
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
              ref_collection: "m_company"
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
          country_region {
            _key
            value
          }
          province_city {
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
      // cy.getValueDate('dob', dataUserOnboarding.dob);
      cy.getValueInput('phone_number', dataUserOnboarding.phone_number);
      cy.textareaValue("about", dataUserOnboarding.about);
      cy.getValueMaster('country', dataUserOnboarding.country_region);
      cy.getValueInput('postcode', dataUserOnboarding.postcode);
      cy.getValueMaster('city', dataUserOnboarding.province_city);
      cy.getValueMaster('district', dataUserOnboarding.district);
      cy.getValueMaster('ward', dataUserOnboarding.ward);
      cy.getValueInput('address', dataUserOnboarding.address);
      cy.getValueInput('floor_building', dataUserOnboarding.floor_building);
      cy.getValueMaster('industry', dataUserOnboarding.industry);
      cy.getValueMaster('title', dataUserOnboarding.title);
      cy.getValueMaster('company_working', dataUserOnboarding.company_working);

    });
    cy.clickButton('cancel');
  }

  function addProjects() {
    cy.get('#openProjects').click();
    UserProject.checkUIProject();
    // UserProject.checkValidateProject();
    UserProject.checkResetProject();
    UserProject.checkSaveProject();
    const query = `{
        findUserProject(
          request: {
            collection: "biz_project"
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
            options: { sort_by: { value: "start_date_to", order_by: "DESC" } }
            company: "${Cypress.env('company')}"
            lang: "${Cypress.env('lang')}"
            user_id: "${Cypress.env('user_id')}"
          }
        ) {
          data {
            _key
            user_id
            name
            start_date_from
            start_date_to
            company_working {
              _key
              value
            }
            title {
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
      const data = response.body.data.findUserProject.data[0];
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('#project_detail_menu_toc_item_PROJECTS').find('#project-' + data._key).click();
      UserProject.findProject(data._key);
    })
    cy.clickButton('cancel');
  }

  function addExperiences() {
    cy.get('#openExperience').click();
    UserExperience.resetFormUserExp();
    UserExperience.checkUIUserExp();
    UserExperience.checkDataComboboxExp();
    // UserExperience.checkValidateUserExp();

    UserExperience.checkSaveExper();
    const query = `query {
        findUserExperienceInfo(
          request: {
            collection: "user_experience"
            condition: {
              user_id: "${Cypress.env('user_id')}"
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
                ref_collection: "m_company"
                ref_attribute: "code"
              }
              del_flag: false
            }
            options: { sort_by: { value: "start_date_to", order_by: "DESC" } }
            company: "${Cypress.env('company')}"
            lang: "${Cypress.env('lang')}"
            user_id: "${Cypress.env('user_id')}"
          }
        ) {
          data {
            _key
            user_id
            title {
              _key
              value
            }
            company_working {
              _key
              value
            }
            employee_type {
              _key
              value
            }
            location {
              _key
              value
            }
            is_working
            start_date_from
            start_date_to
            description
            del_flag
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
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('#experience_detail_menu_toc_item_EXPERIENCES').find('#experience-' + data._key).click();
      UserExperience.findUserExperienceInfo(data._key);
    })
    cy.clickButton('cancel');
  }

  function addCertificates() {
    cy.get('#openCertificate').click();
    UserCertificate.checkUICertificate();
    // UserCertificate.checkValidateCertificate();
    UserCertificate.checkResetCertificate();
    UserCertificate.checkSaveCertificate();

    const query = `
    query {
      findUsercertificate(
        request: {
          collection: "user_certificate_award"
          condition: {
            user_id: "${Cypress.env('user_id')}"
            del_flag: false
            name: {
              attribute: "name"
              ref_collection: "m_certificate_award"
              ref_attribute: "code"
            }
            issue_by: {
              attribute: "issue_by"
              ref_collection: "m_training_center"
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
          name {
            _key
            value
          }
          issue_by {
            _key
            value
          }
          issue_date_from
          issue_date_to
          user_id
        }
        message
        errors
        status
        numData
        numError
      }
    }
    `; cy.request({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
      body: { query },
      failOnStatusCode: false,

    }).then((response) => {
      const data = response.body.data.findUsercertificate.data[0];
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('#certificate_detail_menu_toc_item_CERTIFICATES').find('#centificate-' + data._key).click();
      UserCertificate.findUsercertificate(data._key);
    })
    cy.clickButton('cancel');
  }

  function addCourses() {
    cy.get('#openCourse').click();
    UserCourse.checkUICourse();
    // UserCourse.checkValidateCourse();
    UserCourse.checkResetCourse();
    UserCourse.checkSaveCourse();
    const query = `
    query {
      findCourse(
        request: {
          collection: "user_course"
          condition: {
            user_id: "${Cypress.env('user_id')}"
            del_flag: false
            training_center: {
              attribute: "training_center"
              ref_collection: "m_training_center"
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
          name
          training_center {
            _key
            value
          }
          start_date_from
          start_date_to
          user_id
        }
        message
        errors
        status
        numData
        numError
      }
    }
    `; cy.request({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
      body: { query },
      failOnStatusCode: false,

    }).then((response) => {
      const data = response.body.data.findCourse.data[0];
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('#course_detail_menu_toc_item_COURSES').find('#course-' + data._key).click();
      UserCourse.findUserCourse(data._key);
    })
    cy.clickButton('cancel');
  }
  function addEducations() {
    cy.get('#openEducation').click();
    UserEducation.checkUIUserEdu();
    // UserEducation.checkValidUserEdu();
    UserEducation.resetFormUserEdu();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    UserEducation.checkSaveDataEdu();

    const query = `
    query {
      findUserEducationInfo(
        request: {
          collection: "user_education"
          condition: {
            user_id: "${Cypress.env('user_id')}"
            school: {
              attribute: "school"
              ref_collection: "m_school"
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
          school {
            _key
            value
          }
          field_of_study
          start_date_from
          start_date_to
        }
        message
        errors
        status
        numData
        numError
      }
    }
    `; cy.request({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
      body: { query },
      failOnStatusCode: false,

    }).then((response) => {
      console.log(response.body.data);

      const data = response.body.data.findUserEducationInfo.data[0];
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('#education_detail_menu_toc_item_EDUCATIONS').find('#education-' + data._key).click();
      UserEducation.findUserEducation(data._key);
    })
    cy.clickButton('cancel');

  }

  function addLanguages() {
    cy.get('#openLanguage').click();
    UserLanguage.checkUILanguage();
    UserLanguage.checkDataCombobox();
    // UserLanguage.checkValidateLanguage();
    UserLanguage.resetFormLanguage();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    UserLanguage.saveDataLanguage();

    const query = `
    query {
      findUserLanguageInfo(
        request: {
          collection: "user_language"
          condition: {
            user_id: "${Cypress.env('user_id')}"
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
          language {
            _key
            value
          }
          proficiency {
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
    `; cy.request({
      method: 'POST',
      url: Cypress.env('host') + Cypress.env('api_url'),
      body: { query },
      failOnStatusCode: false,

    }).then((response) => {
      const data = response.body.data.findUserLanguageInfo.data[0];
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);
      cy.get('#language_detail_menu_toc_item_LANGUAGES').find('#language-' + data._key).click();
      UserLanguage.findUserLanguage(data._key);
    })
    cy.clickButton('cancel');
  }

});