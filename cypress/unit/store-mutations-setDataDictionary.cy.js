import { mutations } from "~/store/index-refactor";

let columns;
let newDataDictionary;
let state = {};


describe("setDataDictionary", () => {

    beforeEach(() => {

        // Setup
        state = {

            dataDictionary: {

                provided: {

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

                annotated: {

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
                }
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
        newDataDictionary = Object.assign({}, state.dataDictionary.provided);
    });

    it("New columns in the uploaded dictionary should not be added to the state data dictionary?", () => {

        // Setup
        newDataDictionary["group"] = { "key1": "value1" };

        // Act
        mutations.setDataDictionary(state, newDataDictionary, columns);

        // Assert
        expect(state.dataDictionary.annotated).to.not.contain.keys("group");
    });

    it("New string/string key/value pairs for columns should replace values in the state data dictionary", () => {

        // Setup
        newDataDictionary["age"]["Units"] = "minutes";

        // Act
        mutations.setDataDictionary(state, newDataDictionary, columns);

        // Assert
        expect(state.dataDictionary.annotated["age"]["Units"]).to.equal("minutes");
    });

    it("New string/object key/value pairs in the uploaded dictionary should update/retain values in the state data dictionary", () => {

        // Setup
        newDataDictionary["sex"]["Levels"] = { "M": "a male participant", "F": "female", "NB": "non-binary" };

        // Act
        mutations.setDataDictionary(state, newDataDictionary, columns);

        // Assert
        expect(state.dataDictionary.annotated["sex"]).to.deep.equal(newDataDictionary["sex"]);
    });
});