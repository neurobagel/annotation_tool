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
                Description: ""
            },
            "col2": {
                Description: ""
            }
        });
        expect(state.dataDictionary.annotated).to.deep.equal({
            "col1": {
                Description: "",
                missingValues: []
            },
            "col2": {
                Description: "",
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
                Description: ""
            },
            "col2": {
                Description: ""
            }
        });
        expect(state.dataDictionary.annotated).to.deep.equal({
            "col1": {
                Description: "",
                missingValues: []
            },
            "col2": {
                Description: "",
                missingValues: []
            }
        });
    });
});
