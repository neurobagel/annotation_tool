import { getters } from "~/store";

let store;

describe("getSelectedCategoricalOption", () => {

    beforeEach(() => {

        store = {

            state: {

                dataDictionary: {

                    annotated: {

                        column1: {

                            valueMap: {

                                "raw_value1": "annotated_value1"
                            }
                        }
                    }
                }
            }
        };
    });

    it("Get the value mapped to a raw value exists in a column that exists in the value map", () => {

        // Act
        const mappedValue = getters.getSelectedCategoricalOption(store.state)("column1", "raw_value1");

        // Assert
        expect(mappedValue).to.equal("annotated_value1");
    });

    it("Attempt to get a value mapped to raw value that does not exist in a column that exists in the value map", () => {

        // Act
        const mappedValue = getters.getSelectedCategoricalOption(store.state)("column1", "raw_value2");

        // Assert - If a raw value is not found in the column in the value map, a blank string should be returned
        expect(mappedValue).to.equal("");
    });

    it("Attempt to get a value mapped to a raw value in a column that does not exist in the value map", () => {

        // Act
        const mappedValue = getters.getSelectedCategoricalOption(store.state)("column2", "raw_value1");

        // Assert - If a column is not found in the value map, a blank string should be returned
        expect(mappedValue).to.equal("");
    });
});