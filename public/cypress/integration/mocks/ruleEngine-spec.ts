export const mappingTragetDDL = () => {
  return cy.get('select[data-tests-id="mappingDdl"]');
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

export const fillRuleDecription = text => {
  return cy
    .get('input[data-tests-id="inputDescription"]')
    .clear()
    .type(text);
};

export const addCopyAction = () => {
  return cy
    .get('select[data-tests-id="selectAction"]')
    .select('copy')
    .get('button[data-tests-id="btnAddAction"]')
    .click()
    .get('input[data-tests-id="valueInput"]')
    .type('A')
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

export const translateValue = () => {
  return '{"processing":[{"phase":"snmp_map","processors":[{"array":"varbinds","datacolumn":"varbind_value","keycolumn":"varbind_oid","class":"SnmpConvertor"},{"phase":"sto2","class":"RunPhase"}]},{"phase":"sto2","processors":[{"updates":{"event.commonEventHeader.domain":"a"},"class":"Set"}]},{"phase":"sto2","processors":[{"phase":"map_publish","class":"RunPhase"}]}]}';
};

describe('Rule engine - E2E test flow with mock', () => {
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

    it('should page refrash after change select value in mapping target ddl', () => {
      cy.httpTargetTree();
      cy
        .get('select[data-tests-id="selectVersion"]')
        .select('4.1')
        .get('select[data-tests-id="selectEventType"]')
        .select('syslog')
        .get('button[data-tests-id="btnAddFirstRule"]')
        .should('be.visible');
      cy.emptyRuleEngine('json');
      mappingTragetDDL()
        .select('json')
        .get('select[data-tests-id="selectVersion"]')
        .should('have.value', null);
    });
  });

  describe('Translate And Save Rule List', () => {
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
      fillRuleDecription('newRule');
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
          .get('.map-setting-list > #Type1 > input')
          .should('be.visible')
          .and('have.value', translateValue());
      });
    });
  });
});
