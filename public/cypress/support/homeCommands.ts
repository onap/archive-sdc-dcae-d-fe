declare namespace Cypress {
  interface Chainable {
    homePage: typeof homePage;
    homePageCertified: typeof homePageCertified;
    sdcIsOwnerFalse: typeof sdcIsOwnerFalse;
    sdcUserNotCheckout: typeof sdcUserNotCheckout;
    getMCList: typeof getMCList;
    getMCListEmpty: typeof getMCListEmpty;
    deleteMonitoringComponent: typeof deleteMonitoringComponent;
    deleteMonitoringComponentWithBlueprint: typeof deleteMonitoringComponentWithBlueprint;
    submitMonitoringComponent: typeof submitMonitoringComponent;
    saveMonitoringComponent: typeof saveMonitoringComponent;
    getMC: typeof getMC;
  }
}

// functionality
function sdcIsOwnerFalse(): void {
  cy.visit(
    'home?userId=cs0008&userRole=DESIGNER&displayType=context&contextType=SERVICE&uuid=b1645734-b812-4cd7-a0cc-5b5843940ad6&lifecycleState=NOT_CERTIFIED_CHECKOUT&isOwner=false'
  );
}

function sdcUserNotCheckout(): void {
  cy.visit(
    'home?userId=cs0008&userRole=DESIGNER&displayType=context&contextType=SERVICE&uuid=b1645734-b812-4cd7-a0cc-5b5843940ad6&lifecycleState=READY_FOR_CERTIFICATION&isOwner=true'
  );
}

function homePage(): void {
  cy.visit(
    'home?userId=cs0008&userRole=DESIGNER&displayType=context&contextType=SERVICES&uuid=06c7d927-4e2f-47e1-a29d-b6ed229ebc0a&lifecycleState=NOT_CERTIFIED_CHECKOUT&isOwner=true&version=0.1'
  );
}

function homePageCertified(): void {
  cy.visit(
    'home?userId=cs0008&userRole=DESIGNER&displayType=context&contextType=SERVICES&uuid=06c7d927-4e2f-47e1-a29d-b6ed229ebc0a&lifecycleState=CERTIFIED_CHECKOUT&isOwner=true&version=0.1'
  );
}

function deleteMonitoringComponent(): void {
  cy
    .server()
    .route({
      method: 'DELETE',
      url:
        Cypress.env('backendUrl') +
        '/SERVICES/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a/vfb53dd48360ff4fa2b66e6ceb1961bd9b0/cba37ed8-94e1-406f-b4f5-b5edbc31ac85/deleteVfcmtReference',
      response: '{}'
    })
    .as('deleteMonitoringComponent');
}

function saveMonitoringComponent(): void {
  cy
    .server()
    .route({
      method: 'POST',
      url:
        Cypress.env('backendUrl') +
        '/SERVICES/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a/vfb53dd48360ff4fa2b66e6ceb1961bd9b0/saveComposition/cba37ed8-94e1-406f-b4f5-b5edbc31ac85',
      response: '{}'
    })
    .as('saveMonitoringComponent');
}

function submitMonitoringComponent(): void {
  cy
    .server()
    .route({
      method: 'POST',
      url:
        Cypress.env('backendUrl') +
        '/SERVICES/createBluePrint/cba37ed8-94e1-406f-b4f5-b5edbc31ac85/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a/vfb53dd48360ff4fa2b66e6ceb1961bd9b0/',
      response: '{}'
    })
    .as('submitMonitoringComponent');
}

function deleteMonitoringComponentWithBlueprint(): void {
  cy
    .server()
    .route({
      method: 'DELETE',
      url:
        Cypress.env('backendUrl') +
        '/SERVICES/teSt.__.monitoring---TempLATE.6hnc/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a/dump0/64471437-8feb-40d9-a8b0-9407a81dd5c0/deleteVfcmtReference',
      response: '{}'
    })
    .as('deleteMonitoringComponentWithBlueprint');
}

function getMCList(): void {
  cy
    .server()
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/SERVICES/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a/0.1/monitoringComponents',
      response: 'fixture:monitoringComponentsMock'
    })
    .as('mcList');
}

function getMC(): void {
  cy
    .server()
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/getMC/cba37ed8-94e1-406f-b4f5-b5edbc31ac85',
      response: 'fixture:getMCMock'
    })
    .as('getMC');
}

function getMCListEmpty(): void {
  cy
    .server()
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/SERVICES/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a/0.1/monitoringComponents',
      response: '{}'
    })
    .as('mcListEmpty');
}

// Add cypress commands
Cypress.Commands.add('homePage', homePage);
Cypress.Commands.add('homePageCertified', homePageCertified);
Cypress.Commands.add('sdcIsOwnerFalse', sdcIsOwnerFalse);
Cypress.Commands.add('sdcUserNotCheckout', sdcUserNotCheckout);
Cypress.Commands.add('getMCList', getMCList);
Cypress.Commands.add('getMCListEmpty', getMCListEmpty);
Cypress.Commands.add('deleteMonitoringComponent', deleteMonitoringComponent);
Cypress.Commands.add(
  'deleteMonitoringComponentWithBlueprint',
  deleteMonitoringComponentWithBlueprint
);
Cypress.Commands.add('submitMonitoringComponent', submitMonitoringComponent);
Cypress.Commands.add('saveMonitoringComponent', saveMonitoringComponent);
Cypress.Commands.add('getMC', getMC);
