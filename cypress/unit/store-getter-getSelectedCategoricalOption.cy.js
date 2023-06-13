import { getters } from "~/store";

let store;

describe("getSelectedCategoricalOption", () => {

    beforeEach(() => {

        store = {

            state: {

                categoricalOptions: {

                    category1: [{

                        label: "option1Label",
                        identifier: "optionIdentifier"
                    }]
                },

                columnToCategoryMap: {

                    column1: "category1"
                },

                dataDictionary: {

                    annotated: {

                        column1: {

                            valueMap: {

                                "raw_value1": "optionIdentifier"
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
        expect(mappedValue).to.equal("option1Label");
    });

    it("Attempt to get a value mapped to raw value that does not exist in a column that exists in the value map", () => {

        // Act
        const mappedValue = getters.getSelectedCategoricalOption(store.state)("column1", "raw_value2");

        // Assert - If a raw value is not found in the column in the value map, a blank string should be returned
        expect(mappedValue).to.equal("");
    });
});