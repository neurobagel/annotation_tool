import { mutations } from "~/store";

let state = {};

describe("initializeDataDictionary", () => {

    // Setup
    beforeEach(() => {

        state = {

            dataTable: [

                { "col1": "val1", "col2": "val2" },
                { "col1": "val21", "col2": "val22" }
            ],
            dataDictionary: {

                annotated: {},
                userProvided: {}
            }
        };
    });

    it("Initializes a new data dictionary when none is defined", () => {

        // Act
        mutations.initializeDataDictionary(state);

        // Assert
        expect(state.dataDictionary.userProvided).to.deep.equal({
            "col1": {
                description: ""
            },
            "col2": {
                description: ""
            }
        });
        expect(state.dataDictionary.annotated).to.deep.equal({
            "col1": {
                description: "",
                missingValues: []
            },
            "col2": {
                description: "",
                missingValues: []
            }
        });
    });

    it("Overwrites existing data dictionary when one is already defined", () => {

        // Setup
        state.dataDictionary.annotated = {
            "this": "annotation",
            "is": "no longer needed"
        };

        // Act
        mutations.initializeDataDictionary(state);

        // Assert
        expect(state.dataDictionary.userProvided).to.deep.equal({
            "col1": {
                description: ""
            },
            "col2": {
                description: ""
            }
        });
        expect(state.dataDictionary.annotated).to.deep.equal({
            "col1": {
                description: "",
                missingValues: []
            },
            "col2": {
                description: "",
                missingValues: []
            }
        });
    });
});
