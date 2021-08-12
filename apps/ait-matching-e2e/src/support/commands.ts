
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
    masterData(classes: string, parent_code?: string);
    search(url: string, keyword?: string, name?: string);
    map(array);
    label(id, value);
    input(id, value);
    typeText(idText, valueText);
    inputText();
    chooseDate(id);
    chooseMasterData(id, value);
    inputTextUserProfile();
    inputValue(id, value);
    chooseFile(id, file);
    resetForm(ids);
    errorMessage(id, value);
    textarea(id, value);
    inputTextEditJob();
    checkTextbox(id);
    styleButton(id, value);
    caption(id, note?, max_file?, caption_type?, caption?)
    inputTextCompanyInfo();
    clickButton(id);
    settingUser();
    inputClear(id, value);
    inputClearMutil(id, value);
    typeNumber(id, value);
    typeTextarea(id, value);
    chooseRadio(value);
    timeCompare(from_hour, to_hour, from_minute, to_minute, value_FH, value_TH, value_FM, value_TM, number, no);
    enterInput(id, value);
    getValueMaster(id, value);
    getValueInput(id, value);
    getValueMasterMutiple(id, value);
    getValueMasterMutipleDetail(id, value);
    getValueDate(id, value);
    getValueDateDetail(id, value);
    getValueTime(id, value);
    getValueNumber(id, value);
    getValueNumber円(id, value);
    textareaValue(id, value);
    checkMutiple(id, ele, id_other);
    getCountFile(id, value);
    status(data);
    searchRecommenced(id, value);
    clearClick(id);
    scrollTo();
    clearText(id);
    chooseMasterNotData(id, value, classMaster, parent_code?);
  }

};
//xóa text
Cypress.Commands.add('clearText', (id) => {
  cy.get('#' + id + '_input').clear()
});
//Nhập dữ liệu master data ngoài hệ thống
let dataInput;
let dataMaster;
Cypress.Commands.add('chooseMasterNotData', (id, value, classMaster, parent_code?) => {
  cy.masterData(classMaster, parent_code).then((m) => {
    const data = m;
    cy.typeText(id, value).then((e) => {
      dataInput = e.val();
      dataMaster = data.find(master => master.name === dataInput);
      if (dataMaster === undefined) {
        cy.clearText(id);
        cy.enterInput(id, value);
      } else {
        cy.get('div.autocompleteeeee ').find('div.option__container').first().click();
      }
    });
  })
});
//Chọn nhiều checkbox
Cypress.Commands.add('checkMutiple', (id, ele, id_other) => {
  cy.get('#' + id).click();
  for (let i = 0; i < ele; i++) {
    cy.get('div.option__container').eq(i).click();
  }
  cy.get('#' + id_other).click();
});
// Đăng nhập
Cypress.Commands.add('login', (email, password) => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(Cypress.env('host') + Cypress.env('sign_in'));
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  // .type('{enter}');
  cy.get('.button__submit').click();
  cy.url().should('eq', Cypress.env('host') + Cypress.env('recommenced_url'));

  // setting language ja_JP
  // cy.get('.avatar').click();
  // cy.get(':nth-child(3) > :nth-child(2) > .tab').click();
  // cy.url().should('eq', Cypress.env('host') + Cypress.env('user_setting_url'));
  // cy.settingUser();


});
//Chọn dữ liệu combobox với input nhập được xóa và có nhiều lựa chọn
Cypress.Commands.add('inputClearMutil', (id, value) => {
  cy.get('#' + id + '_input').click().clear().type(value).then(() => {
    cy.get('div.autocompleteeeee ').find('div.option__container').first().click()
  });
})
//Chọn dữ liệu combobox với input nhập được xóa và có 1 lựa chọn
Cypress.Commands.add('inputClear', (id, value) => {
  cy.get('#' + id + '_input').clear().type(value).then(() => {
    cy.get('div.option__container').click();
  });
});
// Cài đặt ngôn ngữ là tiếng nhật
let titleText;
Cypress.Commands.add('settingUser', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000)
  cy.get('#site_language_input').then((title) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    titleText = title.val();
    if (titleText === '日本語') {
      cy.inputClearMutil('timezone', '(UTC+09:00) Tokyo');
      cy.inputClearMutil('date_format_display', 'yyyy/MM/dd');
      cy.inputClearMutil('date_format_input', 'yyyy/MM/dd');
      cy.inputClearMutil('number_format', '###,###,###');
      cy.clickButton('save');
    }
    if (titleText === 'English') {
      cy.inputClearMutil('site_language', 'Japanese');
      cy.inputClearMutil('timezone', '(UTC+07:00) Hanoi');
      cy.inputClearMutil('date_format_display', 'MM/dd/yyyy');
      cy.inputClearMutil('date_format_input', 'MM/dd/yyyy');
      cy.inputClearMutil('number_format', '###,###,###');
      cy.clickButton('save');
    }
    if (titleText === 'Tiếng Việt') {
      cy.inputClearMutil('site_language', 'Tiếng Nhật');
      cy.inputClearMutil('timezone', '(UTC+07:00) Hanoi');
      cy.inputClearMutil('date_format_display', 'dd/MM/yyyy');
      cy.inputClearMutil('date_format_input', 'dd/MM/yyyy');
      cy.inputClearMutil('number_format', '###,###,###');
      cy.clickButton('save');
    }
  })
});
//check combobox lấy dữ liệu từ master data
Cypress.Commands.add('masterData', (classMaster, parent_code?) => {
  let query = `
     query {
    findSystem (request: 
      {
        collection: "sys_master_data", 
        condition: { `
  query += `del_flag: false,
              active_flag: true,`;
  query += parent_code ? `parent_code: "${parent_code}", ` : '';
  query += classMaster ? `class: {value: ["${classMaster}"]}}, ` : '';
  query += `     
        company: "${Cypress.env('company')}", 
        lang: "${Cypress.env('lang')}", 
        user_id: "${Cypress.env('user_id')}"}) 
         {
      data {
        name
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
    failOnStatusCode: false

  }).then(response => {
    return response.body.data.findSystem.data
  })
});
//Tìm kiếm với keyword
Cypress.Commands.add('search', (url, keyword?, name?) => {
  const condition = {};
  keyword ? condition['keyword'] = keyword : '';
  name ? condition['name'] = name : '';
  cy.request({
    method: 'POST',
    url: url,
    body: {
      company: `${Cypress.env('company')}`,
      condition,
      user_id: `${Cypress.env('user_id')}`,
      lang: `${Cypress.env('lang')}`
    }
  }).then(response => {
    return response.body
  })
});
// Kiểm tra title 
Cypress.Commands.add('label', (id, value) => {
  return cy.get('#' + id + '_label').should('have.text', value);
});
// Kiểm tra placeholder
Cypress.Commands.add('input', (id, value) => {
  return cy.get('#' + id + '_input').should('have.attr', 'placeholder', value);
});
// Kiểm tra giá trị ở input
Cypress.Commands.add('inputValue', (id, value) => {
  return cy.get('#' + id + '_input').should('have.value', value);
});
// Kiểm tra giá trị ở textarea
Cypress.Commands.add('textareaValue', (id, value) => {
  return cy.get('#' + id + '_textarea').should('have.value', value === null ? '' : value);
});
// Kiểm tra giá trị hiển thị của input
Cypress.Commands.add('getValueInput', (id, value) => {
  return cy.get('#' + id + '_input').should('have.value', value ? value : '');
});
// Kiểm tra giá trị hiển thị lấy từ master data
Cypress.Commands.add('getValueMaster', (id, value) => {
  return cy.get('#' + id + '_input').should('have.value', value ? value.value : '');
});
// Kiểm tra giá trị hiển thị của master data multiple ở mode chỉnh sửa
Cypress.Commands.add('getValueMasterMutiple', (id, value) => {
  return cy.get('#' + id + '_selected_items').should('have.text', value.map(e => e.value).length > 1 ? ' ' + value[0].value + `（+${value.length - 1} アイテム) ` : ' ' + value.value + ' ');
});
// Kiểm tra giá trị hiển thị của master data multiple ở chi tiết
Cypress.Commands.add('getValueMasterMutipleDetail', (id, value) => {
  return cy.get('#' + id + '_input').should('have.value', value.length > 0 ? value.length > 0 ? value.map(e => e.value).join('、') : value[0].value : '');
});
// Kiểm tra giá trị hiển thị của time
Cypress.Commands.add('getValueTime', (id, value) => {
  return cy.get('#' + id + '_input').should('have.value', value ? (typeof value === 'string' && value.length > 1) || (typeof value === 'number' && value > 9) ? value : ('0' + value) : '');
});
// Kiểm tra giá trị hiển thị của number ở mode chỉnh sửa
Cypress.Commands.add('getValueNumber', (id, value) => {
  return cy.get('#' + id + '_input_number').should('have.value', value ? new Intl.NumberFormat().format(value) : '');
});
// Kiểm tra giá trị hiển thị của number ở hiển thị
Cypress.Commands.add('getValueNumber円', (id, value) => {
  return cy.get('#' + id + '_input_number_readonly').should('have.value', value ? new Intl.NumberFormat().format(value) + '円' : '');
});

// Kiểm tra số file ảnh hiển thị del_fag = false
Cypress.Commands.add('getCountFile', (id, value) => {
  const token = window.localStorage.access_token;
  if ((value || []).length > 0) {
    let query = `
    query {  findBinaryData(request: {collection: "sys_binary_data",
        condition: {_key: {value: ${JSON.stringify(value)}}, del_flag: false}, 
        company: "${Cypress.env('company')}", 
        lang: "${Cypress.env('lang')}", 
        user_id: "${Cypress.env('user_id')}"})
      {data {     
        _key      
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
      headers: {
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false
    }).then(response => {
      const data = response.body.data.findBinaryData.data;
      return cy.get('#' + id + '_input_file').should('have.text', 'ファイル数： ' + data.length)
    })
  } else {
    return cy.get('#' + id + '_input_file').should('have.text', 'ファイル数： 0');
  }

});
// Kiểm tra giá trị hiển thị của date
Cypress.Commands.add('getValueDate', (id, value) => {
  return cy.get('#' + id + '_input').should('have.value', value ? new Date(value).toLocaleDateString("ja-JP").split('/').map(e => e.length === 1 ? '0' + e : e).join('/') : ''
  );
});

Cypress.Commands.add('getValueDateDetail', (id, value) => {
  return cy.get('#' + id + '_input').should('have.value', value ? new Date(value).toISOString().slice(0, 19).replace(/-/g, "/").substring(0, 10) : ''
  );
});
// Nhập dữ liệu input
Cypress.Commands.add('typeText', (id, value) => {
  return cy.get('#' + id + '_input').type(value);
});
// Nhập dữ liệu textarea
Cypress.Commands.add('typeTextarea', (id, value) => {
  return cy.get('#' + id + '_textarea').type(value);
});
// Nhập dữ liệu số
Cypress.Commands.add('typeNumber', (id, value) => {
  return cy.get('#' + id + '_input_number').type(value);
});
// Chọn ngày
Cypress.Commands.add('chooseDate', (id) => {
  cy.get('#' + id + '_input').click();
  cy.get('.today > .cell-content').click();
});
// Chọn dữ liệu ở master data
Cypress.Commands.add('chooseMasterData', (id, value) => {
  cy.typeText(id, value).then(() => {
    cy.get('div.autocompleteeeee ').find('div.option__container').first().click();
  })
});
// Chọn dữ liệu với kiểu radio
Cypress.Commands.add('chooseRadio', (value) => {
  cy.get('nb-radio').each((elem) => {
    if (elem[0].innerText === value) {
      cy.wrap(elem).click();
    }
  })
});
// Chọn file
Cypress.Commands.add('chooseFile', (id, file) => {
  cy.get('#' + id).attachFile(file);
});
// Reset form
Cypress.Commands.add('resetForm', (ids) => {
  cy.get(ids).each((id) => {
    return cy.get('#' + id).should('have.value', '');
  })
});
// Kiểm tra error message 
Cypress.Commands.add('errorMessage', (id, value) => {
  cy.get('#' + id + '_error_message_0').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)').and('have.text', value);
});
// Kiểm tra style button có status
Cypress.Commands.add('styleButton', (id, status, value) => {
  cy.get('#' + id + '_text_button').should(status).and('have.text', value);
});
// Kiểm tra placeholder của textarea
Cypress.Commands.add('textarea', (id, value) => {
  return cy.get('#' + id + '_textarea').should('have.attr', 'placeholder', value);
});
// Chọn 1 checkbox 
Cypress.Commands.add('checkTextbox', (id) => {
  return cy.get('#' + id + '_text_checkbox').click();
});
// Kiểm tra style button
Cypress.Commands.add('styleButton', (id, value) => {
  cy.get('#' + id + '_text_button').should('have.text', value);
});
// Kiểm tra caption
Cypress.Commands.add('caption', (id, note?, max_file?, caption_type?, caption?) => {
  note ? cy.get('#' + id + '_note').should('have.text', note) : '';
  max_file ? cy.get('#' + id + '_max_file').should('have.text', max_file) : '';
  caption_type ? cy.get('#' + id + '_caption_type').should('have.text', caption_type) : '';
  caption ? cy.get('#' + id + '_caption').should('have.text', caption) : '';
});
// Chọn button
Cypress.Commands.add('clickButton', (id) => {
  cy.get('#' + id + '_text_button').click();
});
// Sự kiện enter sau khi nhập
Cypress.Commands.add('enterInput', (id, value) => {
  cy.get('#' + id + '_input').type(value + '{enter}');
});
// So sánh time 
Cypress.Commands.add('timeCompare', (from_hour, to_hour, from_minute, to_minute, value_FH, value_TH, value_FM, value_TM, number, no) => {
  cy.enterInput(from_hour, value_FH);
  cy.enterInput(to_hour, value_TH);
  cy.enterInput(from_minute, value_FM);
  cy.enterInput(to_minute, value_TM);

  if (value_FH > value_TH) {
    cy.errorMessage('shift_' + number, ' ' + no + '勤務時間' + number + '（時）' + '以下の値で' + no + '勤務時間' + number + '（時）' + 'を入力してください。');
  }
  if ((value_FH === value_TH) && (value_FM > value_TM)) {
    cy.errorMessage('shift_' + number, ' ' + no + '勤務時間' + number + '（分）' + '以下の値で' + no + '勤務時間' + number + '（分）' + 'を入力してください。');
  }
  else {
    cy.get('shift_' + number + '_errorMessage_0').should('not.exist');
  }

});
//Tìm kiếm ở recommenced
Cypress.Commands.add('searchRecommenced', (id, value) => {
  cy.get('#' + id + '_input').type(value).then(() => {
    cy.get('div.option__container').click();
    cy.get('.scrollable-container').scrollTo('top', 600);
  });
})
//Xóa và Chọn
Cypress.Commands.add('clearClick', (id) => {
  cy.get('#' + id + '_input').clear();
  cy.get('#' + id + '_input').click();
})
//Kéo
Cypress.Commands.add('scrollTo', () => {
  cy.get('.scrollable-container').scrollTo('top');
})
// Dữ liệu trả về status 
Cypress.Commands.add('status', (data) => {
  expect(data).to.eq(200);
});


