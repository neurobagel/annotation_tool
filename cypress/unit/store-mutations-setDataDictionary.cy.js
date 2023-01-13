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

    it("Are new key/value pairs in the uploaded dictionary not added to the data dictionary?", () => {

        // Act
        mutations.setDataDictionary(state,
            { "group": { "key1": "value1" } },
            ["age", "sex"]);

        // Assert
        expect(state.dataDictionary).to.not.contain.keys("group");
    });

    it("Has every new key/value pair at least one level deep in the uploaded dictionary been added to the state dictionary, if the key was already present in the state dictionary", () => {

        // Act
        mutations.setDataDictionary(state,
            { "age": { "Units": "minutes" } },
            ["age", "sex"]);

        // Assert
        expect(state.dataDictionary.age["Units"]).to.equal("minutes");
    });

    it("Has every new key/value pair two levels deep in the uploaded dictionary been added to the state dictionary, if the key was already present in the state dictionary", () => {

        // Act
        mutations.setDataDictionary(state,
            { "sex": { "Levels": { "NB": "Non-binary" }} },
            ["age", "sex"]);

        // Assert
        expect(state.dataDictionary.sex["Levels"]).to.contain.keys("NB");
    });
});