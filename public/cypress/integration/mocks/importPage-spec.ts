const loadVfcmtList = () => {
  return cy
    .server()
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/SERVICES/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a/0.1/getVfcmtsForMigration',
      response: 'fixture:importVfcmt'
    })
    .as('importVfcmtList');
};

const getVfcmtRefData = data => {
  return cy
    .server()
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/getVfcmtReferenceData/cb06b8a9-c7e0-4451-a941-89fc338303c9',
      response: data
    })
    .as('vfcmtRef');
};

const getFlowType = () => {
  return cy
    .server()
    .route({
      method: 'GET',
      url: Cypress.env('backendUrl') + '/conf/composition',
      response: {
        flowTypes: ['Syslog', 'SNMP', 'FOI']
      }
    })
    .as('flowTypes');
};

const getVfniList = () => {
  return cy
    .server()
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/service/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a',
      response: 'fixture:serviceDdl'
    })
    .as('vfniListApi');
};

const importMCServerApi = () => {
  return cy
    .server()
    .route({
      method: 'POST',
      url: Cypress.env('backendUrl') + '/importMC',
      response: 'fixture:createMcRes'
    })
    .as('importMC');
};

const chooseVfcmtFromDDLWithVersion = () => {
  return cy
    .get('.ng-input > input')
    .click()
    .type('liav')
    .type('{enter}')
    .get('select[data-tests-id="vfcmtVersion"]')
    .select('0.1');
};

const getName = () => {
  return cy.get('input[data-tests-id="nameMc"]');
};
const getDescription = () => {
  return cy.get('textarea[data-tests-id="descMc"]');
};
const getFlowTypeSelect = () => {
  return cy.get('select[data-tests-id="flowTypeDdl"]');
};
const getVfniSelect = () => {
  return cy.get('select[data-tests-id="vfniDdl"]');
};
const getImportButton = () => {
  return cy.get('button[data-tests-id="importMonitoring"]');
};

describe('Import Page', () => {
  context('First step - get vfcmts list and pick one', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      loadVfcmtList();
      cy.get('button[data-tests-id="btn-import-mc"]').click();
    });

    it('should have values in ddl', () => {
      cy
        .get('ng-select')
        .should('be.visible')
        .click()
        .get('.ng-option')
        .should('contain', 7);
    });

    it('should have value on typing and press enter key', () => {
      cy
        .get('.ng-input > input')
        .click()
        .type('liav')
        .type('{enter}')
        .get('.ng-value-label')
        .should('contain', 'LiavSprint10.3');
    });

    it('should have version when pick vfcmt from list', () => {
      cy
        .get('.ng-input > input')
        .click()
        .type('liav')
        .type('{enter}')
        .get('select[data-tests-id="vfcmtVersion"]')
        .should('be.visible')
        .and('contain', '0.1');
    });
  });

  context('second step - fill fileds according to server response', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      loadVfcmtList();
      cy.get('button[data-tests-id="btn-import-mc"]').click();
    });

    it('get flow type true and service is match to context service', () => {
      getVfcmtRefData({
        serviceUuid: '06c7d927-4e2f-47e1-a29d-b6ed229ebc0a',
        name: 'test',
        description: 'test',
        flowType: 'FOI',
        vfiName: 'LiavSrv'
      });
      chooseVfcmtFromDDLWithVersion();
      getName()
        .should('have.value', 'test')
        .and('be.disabled');
      getDescription()
        .should('have.value', 'test')
        .and('be.disabled');
      getFlowTypeSelect().should('have.value', 'FOI');
      getVfniSelect().should('have.value', 'LiavSrv');
      getImportButton()
        .not('[disabled]')
        .should('not.contain', 'Disabled');
    });

    it('get flow type true but service not match', () => {
      getVfcmtRefData({
        serviceUuid: '555555-4e2f-47e1-a29d-b6ed229ebc0a',
        name: 'test',
        description: 'test',
        flowType: 'FOI',
        vfiName: 'ChcoSrv'
      });
      getVfniList();
      chooseVfcmtFromDDLWithVersion();
      getFlowTypeSelect().should('have.value', 'FOI');
    });

    it('get flow type false service match', () => {
      getVfcmtRefData({
        serviceUuid: '06c7d927-4e2f-47e1-a29d-b6ed229ebc0a',
        name: 'test',
        description: 'test',
        vfiName: 'LiavSrv'
      });
      getImportButton()
        .should('be.visible')
        .and('be.disabled');
      getFlowType();
      chooseVfcmtFromDDLWithVersion();
      getName()
        .should('have.value', 'test')
        .and('be.disabled');
      getDescription()
        .should('have.value', 'test')
        .and('be.disabled');
      getVfniSelect().should('have.value', 'LiavSrv');
    });

    it('get flow type false service not match', () => {
      getVfcmtRefData({
        serviceUuid: '555555-4e2f-47e1-a29d-b6ed229ebc0a',
        name: 'test',
        description: 'test',
        vfiName: 'ChcoSrv'
      });
      getImportButton()
        .should('be.visible')
        .and('be.disabled');
      getFlowType();
      getVfniList();
      chooseVfcmtFromDDLWithVersion();
      getName().should('have.value', '');
      getDescription().should('have.value', '');
    });
  });

  context('final step - import vfcmt and getting cdump for tabs', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      loadVfcmtList();
      cy.get('button[data-tests-id="btn-import-mc"]').click();
      getVfcmtRefData({
        serviceUuid: '06c7d927-4e2f-47e1-a29d-b6ed229ebc0a',
        name: 'test',
        description: 'test',
        flowType: 'FOI',
        vfiName: 'LiavSrv'
      });
      chooseVfcmtFromDDLWithVersion();
    });

    it('should get cdump after import and vfcmt import not visible', () => {
      importMCServerApi();
      getImportButton().click({ force: true });
      cy
        .get('.import-wrapper')
        .should('not.be.visible')
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map');
    });
  });
});
