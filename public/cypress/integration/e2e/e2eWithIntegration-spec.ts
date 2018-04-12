const randomNodeName = () =>
  Math.random()
    .toString(36)
    .substr(2, 7);
const NODE_NAME = randomNodeName();

const serverGetDDLData = () => {
  return cy
    .server()
    .route(
      'GET',
      Cypress.env('backendUrl') + '/getResourcesByMonitoringTemplateCategory'
    )
    .as('templateAPi')
    .route(
      'GET',
      Cypress.env('backendUrl') +
        '/service/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a'
    )
    .as('vfniListAPi');
};

const saveAndDoneHttp = () => {
  cy.server();
  cy
    .route({
      method: 'POST',
      url: Cypress.env('backendUrl') + '/rule-editor/rule/**/**/**/**'
    })
    .as('doneSaveCopyRule');
};

const createNewMC = () => {
  cy
    .get('input[data-tests-id="nameMc"]')
    .type(`Hello${NODE_NAME}`)
    .get('textarea[data-tests-id="descMc"]')
    .type('Hello Description')
    .get('select[data-tests-id="templateDdl"]')
    .then($els => {
      const opt = $els.find('option');
      const first = opt.get(1) as any;
      return $els.val(first.value);
    })
    .trigger('change')
    .get('select[data-tests-id="vfniDdl"]')
    .then($els => {
      const opt = $els.find('option');
      const first = opt.get(1) as any;
      return $els.val(first.value);
    })
    .trigger('change')
    .get('button[data-tests-id="createMonitoring"]')
    .not('[disabled]')
    .should('not.contain', 'Disabled');
  cy
    .server()
    .route({
      method: 'POST',
      url: Cypress.env('backendUrl') + '/createMC'
    })
    .as('newMC')
    .get('button[data-tests-id="createMonitoring"]')
    .click()
    .wait('@newMC');
};

import { buttonCreateMC } from '../mocks/homePage-spec';
import {
  selectVersionAndTypeAndAddFirstRule,
  fillRuleDecription,
  addCopyAction,
  editFirstRule
} from '../mocks/ruleEngine-spec';

describe('DCAED - forntend e2e and inagration test', () => {
  context('Empty Monitoring Configuration list for service', () => {
    it('Loads', () => {
      cy.homePage();
    });
  });

  context('Create new monitoring configuration', () => {
    beforeEach(() => {
      serverGetDDLData();
      cy.homePage();
      buttonCreateMC()
        .click()
        .wait(['@templateAPi', '@vfniListAPi']);
    });

    it('After api call success verify create button is disabled', () => {
      cy
        .get('button[data-tests-id="createMonitoring"]')
        .should('be.visible')
        .and('be.disabled');
    });

    it('click on create mc - more then one tab should be visible', () => {
      createNewMC();
      cy
        .get('ul[p-tabviewnav]')
        .children()
        .should($el => {
          expect($el.length).to.be.greaterThan(1);
        });
    });

    it('should enter rule engine in map tab and create new rule', () => {
      createNewMC();
      cy
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
      selectVersionAndTypeAndAddFirstRule();
      fillRuleDecription('newRule');
      addCopyAction();
      saveAndDoneHttp();
      cy.get('button[data-tests-id="btnDone"]').click();
      cy
        .wait('@doneSaveCopyRule')
        .get('div[data-tests-id="ruleElement"]')
        .should('be.visible')
        .then(function($lis) {
          expect($lis).to.have.length(1);
          expect($lis.eq(0)).to.contain('newRule');
        });
      editFirstRule();
      fillRuleDecription('LiavRule');
      saveAndDoneHttp();
      cy
        .get('button[data-tests-id="btnSave"]')
        .click()
        .wait('@doneSaveCopyRule')
        .get('a[data-tests-id="btnBackRule"]')
        .click()
        .get('div[data-tests-id="ruleElement"]')
        .should('be.visible')
        .then(function($lis) {
          expect($lis).to.have.length(1);
          expect($lis.eq(0)).to.contain('LiavRule');
        });
    });
  });
});
