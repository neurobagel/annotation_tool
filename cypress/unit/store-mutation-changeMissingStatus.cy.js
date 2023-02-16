import { mutations } from "~/store";

let store;

describe("changeMissingStatus mutation", () => {

    // Setup
    beforeEach(() => {

        store = {

            state: {

                dataDictionary: {

                    annotated: {

                        column1: []
                    }
                }
            }
        };
    });

    it("Mark a value as missing", () => {

        // Act
        mutations.changeMissingStatus(store.state, {
            column: "column1",
            markAsMissing: true,
            value: "value1"
        });

        // Assert
        expect(store.state.dataDictionary.annotated.column1).to.include("value1");
    });

    it("Remove missing status of a value", () => {

        // Setup
        store.state.dataDictionary.annotated.column1.push("value1");

        // Act
        mutations.changeMissingStatus(store.state, {
            column: "column1",
            markAsMissing: false,
            value: "value1"
        });

        // Assert
        expect(store.state.dataDictionary.annotated.column1).to.not.include("value1");
    });

});