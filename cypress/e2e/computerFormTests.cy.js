/// <reference types="cypress" />

const dateFormatErrorText = "Failed to decode date : java.time.format.DateTimeParseException:"
const newComputerName = "Test Computer"

describe('computer form tests', () => {
  beforeEach(() => {
    cy.visit('https://computer-database.gatling.io/computers')
  })
  
  it('creates a new computer by completing only mandatory fields', () => {
    cy.intercept('POST', '/computers')
      .as('addComputer')
    cy.get('#add').click()
    cy.url().should('include','/new')
    cy.get('#name').type(newComputerName)
    cy.get('.btn.primary').click()
    cy.wait('@addComputer')
      .its('response.statusCode')
      .should('eq', 303)
    cy.get('.alert-message.warning').should('have.text',`Done !  Computer ${newComputerName} has been created`)
  })

  it('creates a new computer by completing all fields', () => {
    cy.intercept('POST', '/computers')
      .as('addComputer')
    cy.get('#add').click()
    cy.url().should('include','/new')
    cy.get('#name').type(newComputerName)
    cy.get('#introduced').type("2022-01-25")
    cy.get('#discontinued').type("2023-01-25")
    cy.get('#company').select('Sony')
    cy.get('.btn.primary').click()
    cy.wait('@addComputer')
      .its('response.statusCode')
      .should('eq', 303)
    cy.get('.alert-message.warning').should('have.text',`Done !  Computer ${newComputerName} has been created`)
  })
  
  it('cant create without mandatory fields', () => {
    cy.get('#add').click()
    cy.intercept('POST', '/computers')
      .as('cancelAdd')
    cy.url().should('include','/new')
    cy.get('.btn.primary').click()
    cy.wait('@cancelAdd')
      .its('response.statusCode')
      .should('eq', 400)
    cy.get('.error > .input > .help-inline').should('have.text','Failed to refine type : Predicate isEmpty() did not fail.')
  })

  it('can cancel adding a new computer', () => {
    cy.get('#add').click()
    cy.url().should('include','/new')
    cy.get('#name').type(newComputerName)
    cy.get('a.btn').click()
    cy.url().should('not.include', '/new')
  })

  it('can delete a computer', () => {
    cy.intercept('POST', '/computers/381/delete')
      .as('deleteComputer')
    cy.get('tbody > :nth-child(1) > :nth-child(1) > a').click()
    cy.get('.btn.danger').click({force: true})
    cy.wait('@deleteComputer')
      .its('response.statusCode')
      .should('eq', 303)
    cy.get('.alert-message').should('be.visible').should('have.text','Done !  Computer ACE has been deleted')
  })

  it('can edit a computer', () => {
    cy.intercept('POST', '/computers/381')
      .as('editComputer')
    cy.get('tbody > :nth-child(1) > :nth-child(1) > a').click()
    cy.get('#company').select('Sony')
    cy.get('.btn.primary').click()
    cy.wait('@editComputer')
      .its('response.statusCode')
      .should('eq', 303)
    cy.get('.alert-message.warning').should('be.visible')
            .contains('has been updated')
    cy.url().should('not.include', '/381')
  })
})

//Tests to validate data entered on the date fields
describe('Validate date inputs', () => {
  beforeEach(() => {
      cy.visit('https://computer-database.gatling.io/computers')
  })

  const datesInvalidFormat = ["01-25-2023","25-01-2023","2023-25-01","23-01-25","abc123"]

  datesInvalidFormat.forEach((datesInvalidFormat) => {
    it(`validates Introduced field date is valid: ${datesInvalidFormat}`, () => {
      cy.get('#add').click()
      cy.get('#name').type(newComputerName)
      cy.get('#introduced').type(datesInvalidFormat)
      cy.get('.btn.primary').click()
      cy.get('.error > .input > .help-inline').should('contain', dateFormatErrorText)
      })

    it(`validates Discontinued field date is valid: ${datesInvalidFormat}`, () => {
      cy.get('#add').click()
      cy.get('#name').type(newComputerName)
      cy.get('#discontinued').type(datesInvalidFormat)
      cy.get('.btn.primary').click()
      cy.get('.error > .input > .help-inline').should('contain', dateFormatErrorText)
      })
  })
})
