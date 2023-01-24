import { mutations } from "~/store";

let state = {};

describe("initializeColumnToCategoryMap", () => {

    beforeEach(() => {

        // Setup
        state = {

            columnToCategoryMapping: {},

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

    it("Creates a column to category map based off the data table", () => {

        // Act
        mutations.initializeColumnToCategoryMap(state, ["column1Name", "column2Name"]);

        // Assert
        expect(state.columnToCategoryMapping).to.eql({"column1Name": null, "column2Name": null});
    });

    it("Make sure that old columns are removed from newly updated map", () => {

        // Setup
        state.columnToCategoryMapping["oldColumn1"] = "category1";
        state.columnToCategoryMapping["oldColumn2"] = "category2";

        // Act
        mutations.initializeColumnToCategoryMap(state, ["column1Name", "column2Name"]);

        // Assert
        expect(state.columnToCategoryMapping).to.eql({"column1Name": null, "column2Name": null});
    });
});