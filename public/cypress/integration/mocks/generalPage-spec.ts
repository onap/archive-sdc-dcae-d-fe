describe('General Page - E2E test flow with mock', () => {
  describe('Check Boolean DDL', () => {
    beforeEach(() => {
      cy.httpGenerateMappingRulesFileName();
      cy.httpGetDDLData();
      cy.httpCreateNewMcWithBooleanDDL();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
    });

    it(
      'Check boolean DDL with value undefined - using true, true - using true and false' +
        ' - using false.',
      () => {
        cy.fillNewMcForm();
        cy
          .get('button[data-tests-id="createMonitoring"]')
          .as('createButton')
          .not('[disabled]')
          .should('not.contain', 'Disabled');

        cy.httpCreateNewMcWithBooleanDDL();
        cy.emptyRuleEngine('Type1');

        cy.get('@createButton').click();
        cy
          .get('#ui-tabpanel-1-label')
          .should('contain', 'map')
          .click();
        cy
          .get('button[data-tests-id="setting-gear"]')
          .should('be.visible')
          .first()
          .click({ multiple: true });

        cy
          .get('.map-setting-list #mappingType > .field-text')
          .should('have.value', 'multiple');
        cy
          .get('.map-setting-list > form > #valueUndefined > select')
          .should('have.value', 'true');
        cy
          .get('.map-setting-list > form > #valueTrue > select')
          .should('have.value', 'true');
        cy
          .get('.map-setting-list > form > #valueFalse > select')
          .should('have.value', 'false');
      }
    );
  });

  describe('Create new MC', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
    });

    it('Create button need to be disabled', () => {
      cy
        .get('button[data-tests-id="createMonitoring"]')
        .should('be.visible')
        .and('be.disabled');
    });

    it('After submit advenced setting description exist in first input', () => {
      cy.fillNewMcForm();
      cy
        .get('button[data-tests-id="createMonitoring"]')
        .as('createButton')
        .not('[disabled]')
        .should('not.contain', 'Disabled');

      cy.httpCreateNewMc();
      cy.emptyRuleEngine('Type1');

      cy.get('@createButton').click();
      cy
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
      cy
        .get('button[data-tests-id="setting-gear"]')
        .should('be.visible')
        .first()
        .click({ multiple: true });

      cy
        .get('.map-setting-list #Type1 .help-description')
        .trigger('mouseenter')
        .get('.ui-tooltip')
        .should('be.visible')
        .should(
          'contain',
          'CSV to VES mapping, from the file to generate multiple events or single event'
        );
    });

    it('Fill form then click to submit verify setting button and constrain ddl', () => {
      cy.fillNewMcForm();
      cy
        .get('button[data-tests-id="createMonitoring"]')
        .as('createButton')
        .not('[disabled]')
        .should('not.contain', 'Disabled');

      cy.httpCreateNewMc();
      cy.emptyRuleEngine('Type1');

      cy.get('@createButton').click();
      cy
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
      cy
        .get('button[data-tests-id="setting-gear"]')
        .should('be.visible')
        .first()
        .click({ multiple: true });

      cy
        .get('.map-setting-list #mappingType > .field-text')
        .should('have.value', 'multiple');
    });
  });

  describe('Flow diagram', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
      cy.fillNewMcForm();
      cy.httpCreateNewMc();
      cy.get('button[data-tests-id="createMonitoring"]').click();
    });

    it.only('should flow diagram need to exist', () => {
      cy.get('#diagram').should('be.visible');
    });

    it('should flow diagram need to contain 4 connections', () => {
      cy
        .get('#diagram line')
        .its('length')
        .should('be.equal', 4);
    });
  });

  describe('Tabs after MC created', () => {
    beforeEach(() => {
      cy.httpGetDDLData();
      cy.getMCListEmpty();
      cy.homePage();
      cy.get('button[data-tests-id="btn-create-mc"]').click();
      cy.fillNewMcForm();
      cy.httpCreateNewMc();
      cy.get('button[data-tests-id="createMonitoring"]').click();
    });

    it('should have 4 icon buttons in map tab', () => {
      cy
        .get('#ui-tabpanel-1-label')
        .should('contain', 'map')
        .click();
      cy
        .get('.map-bar-icon-container>button')
        .should('have.length', 2)
        .get('.map-bar-icon-container>div>button')
        .should('have.length', 2)
        .and('be.visible');
    });

    it('should have 2 icon buttons in supplement tab', () => {
      cy
        .get('#ui-tabpanel-2-label')
        .should('contain', 'supplement')
        .click();
      cy
        .get('.supplement-bar-icon-container>button')
        .should('have.length', 2)
        .and('be.visible')
        .get('.supplement-bar-icon-container')
        .children()
        .should('have.length', 3);
    });
  });
});
