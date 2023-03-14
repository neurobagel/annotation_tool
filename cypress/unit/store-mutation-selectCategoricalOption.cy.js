import { mutations } from "~/store";

let store;

describe("selectCategoricalOption mutation", () => {

    beforeEach(() => {

        store = {

            state: {

                dataDictionary: {

                    annotated: {

                        column1: {}
                    }
                }
            }
        };
    });

    it("Makes sure a value map is created for a column in the data dictionary", () => {

        // Act
        mutations.selectCategoricalOption(store.state, {
            optionValue: "female",
            columnName: "column1",
            rawValue: "F"
        });

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap).to.exist;
    });

    it("Makes sure an annotated value is set in the value map", () => {

        // Act
        mutations.selectCategoricalOption(store.state, {
            optionValue: "female",
            columnName: "column1",
            rawValue: "F"
        });

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap["F"]).to.equal("female");
    });

    it("Makes sure a value in the value map can be overwritten", () => {

        // Act
        mutations.selectCategoricalOption(store.state, {
            optionValue: "female",
            columnName: "column1",
            rawValue: "F"
        });
        mutations.selectCategoricalOption(store.state, {
            optionValue: "female",
            columnName: "column1",
            rawValue: "Female"
        });

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap["Female"]).to.equal("female");
    });
});