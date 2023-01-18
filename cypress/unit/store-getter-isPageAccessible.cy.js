import { getters } from "~/store/index";

let state = {};

describe("isPageAccessible", () => {

    beforeEach(() => {

        // Setup
        state = {

            annotationCount: 1,

            columnToCategoryMap: {

                "column1Name": "Subject ID"
            },

            dataTable: [

                {
                    "column1Name": "value1", "column2Name": "value2"
                },
                {
                    "column1Name": "value3", "column2Name": "value4"
                }
            ]
        };
    });

    it("Test page accessibility via the index page", () => {

        // Setup
        let nextPage = "categorization";

        // Assert
        expect(getters.isPageAccessible(state, nextPage)).to.be.true;

        // Setup
        state.dataTable = [];

        // Assert
        expect(getters.isPageAccessible(state, nextPage)).to.be.false;
    });

    it("Test page accessibility via the categorization page", () => {

        // Setup
        let nextPage = "annotation";

        // Assert
        expect(getters.isPageAccessible(state, nextPage)).to.be.true;

        // Setup
        state.columnToCategoryMap = {};

        // Assert
        expect(getters.isPageAccessible(state, nextPage)).to.be.false;
    });

    it("Test page accessibility via the annotation page", () => {

        // Setup
        let nextPage = "download";

        // Assert
        expect(getters.isPageAccessible(state, nextPage)).to.be.true;

        // Setup
        state.annotationCount = 0;

        // Assert
        expect(getters.isPageAccessible(state, nextPage)).to.be.false;
    });
});