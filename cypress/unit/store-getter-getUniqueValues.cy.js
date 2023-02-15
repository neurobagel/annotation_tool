import { getters } from "~/store";

let store;

describe("getUniqueValues getter", () => {

    beforeEach(() => {

        store = {

            state: {

                columnToCategoryMapping: {

                    column1: "Diagnosis",
                    column2: "Age"
                },

                dataTable: [

                    { column1: 1, column2: "column2_value1" },
                    { column1: 2, column2: "column2_value2" },
                    { column1: 1, column2: "column2_value3" },
                    { column1: 3, column2: "column2_value2" }
                ]
            }
        };
    });

    it("Retrieves unique values of a single column", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store)("Diagnosis");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column1": [1, 2, 3]});
    });

    it("Retrieves unique values of a multiple columns", () => {

        // Setup
        store.state.columnToCategoryMapping.column2 = "Diagnosis";

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store)("Diagnosis");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({

            column1: [1, 2, 3],
            column2: ["column2_value1", "column2_value2", "column2_value3"]
        });
    });

    it("Retrieve unique value list of maximum length", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store)("Diagnosis", 2);

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column1": [1, 2]});
    });
});