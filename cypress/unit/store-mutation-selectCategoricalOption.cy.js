import { mutations } from "~/store";

let store;

describe("selectCategoricalOption mutation", () => {

    beforeEach(() => {

        store = {

            state: {

                columnToCategoryMap: {},

                dataDictionary: {

                    annotated: {

                        column1: {

                            valueMap: {}
                        }
                    }
                }
            }
        };
    });

    it("Makes sure an annotated value is set in the value map", () => {

        // Act
        mutations.selectCategoricalOption(store.state, {
            optionValue: "https://example.org/female",
            columnName: "column1",
            rawValue: "F"
        });

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap["F"]).to.equal("https://example.org/female");
    });

    it("Makes sure a value in the value map can be overwritten", () => {

        // Act
        mutations.selectCategoricalOption(store.state, {
            optionValue: "https://example.org/female",
            columnName: "column1",
            rawValue: "F"
        });
        mutations.selectCategoricalOption(store.state, {
            optionValue: "https://example.org/male",
            columnName: "column1",
            rawValue: "F"
        });

        // Assert
        expect(store.state.dataDictionary.annotated.column1.valueMap["F"]).to.equal("https://example.org/male");
    });
});