import { getters } from "~/store";

let state = {};
getters.getColumnsForCategory = getters.getColumnsForCategory(state);

describe("isPageAccessible", () => {

    beforeEach(() => {

        // Setup
        state = {

            annotationCount: 1,

            columnToCategoryMap: {

                "column1Name": "Subject ID"
            },
            columnToToolMap: {

                "column1Name": null
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
        expect(getters.isPageAccessible(state, getters)(nextPage)).to.be.true;

        // Setup
        state.dataTable = [];

        // Assert
        expect(getters.isPageAccessible(state, getters)(nextPage)).to.be.false;
    });

    it("Test page accessibility via the categorization page", () => {

        // Setup
        let nextPage = "annotation";
        state.columnToCategoryMap["column2Name"] = "Sex";

        // Assert
        expect(getters.isPageAccessible(state, getters)(nextPage)).to.be.true;

        // Setup
        state.columnToCategoryMap = {};

        // Assert
        expect(getters.isPageAccessible(state, getters)(nextPage)).to.be.false;
    });

    it("Test page accessibility via the annotation page", () => {

        // Setup
        let nextPage = "download";

        // Assert
        expect(getters.isPageAccessible(state, getters)(nextPage)).to.be.true;

        // Setup
        state.annotationCount = 0;

        // Assert
        expect(getters.isPageAccessible(state, getters)(nextPage)).to.be.false;
    });
});
