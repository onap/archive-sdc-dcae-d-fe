describe('Dialog error - E2E test flow with mock', () => {
  describe('Simulate errors', () => {
    beforeEach(() => {
      cy.getMCListEmpty();
      cy.getTemplateApiError();
    });

    it('Simulate error dialog is visible', () => {
      cy.get('.ui-dialog').should('be.visible');
    });

    it('Simulate error dialog is close by cancel button', () => {
      cy.get('button[data-tests-id="error-cancel"]').click();
      cy.get('.ui-dialog').should('not.be.visible');
    });

    it('Simulate error dialog is close by X button', () => {
      cy.get('.ui-dialog-titlebar-icon').click();
      cy.get('.ui-dialog').should('not.be.visible');
    });
  });
});
