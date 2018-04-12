declare namespace Cypress {
  interface Chainable {
    getTemplateApiError: typeof getTemplateApiError;
  }
}

function getTemplateApiError(): void {
  cy.server().route({
    method: 'GET',
    url:
      Cypress.env('backendUrl') +
      '/service/06c7d927-4e2f-47e1-a29d-b6ed229ebc0a',
    status: 500,
    response: {
      requestError: {
        policyException: {
          messageId: 'POL5000',
          text: 'Error: Internal Server Error. Please try again later.',
          variables: [],
          formattedErrorMessage:
            'Error: Internal Server Error. Please try again later.'
        }
      },
      notes: 'Error: Requested "123" resource was not found.'
    }
  });
  cy.homePage();
  cy.get('button[data-tests-id="btn-create-mc"]').click();
}

Cypress.Commands.add('getTemplateApiError', getTemplateApiError);
