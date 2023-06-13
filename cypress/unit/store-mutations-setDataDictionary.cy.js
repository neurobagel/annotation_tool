import { mutations } from "~/store";

let columns;
let newDataDictionary;
let state = {};

describe("setDataDictionary", () => {

    beforeEach(() => {

        // Setup
        state = {

            dataDictionary: {

                userProvided: {

                    "age": {

                        "Description": "age of the participant",
                        "Units": "years"
                    },
                    "sex": {

                        "Description": "sex of the participant as reported by the participant",
                        "Levels": {
                            "M": "male",
                            "F": "female"
                        }
                    }
                },

                annotated: {}
            },

            dataTable: [

                {
                    "age": "value1", "sex": "value2"
                },
                {
                    "age": "value3", "sex": "value4"
                }
            ]
        };

        columns = Object.keys(state.dataTable[0]);
        state.dataDictionary.annotated = JSON.parse(JSON.stringify(state.dataDictionary.userProvided));

        newDataDictionary = {

            "age": {

                "Description": "age of the participant",
                "Units": "years"
            },
            "sex": {

                "Description": "sex of the participant as reported by the participant",
                "Levels": {
                    "M": "male",
                    "F": "female"
                }
            }
        };
    });

    it("New columns in the uploaded dictionary should not be added to the state data dictionary?", () => {

        // Setup
        newDataDictionary["group"] = { "key1": "value1" };

        // Act
        mutations.setDataDictionary(state, { newDataDictionary: newDataDictionary, storeColumns: columns} );

        // Assert
        expect(state.dataDictionary.annotated).to.not.contain.keys("group");
    });

    it("New string/string key/value pairs for existing columns should replace values in the state data dictionary", () => {

        // Setup
        newDataDictionary["age"]["Units"] = "minutes";

        // Act
        mutations.setDataDictionary(state, { newDataDictionary: newDataDictionary, storeColumns: columns});

        // Assert
        expect(state.dataDictionary.annotated["age"]["Units"]).to.equal("minutes");
    });

    it("New string/object key/value pairs in the uploaded dictionary should update/retain values in the state data dictionary", () => {

        // Setup
        newDataDictionary["sex"]["Levels"] = { "M": "a male participant", "F": "female", "NB": "non-binary" };

        // Act
        mutations.setDataDictionary(state, { newDataDictionary: newDataDictionary, storeColumns: columns});

        // Assert
        expect(state.dataDictionary.annotated["sex"]).to.deep.equal(newDataDictionary["sex"]);
    });
});