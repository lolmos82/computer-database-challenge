/// <reference types="cypress" />

describe('computer form tests', () => {
  beforeEach(() => {
    cy.visit('https://computer-database.gatling.io/computers')
  })
  
  it('creates a new computer by completing only mandatory fields', () => {
    cy.intercept('POST', '/computers')
      .as('addComputer')
    cy.get('#add').click()
    cy.url().should('include','/new')
    cy.get('#name').type("New Computer")
    cy.get('.btn.primary').click()
    cy.wait('@addComputer')
      .its('response.statusCode')
      .should('eq', 303)
    cy.get('.alert-message.warning').should('have.text','Done !  Computer New Computer has been created')
  })

  it('creates a new computer by completing all fields', () => {
    cy.intercept('POST', '/computers')
      .as('addComputer')
    cy.get('#add').click()
    cy.url().should('include','/new')
    cy.get('#name').type("New Computer")
    cy.get('#introduced').type("2022-01-25")
    cy.get('#discontinued').type("2023-01-25")
    cy.get('#company').select('Sony')
    cy.get('.btn.primary').click()
    cy.wait('@addComputer')
      .its('response.statusCode')
      .should('eq', 303)
    cy.get('.alert-message.warning').should('have.text','Done !  Computer New Computer has been created')
  })
})