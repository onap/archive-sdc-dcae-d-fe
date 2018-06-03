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
    .route('GET', Cypress.env('backendUrl') + '/service/**')
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
  fillRuleDescription,
  addCopyAction,
  editFirstRule
} from '../mocks/ruleEngine-spec';
describe('DCAED - forntend e2e and inagration test ', () => {
  // context(('home page'), () => {   it.only('should open env', () => {     cy
  // .visit('https://www.e-access.att.com/DevOps02/sdc1/portal#!/dashboard')
  // .get(':nth-child(2) > :nth-child(1) > [border="0"][width="100%"] >
  // :nth-child(1) > :nt' +           'h-child(1) > td > input') .type('ym903w')
  //     .get(':nth-child(3) > td > input') .type('Apple1qazxsw2')
  // .get('[border="0"][width="100%"] > :nth-child(1) > :nth-child(5) > td >
  // input')       .click()       .get('#srv_successok > input')       .click()
  //    .get(':nth-child(1) > .w-sdc-dashboard-card-new-content')
  // .trigger('mouseover') .get('button[data-tests-id="createServiceButton"]')
  //   .click() .get('input[data-tests-id="name"]')
  // .type(`DCAE_SRV_${NODE_NAME}`)
  // .get('select[data-tests-id="selectGeneralCategory"]') .select('Mobility')
  //   .get('textarea[data-tests-id="description"]') .type('bla')
  // .get('input[data-tests-id="projectCode"]') .type('att01')
  // .get('button[data-tests-id="create/save"]') .click()
  // .get('div[data-tests-id="CompositionLeftSideMenu"]') .click()   }); });

  context('Empty Monitoring Configuration list for service ', () => {
    it(' Loads ', () => {
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

    // it('click on create mc - more then one tab should be visible', () => {
    // createNewMC();   cy     .get('ul[p-tabviewnav]')     .children()
    // .should($el => {       expect($el.length).to.be.greaterThan(1);     }); });
    // it('should enter rule engine in map tab and create new rule', () => {
    // createNewMC();   cy     .get('#ui-tabpanel-1-label')     .should('contain',
    // 'map')     .click();   selectVersionAndTypeAndAddFirstRule();
    // fillRuleDescription('newRule');   addCopyAction();   saveAndDoneHttp();
    // cy.get('button[data-tests-id="btnDone"]').click();   cy
    // .wait('@doneSaveCopyRule')     .get('div[data-tests-id="ruleElement"]')
    // .should('be.visible')     .then(function($lis) {
    // expect($lis).to.have.length(1);
    // expect($lis.eq(0)).to.contain('newRule');     });   editFirstRule();
    // fillRuleDescription('LiavRule');   saveAndDoneHttp();   cy
    // .get('button[data-tests-id="btnSave"]')     .click()
    // .wait('@doneSaveCopyRule')     .get('a[data-tests-id="btnBackRule"]')
    // .click()     .get('div[data-tests-id="ruleElement"]')
    // .should('be.visible')     .then(function($lis) {
    // expect($lis).to.have.length(1);
    // expect($lis.eq(0)).to.contain('LiavRule');     }); });
  });
});
