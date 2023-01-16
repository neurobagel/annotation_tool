import { mutations } from "~/store/index-refactor";

let state = {};

describe("setDataDictionary", () => {

    beforeEach(() => {

        // Setup
        state = {

            dataDictionary: {

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

            dataTable: [

                {
                    "age": "value1", "sex": "value2"
                },
                {
                    "age": "value3", "sex": "value4"
                }
            ]
        };
    });

    it("New columns in the uploaded dictionary should not be added to the state data dictionary?", () => {

        // Act
        mutations.setDataDictionary(state,
            { "group": { "key1": "value1" } },
            ["age", "sex"]);

        // Assert
        expect(state.dataDictionary).to.not.contain.keys("group");
    });

    it("New string/string key/value pairs for columns should replace values in the state data dictionary", () => {

        // Act
        mutations.setDataDictionary(state,
            { "age": { "Units": "minutes" } },
            ["age", "sex"]);

        // Assert
        expect(state.dataDictionary["age"]["Units"]).to.equal("minutes");
    });

    it("New string/object key/value pairs in the uploaded dictionary should update/retain values in the state data dictionary", () => {

        // Act
        mutations.setDataDictionary(state,
            { "sex": { "Levels": { "M": "male", "F": "female", "NB": "non-binary" }} },
            ["age", "sex"]);

        // Assert
        expect(state.dataDictionary["sex"]["Levels"]).to.contain.keys("M");
        expect(state.dataDictionary["sex"]["Levels"]).to.contain.keys("F");
        expect(state.dataDictionary["sex"]["Levels"]).to.contain.keys("NB");
    });
});