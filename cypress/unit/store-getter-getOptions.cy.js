import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categories: {

            "category1": {

                componentName: "annot-categorical"
            },

            "category2": {

                componentName: "annot-continuous-values"
            }
        },

        columnToCategoryMapping: {

            "column1": "category1",
            "column2": "category2"
        },

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
        },

        transformationHeuristics: {

            "annot-continuous-values": [

                "float", "bounded", "euro", "range", "int", "string", "isoyear"
            ]
        }
    }
};

describe("getOptions", () => {

    it("Retrieves options for a continuous-values-categorized column", () => {

        // Act
        const options = store.getters.getOptions(store.state)("column1");

        // Assert
        expect(options).to.deep.equal(["option1", "option2"]);
    });

    it("Retrieves options for a categorical-categorized column", () => {

        // Act
        const options = store.getters.getOptions(store.state)("column2");

        // Assert
        expect(options).to.deep.equal([
            "float", "bounded", "euro", "range", "int", "string", "isoyear"
        ]);
    });
});