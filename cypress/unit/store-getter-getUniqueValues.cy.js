import { getters } from "~/store";

let store;

describe("getUniqueValues getter", () => {

    beforeEach(() => {

        store = {

            state: {

                columnToCategoryMap: {

                    column1: "Diagnosis",
                    column2: "Age",
                    column3: "Sex"
                },

                dataDictionary: {

                    annotated: {

                        column1: { missingValues: [] },
                        column2: { missingValues: [] },
                        column3: { missingValues: ["column3_value1", "column3_value2"] }
                    }
                },

                dataTable: [

                    { column1: 1, column2: "column2_value1", column3: "column3_value1" },
                    { column1: 2, column2: "column2_value2", column3: "column3_value2" },
                    { column1: 1, column2: "column2_value3", column3: "column3_value3" },
                    { column1: 3, column2: "column2_value2", column3: "column3_value4" }
                ]
            }
        };
    });

    it("Retrieves unique values of a single column", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state)("Diagnosis");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column1": [1, 2, 3] });
    });

    it("Retrieves unique values of a multiple columns", () => {

        // Setup
        store.state.columnToCategoryMap.column2 = "Diagnosis";

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state)("Diagnosis");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({

            "column1": [1, 2, 3],
            "column2": ["column2_value1", "column2_value2", "column2_value3"]
        });
    });

    it("Retrieve unique value list of maximum length", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state)("Diagnosis", 2);

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column1": [1, 2]});
    });

    it("Make sure no missing values are included in unique values", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state)("Sex");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column3": ["column3_value3", "column3_value4"]});
    });
});