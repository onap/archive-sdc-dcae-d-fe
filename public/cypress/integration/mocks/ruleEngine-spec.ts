export const mappingTragetDDL = () => {
  return cy.get('select[data-tests-id="mappingDdl"]');
};

export const getExistRulesList = () => {
  return cy.get('option[data-tests-id="templateOptionsExist"]');
};

export const getNotExistRulesList = () => {
  return cy.get('option[data-tests-id="templateOptionsNotExist"]');
};

export const selectVersionAndTypeAndAddFirstRule = () => {
  return cy
    .get('select[data-tests-id="selectVersion"]')
    .select('4.1')
    .get('select[data-tests-id="selectEventType"]')
    .select('syslog')
    .get('button[data-tests-id="btnAddFirstRule"]')
    .click();
};

export const fillRuleDescription = text => {
  return cy
    .get('input[data-tests-id="inputDescription"]')
    .clear()
    .type(text);
};

export const addMapAndDeleteRowAction = () => {
  cy.get('select[data-tests-id="selectAction"]').select('map');
  cy.get('button[data-tests-id="btnAddAction"]').click();
  // fill map action
  cy
    .get('input[data-tests-id="valueInput"]')
    .first()
    .type('B')
    .should('have.value', 'B');

  return cy
    .get('input[data-tests-id="key"]')
    .type('Key1')
    .should('have.value', 'Key1')
    .get('input[data-tests-id="value"]')
    .type('Key1')
    .should('have.value', 'Key1')
    .get('button[data-tests-id="btn-add-row"]')
    .click()
    .get('input[data-tests-id="key"]')
    .last()
    .type('Key2')
    .should('have.value', 'Key2')
    .get('input[data-tests-id="value"]')
    .last()
    .type('Key2')
    .should('have.value', 'Key2')
    .get('button[data-tests-id="btn-add-row"]')
    .click()
    .get('input[data-tests-id="key"]')
    .last()
    .type('Key3')
    .should('have.value', 'Key3')
    .get('input[data-tests-id="value"]')
    .last()
    .type('Key3')
    .should('have.value', 'Key3')
    .get('button[data-tests-id="btn-remove-row"]')
    .last()
    .click();
};

export const addCopyAction = () => {
  return cy
    .get('select[data-tests-id="selectAction"]')
    .select('copy')
    .get('button[data-tests-id="btnAddAction"]')
    .click()
    .get('input[data-tests-id="valueInput"]')
    .type('A')
    .should('have.value', 'A')
    .get('span[data-tests-id="openTargetTree"]')
    .click()
    .get('.bottom-select')
    .should('be.visible')
    .find('.toggle-children')
    .first()
    .click()
    .get('span[data-tests-id="targetNode"]')
    .should(node => {
      expect(node.eq(0)).to.contain('commonEventHeader');
      expect(node.eq(1)).to.contain('domain');
    })
    .each(($el, index) => {
      if (index === 1) {
        cy.wrap($el).click();
      }
    });
};

export const editFirstRule = () => {
  return cy
    .get('div[data-tests-id="ruleElement"]')
    .first()
    .trigger('mouseover')
    .get('button[data-tests-id="editRule"]')
    .should('be.visible')
    .click();
};

export const editLastRule = () => {
  return cy
    .get('div[data-tests-id="ruleElement"]')
    .last()
    .trigger('mouseover')
    .get('button[data-tests-id="editRule"]')
    .should('be.visible')
    .click();
};

export const deleteFirstRule = () => {
  cy
    .get('div[data-tests-id="ruleElement"]')
    .first()
    .trigger('mouseover')
    .get('button[data-tests-id="deleteRule"]')
    .should('be.visible')
    .click()
    .get('div[data-tests-id="delete-popup"]');

  cy.deleteRule();
  return cy.get('button[data-tests-id="btnDelete"]').click();
};

export const translateValue = () => {
  return (
    '{"processing":[{"phase":"snmp_map","processors":[{"array":"varbinds","datacolumn' +
    '":"varbind_value","keycolumn":"varbind_oid","class":"SnmpConvertor"},{"phase":"s' +
    'to2","class":"RunPhase"}]},{"phase":"sto2","processors":[{"updates":{"event.comm' +
    'onEventHeader.domain":"a"},"class":"Set"}]},{"phase":"sto2","processors":[{"phas' +
    'e":"map_publish","class":"RunPhase"}]}]}'
  );
};
const NUMBER_OF_EXIST_ITEMS = 3;
const NUMBER_OF_NOT_EXIST_ITEMS = 16;
describe('Rule engine - E2E test flow with mock', () => {
  describe('Checking rules exist and not exist separation', () => {
    beforeEach(() => {
      cy.httpGenerateMappingRulesFileName();
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
      cy.fillNewMcForm();
      cy.httpCreateNewMc();
      cy.emptyRuleEngine('Type1');
      cy.get('button[data-tests-id="createMonitoring"]').click();
      cy
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
    });
    it('In exist group contain 3 visible options and not exist 16 visible', () => {
      mappingTragetDDL()
        .should('be.visible')
        .contains('json');
      getExistRulesList()
        .not('[hidden]')
        .should('have.length', NUMBER_OF_EXIST_ITEMS);
      getNotExistRulesList()
        .not('[hidden]')
        .should('have.length', NUMBER_OF_NOT_EXIST_ITEMS);
    });
  });

  describe('Mapping target select', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
      cy.fillNewMcForm();
      cy.httpCreateNewMc();
      cy.emptyRuleEngine('Type1');
      cy.get('button[data-tests-id="createMonitoring"]').click();
      cy
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
    });

    it('should exist and contain options', () => {
      mappingTragetDDL()
        .should('be.visible')
        .contains('json');
    });
  });

  describe('Fill all available Actions', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
      cy.fillNewMcForm();
      cy.httpCreateNewMc();
      cy.emptyRuleEngine('Type1');
      cy
        .get('button[data-tests-id="createMonitoring"]')
        .click()
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
      cy.httpTargetTree();
      selectVersionAndTypeAndAddFirstRule();
      fillRuleDescription('newRule');
    });

    it('add copy action', () => {
      addCopyAction();
    });

    it('add concat action', () => {
      cy.get('select[data-tests-id="selectAction"]').select('concat');
      cy.get('button[data-tests-id="btnAddAction"]').click();
      // fill concat action
      cy
        .get('input[data-tests-id="valueInput"]')
        .first()
        .type('A')
        .should('have.value', 'A');
      cy
        .get('input[data-tests-id="valueInput"]')
        .last()
        .type('B')
        .should('have.value', 'B');
      cy
        .get('span[data-tests-id="openTargetTree"]')
        .click()
        .get('.bottom-select')
        .should('be.visible')
        .find('.toggle-children')
        .first()
        .click();

      cy
        .get('span[data-tests-id="targetNode"]')
        .should(node => {
          expect(node.eq(0)).to.contain('commonEventHeader');
          expect(node.eq(1)).to.contain('domain');
        })
        .each(($el, index) => {
          if (index === 1) {
            cy.wrap($el).click();
          }
        });

      cy
        .get('input[data-tests-id="inputTarget"]')
        .should('have.value', 'event.commonEventHeader.domain');
    });

    it('add map action', () => {
      addMapAndDeleteRowAction();

      cy
        .get('span[data-tests-id="openTargetTree"]')
        .click()
        .get('.bottom-select')
        .should('be.visible')
        .find('.toggle-children')
        .first()
        .click();

      cy
        .get('span[data-tests-id="targetNode"]')
        .should(node => {
          expect(node.eq(0)).to.contain('commonEventHeader');
          expect(node.eq(1)).to.contain('domain');
        })
        .each(($el, index) => {
          if (index === 1) {
            cy.wrap($el).click();
          }
        });

      cy.get('input[data-tests-id="defaultCheckbox"]').click();
      cy.get('input[data-tests-id="defaultInput"]').type('default value');

      cy
        .get('input[data-tests-id="inputTarget"]')
        .should('have.value', 'event.commonEventHeader.domain');
    });

    it('add date-formatter action', () => {
      cy.get('select[data-tests-id="selectAction"]').select('date formatter');
      cy.get('button[data-tests-id="btnAddAction"]').click();

      // fill date-formatter action Section 1
      cy
        .get('input[data-tests-id="valueInput"]')
        .first()
        .type('A')
        .should('have.value', 'A')
        .get('span[data-tests-id="openTargetTree"]')
        .click()
        .get('.bottom-select')
        .should('be.visible')
        .find('.toggle-children')
        .first()
        .click()
        .get('span[data-tests-id="targetNode"]')
        .should(node => {
          expect(node.eq(0)).to.contain('commonEventHeader');
          expect(node.eq(1)).to.contain('domain');
        })
        .each(($el, index) => {
          if (index === 1) {
            cy.wrap($el).click();
          }
        });
      cy
        .get('input[data-tests-id="inputTarget"]')
        .should('have.value', 'event.commonEventHeader.domain');

      // Section 2
      cy
        .get('input[data-tests-id="InputFromFormat"]')
        .type('04/03/2018')
        .should('have.value', '04/03/2018')
        .get('input[data-tests-id="InputFromTimezone"]')
        .type('11:50:00')
        .should('have.value', '11:50:00')
        .get('input[data-tests-id="InputToFormat"]')
        .type('04/08/2018')
        .should('have.value', '04/08/2018')
        .get('input[data-tests-id="InputToTimezone"]')
        .type('11:50:00')
        .should('have.value', '11:50:00');
    });

    it('add conditional action', () => {
      cy
        .get('input[data-tests-id="isCondition"]')
        .click()
        .get('input[data-tests-id="left"]')
        .type('ABC')
        .should('have.value', 'ABC');

      cy
        .get('select[data-tests-id="selectOperator"]')
        .select('startsWith')
        .get('input[data-tests-id="right"]')
        .type('A')
        .should('have.value', 'A');

      cy
        .get('button[data-tests-id="addCondition"]')
        .click()
        .get('input[data-tests-id="left"]')
        .last()
        .type('DEF')
        .should('have.value', 'DEF');

      cy
        .get('select[data-tests-id="selectOperator"]')
        .last()
        .select('endsWith')
        .get('input[data-tests-id="right"]')
        .last()
        .type('F')
        .should('have.value', 'F');

      cy
        .get('button[data-tests-id="addCondition"]')
        .click()
        .get('input[data-tests-id="left"]')
        .last()
        .type('HIJ')
        .should('have.value', 'HIJ');

      cy
        .get('select[data-tests-id="selectOperator"]')
        .last()
        .select('equals')
        .get('input[data-tests-id="right"]')
        .last()
        .type('HHH')
        .should('have.value', 'HHH');

      cy
        .get('button[data-tests-id="RemoveCondition"]')
        .last()
        .click()
        .get('button[data-tests-id="addConditionGroup"]')
        .click();

      // try to delete element (1 of 2 items in group)
      cy
        .get('button[data-tests-id="RemoveCondition"]')
        .last()
        .click()
        .get('input[data-tests-id="left"]')
        .eq(2)
        .type('KLM')
        .should('have.value', 'KLM');

      cy
        .get('select[data-tests-id="selectOperator"]')
        .eq(2)
        .select('notEqual')
        .get('input[data-tests-id="right"]')
        .eq(2)
        .type('MMM')
        .should('have.value', 'MMM')
        .get('input[data-tests-id="left"]')
        .last()
        .type('NOP')
        .should('have.value', 'NOP');

      cy
        .get('select[data-tests-id="selectOperator"]')
        .last()
        .select('contains')
        .get('input[data-tests-id="right"]')
        .last()
        .type('PPP')
        .should('have.value', 'PPP');

      cy
        .get('button[data-tests-id="addCondition"]')
        .last()
        .click()
        .get('input[data-tests-id="left"]')
        .last()
        .type('QQQ')
        .should('have.value', 'QQQ');

      cy
        .get('select[data-tests-id="selectOperator"]')
        .last()
        .select('endsWith')
        .get('input[data-tests-id="right"]')
        .last()
        .type('Q')
        .should('have.value', 'Q')
        .get('button[data-tests-id="RemoveCondition"]')
        .last()
        .click();

      cy
        .get('button[data-tests-id="removeConditionNode"]')
        .last()
        .click();
    });

    it('add clear action', () => {
      cy
        .get('select[data-tests-id="selectAction"]')
        .select('clear')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('input[data-tests-id="valueInput"]')
        .type('ABC')
        .should('have.value', 'ABC');

      cy
        .get('button[data-tests-id="btnAddInput"]')
        .click()
        .get('input[data-tests-id="valueInput"]')
        .last()
        .type('DEA')
        .should('have.value', 'DEA');

      cy
        .get('button[data-tests-id="btnDelete"]')
        .first()
        .click();
    });

    it('add replace text action', () => {
      cy
        .get('select[data-tests-id="selectAction"]')
        .select('replace text')
        .get('button[data-tests-id="btnAddAction"]')
        .click();

      cy
        .get('input[data-tests-id="valueInput"]')
        .type('ABC')
        .should('have.value', 'ABC');

      cy
        .get('input[data-tests-id="InputFindWhat"]')
        .type('AAA')
        .should('have.value', 'AAA');

      cy
        .get('input[data-tests-id="InputReplaceWith"]')
        .type('BBB')
        .should('have.value', 'BBB');
    });

    it('add log text action', () => {
      cy
        .get('select[data-tests-id="selectAction"]')
        .select('log text')
        .get('button[data-tests-id="btnAddAction"]')
        .click();

      cy
        .get('input[data-tests-id="InputLogText"]')
        .type('ABC')
        .should('have.value', 'ABC');

      cy
        .get('input[data-tests-id="InputLogName"]')
        .type('AAA')
        .should('have.value', 'AAA');

      cy
        .get('input[data-tests-id="InputLogLevel"]')
        .type('BBB')
        .should('have.value', 'BBB');
    });

    it('add log event action', () => {
      cy
        .get('select[data-tests-id="selectAction"]')
        .select('log event')
        .get('button[data-tests-id="btnAddAction"]')
        .click();

      cy
        .get('input[data-tests-id="InputLogTitle"]')
        .type('Title test')
        .should('have.value', 'Title test');
    });
  });

  describe('rule and Actions CRUD Procedure', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
      cy.fillNewMcForm();
      cy.httpCreateNewMc();
      cy.emptyRuleEngine('Type1');
      cy
        .get('button[data-tests-id="createMonitoring"]')
        .click()
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
      cy.httpTargetTree();
      selectVersionAndTypeAndAddFirstRule();
      fillRuleDescription('newRule');
    });

    it('add clear action', () => {
      cy
        .get('select[data-tests-id="selectAction"]')
        .select('copy')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('select[data-tests-id="selectAction"]')
        .select('concat')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('select[data-tests-id="selectAction"]')
        .select('map')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('select[data-tests-id="selectAction"]')
        .select('date formatter')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('select[data-tests-id="selectAction"]')
        .select('log text')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('select[data-tests-id="selectAction"]')
        .select('log event')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('select[data-tests-id="selectAction"]')
        .select('replace text')
        .get('button[data-tests-id="btnAddAction"]')
        .click()
        .get('select[data-tests-id="selectAction"]')
        .select('clear')
        .get('button[data-tests-id="btnAddAction"]')
        .click();
    });

    it('add rule with copy action CRUD procedure', () => {
      // Create action
      addCopyAction();

      cy.doneSaveRule();
      cy.get('button[data-tests-id="btnDone"]').click();

      // value approve
      editFirstRule();

      cy
        .get('input[data-tests-id="valueInput"]')
        .should('have.value', 'a')
        .get('input[data-tests-id="inputTarget"]')
        .should('have.value', 'event.commonEventHeader.domain')

        // change value
        .get('input[data-tests-id="valueInput"]')
        .type('B')
        .get('button[data-tests-id="btnSave"]')
        .click();
      cy.doneSaveAndEditRule();
      cy.get('button[data-tests-id="btnDone"]').click();

      // Delete copy action
      deleteFirstRule();
    });

    it('add multiple rules CRUD procedure', () => {
      // Create actions
      addCopyAction();
      cy.doneSaveRule();
      cy.get('button[data-tests-id="btnDone"]').click();

      // Edit copy action - verify values
      editFirstRule();

      cy
        .get('input[data-tests-id="valueInput"]')
        .should('have.value', 'a')
        .get('input[data-tests-id="inputTarget"]')
        .should('have.value', 'event.commonEventHeader.domain')
        .get('button[data-tests-id="btnDone"]')
        .click();

      // Add new rule with map action
      cy.get('button[data-tests-id="addMoreRule"]').click();
      fillRuleDescription('newRule2');
      addMapAndDeleteRowAction();
      cy.doneSaveMapRule();
      cy.get('button[data-tests-id="btnDone"]').click();

      // Verify map values
      editLastRule();

      cy
        .get('input[data-tests-id="key"]')
        .first()
        .should('have.value', 'Key1')
        .get('input[data-tests-id="value"]')
        .first()
        .should('have.value', 'Key1')
        .get('input[data-tests-id="key"]')
        .last()
        .should('have.value', 'Key2')
        .get('input[data-tests-id="value"]')
        .last()
        .should('have.value', 'Key2');
      cy.get('button[data-tests-id="btnDone"]').click();

      // Delete copy Action
      deleteFirstRule();
    });

    it('add rule with log text action CRUD procedure', () => {
      cy
        .get('select[data-tests-id="selectAction"]')
        .select('log text')
        .get('button[data-tests-id="btnAddAction"]')
        .click();

      cy
        .get('input[data-tests-id="InputLogText"]')
        .type('ABC')
        .should('have.value', 'ABC');

      cy
        .get('input[data-tests-id="InputLogName"]')
        .type('AAA')
        .should('have.value', 'AAA');

      cy
        .get('input[data-tests-id="InputLogLevel"]')
        .type('BBB')
        .should('have.value', 'BBB');

      cy.doneSaveLogTextRule();
      cy.get('button[data-tests-id="btnDone"]').click();

      // value assertion
      editFirstRule();

      cy
        .get('input[data-tests-id="InputLogText"]')
        .should('have.value', 'ABC')
        .get('input[data-tests-id="InputLogName"]')
        .should('have.value', 'AAA')
        .get('input[data-tests-id="InputLogLevel"]')
        .should('have.value', 'BBB');

      cy.get('button[data-tests-id="btnDone"]').click();
    });
  });

  describe('Translate and save Rule List', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
      cy.fillNewMcForm();
      cy.httpCreateNewMc();
      cy.emptyRuleEngine('Type1');
      cy
        .get('button[data-tests-id="createMonitoring"]')
        .click()
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
      cy.httpTargetTree();
      selectVersionAndTypeAndAddFirstRule();
      fillRuleDescription('newRule');
      addCopyAction();
      cy.doneSaveRule();
    });

    context('Play with save, back and done button', () => {
      it('should rule exist in list after save rule and click back', () => {
        cy
          .get('button[data-tests-id="btnSave"]')
          .click()
          .get('a[data-tests-id="btnBackRule"]')
          .click()
          .get('div[data-tests-id="ruleElement"]')
          .should('be.visible')
          .then(function($lis) {
            expect($lis).to.have.length(1);
            expect($lis.eq(0)).to.contain('newRule');
          });
      });

      it('should rule exist in list after done edit rule', () => {
        cy
          .get('button[data-tests-id="btnDone"]')
          .click()
          .get('div[data-tests-id="ruleElement"]')
          .should('be.visible')
          .then(function($lis) {
            expect($lis).to.have.length(1);
            expect($lis.eq(0)).to.contain('newRule');
          });
      });
    });

    context('Translate', () => {
      it('should open advanced setting when translate successfuly', () => {
        cy.get('button[data-tests-id="btnDone"]').click();
        cy.httpTransalte();
        cy
          .get('button[data-tests-id="btnTranslate"]')
          .click()
          .get('.toast-container')
          .should('be.visible')
          .get('.map-setting-list > form > #Type1 > input')
          .should('be.visible')
          .and('have.value', translateValue());
      });
    });
  });
});
