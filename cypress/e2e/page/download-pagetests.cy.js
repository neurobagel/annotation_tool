describe("tests on download page ui via programmatic state loading and store interaction", () => {

    // List of datasets to use for these tests
    const datasets = [

        // Good data
        require("../../fixtures/tests/good-test-config.json")

        // NOTE: Add more dataset json files here via 'require'
    ];

    beforeEach(() => {

        // Standard app setup
        cy.appSetup();
    });

    datasets.forEach((p_dataset) => {

        context("download page tests with " + p_dataset.description + " data", () => {

            beforeEach(() => {

            });

            it("", () => {

            });

            it("", () => {

            });

            it("", () => {

            });

            it("", () => {

            });

            it("", () => {

            });
        });

    });

});