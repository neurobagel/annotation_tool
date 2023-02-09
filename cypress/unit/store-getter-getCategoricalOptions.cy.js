import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        dataDictionary: {

            userProvided: {

                "column1": {

                    "Levels": {

                        "option1": "Option 1 description",
                        "option2": "Option 2 description"
                    }
                },

                "column2": {}
            }
        }
    }
};

describe("getCategoricalOptions", () => {

    it("Retrieves options in a data dictionary for a categorical column", () => {

        // Act
        const options = store.getters.getCategoricalOptions(store.state)("column1");

        // Assert
        expect(options).to.deep.equal(["option1", "option2"]);
    });

    it("Returns empty list for a categorical column that has no options in its data dictionary entry", () => {

        // Act
        const options = store.getters.getCategoricalOptions(store.state)("column2");

        // Assert
        expect(options).to.deep.equal([]);
    });
});