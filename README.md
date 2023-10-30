# Testing gatling.io Computer Database with Cypress
I created this repo to practice my Cypress skills.

# Installing
```npm install```

# Run cypress tests
To run all tests from the terminal, run:
```
npx cypress run
```

If you want to specify a particular browser (must be installed on your system)
```
npx cypress run --browser <browser-name-or-path>
```

Example:
```npx cypress run --browser edge```

If you want to open Cypress UI
```
npx cypress open
```

If you want to run a particular spec.
```
npx cypress run --spec <spec-name-with-specific-path>
```
Example:
```npx cypress -run --spec .\e2e\computerFormTests.cy.js```
