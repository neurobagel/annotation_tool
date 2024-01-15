const Ajv = require('ajv');

const outputJSONFilePath = 'cypress/fixtures/examples/good/ds003653_participant_annotated_1698934398962.json';

const schemaPath = 'assets/neurobagel_data_dictionary.schema.json';


describe('Validate Output', () => {
  it('Validates example output against the schema', () => {

    const ajv = new Ajv();

    cy.readFile(schemaPath)
          .then((schema) => {

            const validate = ajv.compile(schema);

            cy.readFile(outputJSONFilePath)
              .then((outputJSONData) => {

                const isValid = validate(outputJSONData);

                if (isValid) {
                  cy.log('JSON is valid according to the schema');
                } else {
                  cy.log('JSON is not valid according to the schema');
                  cy.log(validate.errors);
                }
                cy.expect(isValid).to.be.true;
      });
    });
  });
});
