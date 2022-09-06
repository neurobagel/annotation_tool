# Contributing Tests for the Neurobagel Annotation Tool

Our Nuxt-based annotation tool uses the Cypress JavaScript testing framework for end to end and component testing.
While Cypress is an easy to use testing framework built upon past precedents and technologies like MochaJS, below are a few of our project-specific recommendations and guidelines for the creation of tests during feature development, enhancements, and bug fixes. This information was accrued in two ways: reading Cypress documentation and firsthand experience with the framework guiding what works best for the app we have designed.

## Organization

### End to End Tests

End to end (e2e) tests are split between two folders: `app` and `page`. The `app` folder is where full and semi-e2e test files should be placed. A 'full' e2e test moves from the home page to the download page while a `semi-` e2e test may start with any page and end with any page. The idea here is to test functionality on one page, navigate through its interface, and test its output(s) on subsequent pages. The `page` folder is where page-specific tests should be placed. These are tests that are more focused on testing all of the components on a page and their interactions. For the purpose of these tests, the state of the app needed to begin testing the page is loaded programmatically (See `loadAppState` below for description.)

### Component Tests

TBD

## How to Write a Test

*1.* Determine what kind of test you're writing: end to end or component
*1a.* If creating a brand new set of tests, create a js file in the appropriate folder using the `.cy.js` file extension
*2.* Create `describe`, `context`, and `it` functions.
  - `describe` is a container function mostly used to the describe the suite of tests in the file
  - `context` is a container function used to group different kinds of tests within the file and also is used to describe that context
  - `it` defines the individual, specific test you are writing
*3.* Both `describe` and `context` can contain `beforeEach` functions that will be run before every `context` or before every `it`, respectively
  - Use the `appSetup` function in your `beforeEach` for the `describe` function. This calls a set of common app configuration commands.
*4.* Writing individual tests
  - Tests contain three primary sections: setup, action, and assert. They can be repeated as needed depending on the complexity of the test. But a good guideline to follow is to keep tests as simople as possible.
  - It is possible to work with multiple datasets for one test file. The paradigm that has been setup can be seen, for example, in `annotation-pagetests.cy.js`. The idea is that you utilize json files in the `fixtures` folder that describe each dataset and can use functions `datasetMeetsTestCriteria` and `loadAppState` to reflect both the data needs of your test and the dataset that's being used for the test.

## Further Tips

### When to use `cy.get` and if we can rely on the DOM state

Since we are using the server-side rendering version of Vue/Nuxt, it is acceptable to check the DOM for state. (In a client-side rendered app, it would not be.) Therefore we can utilize `cy.get` and its corresponding timeout time to watch for the appearance of objects on the page. However, there are other means for checking the app state. This includes checking the annotation tool Vuex store and can be done via the `getNuxtStoreValue` command.

### Making testing tests easier

Cypress also includes functionality to aid test writers iteratively develop tests and run select groups of tests in sequence.

* _.only_ and  _.skip_

This Cypress syntax allows test writers to 'only' run certain tests in a file and 'skip' others. This syntax is added directly after the `it` function name. To only run one individual test in a file, you would write `it.only(...`

## Notable files, functions, and variables

_$nuxt_

This variable is a direct reference to the Nuxt object. Though it should be used sparingly, this gives us direct access to the Vuex store that the annotation uses – and all of its actions and getters. 

_support/commands.js_

This file contains functions that are linked to the Cypress object. The idea is to place highly reused functionality here. Any function defined here using the `Cypress.Commands` syntax may be invoked within a test function via `cy.`

_assertNextPageAccess_

Since each page in the annotation tool uses a standard naming convention for the nav and next page buttons, this function is a quick means of determining of the page's requirements for proceeeding to the next one have been met.

_datasetMeetsTestCriteria_

This function takes an object specifying page-specific criteria for a test and compares it to the config json of the dataset being used (also passed in).

_dispatchToNuxtStore_ and _getNuxtStoreValue_

These functions are quick means of getting access to the Vuex store, either for calling actions or getting values via getters.
This is possible because of Cypress' access to the `$nuxt` object.

_loadAppState_

This function gets the Vuex store state to where it needs to be for a particular page. It sets up the store with desired test criteria based on the current dataset being used.









