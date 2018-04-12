declare namespace Cypress {
  interface Chainable {
    httpGetDDLData: typeof httpGetDDLData;
    fillNewMcForm: typeof fillNewMcForm;
    httpCreateNewMc: typeof httpCreateNewMc;
  }
}

function httpGetDDLData(): void {
  cy
    .server()
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/service/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a',
      response: 'fixture:serviceDdl'
    })
    .as('vfniListApi')
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') + '/getResourcesByMonitoringTemplateCategory',
      response: [{ name: 'AviStone1234' }]
    })
    .as('templateAPi');
}

function fillNewMcForm() {
  cy.get('input[data-tests-id="nameMc"]').type('new mc');
  cy.get('textarea[data-tests-id="descMc"]').type('Hello Description');
  cy.get('select[data-tests-id="templateDdl"]').select('AviStone1234');
  cy.get('select[data-tests-id="vfniDdl"]').select('LiavSrv');
}

function httpCreateNewMc() {
  cy.server();
  cy
    .route({
      method: 'POST',
      url: Cypress.env('backendUrl') + '/createMC',
      response: 'fixture:createMcRes'
    })
    .as('newMC');
}

// Add cypress commands
Cypress.Commands.add('httpGetDDLData', httpGetDDLData);
Cypress.Commands.add('fillNewMcForm', fillNewMcForm);
Cypress.Commands.add('httpCreateNewMc', httpCreateNewMc);
