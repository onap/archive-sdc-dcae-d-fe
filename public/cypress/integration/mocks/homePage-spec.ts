export const buttonCreateMC = () => {
  return cy.get('button[data-tests-id="btn-create-mc"]');
};
export const buttonCreateMCSpan = () => {
  return cy.get('span[data-tests-id="btn-span-create-mc"]');
};

export const tableItems = () => {
  return cy.get('tr[data-tests-id="monitoringComponentTableItems"]');
};

export const tableHeaders = () => {
  return cy.get('tr[data-tests-id="monitoringComponentTableHeaders"]');
};
export const tableItemsDeleteButton = () => {
  return cy.get('button[data-tests-id="tableItemsButtonDelete"]');
};

export const tableItemsInfoButton = () => {
  return cy.get('button[data-tests-id="tableItemsButtonInfo"]');
};

export const popupGetDeleteBtn = () => {
  return cy.get('button[data-tests-id="btnDelete"]');
};

export const popupGetCancelBtn = () => {
  return cy.get('button[data-tests-id="btnCancel"]');
};

export const getMonitoringConfiguration = () => {
  return cy.get('div[data-tests-id="tableItemsMonitoringConfiguration"]');
};

export const doHoverOverFirstLine = () => {
  return tableItems()
    .first()
    .trigger('mouseover');
};

export const doHoverOverFirstLineMonitoringConfiguration = () => {
  tableItems()
    .first()
    .trigger('mouseover');
  return getMonitoringConfiguration();
};

const NUMBER_OF_ITEMS = 12;

const navigateButtonDisabled = () => {
  return buttonCreateMC()
    .should('be.visible')
    .and('be.disabled')
    .get('button[data-tests-id="btn-fab-create-mc"]')
    .should('be.visible')
    .and('be.disabled');
};

describe('Home Page - E2E test flow with mock', () => {
  describe('MC List empty', () => {
    beforeEach(() => {
      cy.getMCListEmpty();
      cy.homePage();
    });

    it("Shouldn't have create table with headers", () => {
      tableHeaders().should('not.be.visible');
    });
    it("Shouldn't have create table without items", () => {
      buttonCreateMC()
        .get('div[data-tests-id="new-monitoring-title"]')
        .should('contain', 'Monitoring');
    });
  });

  describe('Check Edit Save and Submit', () => {
    beforeEach(() => {
      cy.getMCList();
      cy.homePage();
      cy.getMC();
      cy.submitMonitoringComponent();
      cy.saveMonitoringComponent();
    });

    it('Edit VFCMT', () => {
      this.doHoverOverFirstLineMonitoringConfiguration()
        .first()
        .click({ force: true });
    });
  });

  describe('MC List', () => {
    beforeEach(() => {
      cy.getMCList();
      cy.homePage();
    });

    it('Should have create button on top of the screen', () => {
      buttonCreateMC().should('be.visible');
    });

    it('Should have create table with headers', () => {
      tableHeaders().should('be.visible');
    });
    it('Should have create table with items', () => {
      tableItems().should('have.length', NUMBER_OF_ITEMS);
    });
  });

  describe('MC List Edit Tests', () => {
    beforeEach(() => {
      cy.getMCList();
      cy.homePage();
    });
  });

  describe('MC List Delete Tests', () => {
    beforeEach(() => {
      cy.getMCList();
      cy.homePage();
      cy.deleteMonitoringComponent();
      cy.deleteMonitoringComponentWithBlueprint();
    });
    it('Mouse hover over item, delete is visible, info not visible', () => {
      doHoverOverFirstLine();
      tableItemsDeleteButton().should('be.visible');
      tableItemsInfoButton().should('not.be.visible');
    });
    it('Mouse hover over item, call delete and remove not submitted (call delete without blueprint api)', () => {
      tableItems().should('have.length', NUMBER_OF_ITEMS);
      doHoverOverFirstLine();
      tableItemsDeleteButton()
        .should('be.visible')
        .click({ force: true });
      popupGetDeleteBtn().click({ force: true });
      tableItems().should('have.length', NUMBER_OF_ITEMS - 1);
    });
    it('Mouse hover over item, call delete and remove submitted (call delete with blueprint api)', () => {
      tableItems()
        .should('have.length', NUMBER_OF_ITEMS)
        .last()
        .trigger('mouseover');
      tableItemsDeleteButton()
        .should('be.visible')
        .click({ force: true });
      popupGetDeleteBtn().click({ force: true });
      tableItems().should('have.length', NUMBER_OF_ITEMS - 1);
    });
    it('Mouse hover over item, call delete and cancelOperation', () => {
      tableItems().should('have.length', NUMBER_OF_ITEMS);
      doHoverOverFirstLine();
      tableItemsDeleteButton()
        .should('be.visible')
        .click({ force: true });
      popupGetCancelBtn().click({ force: true });
      tableItems().should('have.length', NUMBER_OF_ITEMS);
    });
  });

  describe('Show Info icon', () => {
    beforeEach(() => {
      cy.getMCList();
      cy.homePageCertified();
    });
    it('Mouse hover over item, delete is not visible, info visible', () => {
      doHoverOverFirstLine();
      tableItemsInfoButton().should('be.visible');
      tableItemsDeleteButton().should('not.be.visible');
    });
  });

  describe('Successfully Entry Home Page Monitoring Configuration', () => {
    beforeEach(() => {
      cy.getMCListEmpty();
      cy.homePage();
    });

    it('Buttons looks Assertion', () => {
      buttonCreateMC()
        .should('contain', 'Create New MC')
        .and('be.visible')
        .and('not.be.disabled');

      buttonCreateMCSpan()
        .should('contain', 'Add First MC')
        .and('be.visible')
        .and('not.be.disabled');
    });

    it('Buttons Functionality Assertion', () => {
      buttonCreateMC()
        .click()
        .get('div[data-tests-id="new-monitoring-title"]')
        .should('contain', 'Monitoring');
    });
  });

  describe('Not Auth Entry Home Page Monitoring Configuration', () => {
    it('Buttons disabled when user not owner', () => {
      cy.sdcIsOwnerFalse();
      navigateButtonDisabled();
    });

    it('Buttons disabled when user not checkout', () => {
      cy.sdcUserNotCheckout();
      navigateButtonDisabled();
    });
  });
});
