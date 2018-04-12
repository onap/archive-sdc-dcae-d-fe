declare namespace Cypress {
  interface Chainable {
    emptyRuleEngine: typeof emptyRuleEngine;
    httpTargetTree: typeof httpTargetTree;
    doneSaveRule: typeof doneSaveRule;
    httpTransalte: typeof httpTransalte;
  }
}

function emptyRuleEngine(targetFiled) {
  cy.server();
  cy
    .route({
      method: 'GET',
      url: `${Cypress.env(
        'backendUrl'
      )}/rule-editor/rule/6d436c07-8006-4335-8c84-d65b4740f8d6/map/n.1517823219961.0/${targetFiled}`,
      response: {}
    })
    .as('serverRuleList')
    .route({
      method: 'GET',
      url: Cypress.env('backendUrl') + '/rule-editor/list-events-by-versions',
      response: 'fixture:list-events-by-version'
    })
    .as('serverEventsAndVersion');
}

function httpTargetTree() {
  cy.server();
  cy
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') + '/rule-editor/definition/4.1/syslogFields',
      response: 'fixture:syslogTargetTree'
    })
    .as('targetData');
}

function doneSaveRule() {
  cy.server();
  cy
    .route({
      method: 'POST',
      url:
        Cypress.env('backendUrl') +
        '/rule-editor/rule/6d436c07-8006-4335-8c84-d65b4740f8d6/map/n.1517823219961.0/Type1',
      response: 'fixture:doneSaveSimpleCopy'
    })
    .as('doneSaveCopyRule');
}

function httpTransalte() {
  cy.server();
  cy
    .route({
      method: 'GET',
      url:
        Cypress.env('backendUrl') +
        '/rule-editor/rule/translate/6d436c07-8006-4335-8c84-d65b4740f8d6/map/n.1517823219961.0/Type1',
      response: 'fixture:TranslateSimpleCopy'
    })
    .as('TranslateSimpleCopy');
}

// Add cypress commands
Cypress.Commands.add('emptyRuleEngine', emptyRuleEngine);
Cypress.Commands.add('httpTargetTree', httpTargetTree);
Cypress.Commands.add('doneSaveRule', doneSaveRule);
Cypress.Commands.add('httpTransalte', httpTransalte);
