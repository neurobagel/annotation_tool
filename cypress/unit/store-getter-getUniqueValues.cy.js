import { getters } from "~/store";

let store;
let state;

describe("getUniqueValues getter", () => {

    beforeEach(() => {
        state = {

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
        };

        store = {
            getters: {
                getColumnsForCategory: getters.getColumnsForCategory(state),
                getUniqueColumnValues: getters.getUniqueColumnValues(state)
            },

            state: state
            };
        }
    );

    it("Retrieves unique values of a single column", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state, store.getters)("Diagnosis");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column1": [1, 2, 3] });
    });

    it("Retrieves unique values of a multiple columns", () => {

        // Setup
        // We change the state by reference because the state passed to the getters needs to reflect that change
        store.state.columnToCategoryMap.column2 = "Diagnosis";

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state, store.getters)("Diagnosis");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({

            "column1": [1, 2, 3],
            "column2": ["column2_value1", "column2_value2", "column2_value3"]
        });
    });

    it("Retrieve unique value list of maximum length", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state, store.getters)("Diagnosis", 2);

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column1": [1, 2]});
    });

    it("Make sure no missing values are included in unique values", () => {

        // Act
        const diagnosisUniqueValues = getters.getUniqueValues(store.state, store.getters)("Sex");

        // Assert
        expect(diagnosisUniqueValues).to.deep.equal({ "column3": ["column3_value3", "column3_value4"]});
    });
});