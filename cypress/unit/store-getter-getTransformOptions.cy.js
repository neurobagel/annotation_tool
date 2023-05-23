import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categories: {

            "category1": {

                componentName: "annot-continuous-values"
            }
        },

        transformationHeuristics: {
            bounded: {
                TermURL: "nb:bounded",
                Label: "bounded value"
            },

            euro: {
                TermURL: "nb:euro",
                Label: "european decimal value"
            },

            float: {
                TermURL: "nb:float",
                Label: "float value"
            },

            int: {
                TermURL: "nb:int",
                Label: "integer value"
            },

            iso8601: {
                TermURL: "nb",
                Label: "period of time defined according to the ISO8601 standard"
            }
        }
    }
};

describe("getTransformOptions", () => {

    it("Retrieves transformation heuristic options for a category with a continuous values data type", () => {

        // Act
        const options = store.getters.getTransformOptions(store.state)("category1");

        // Assert
        expect(options).to.deep.equal([
            "bounded", "euro", "float", "int", "iso8601"
        ]);
    });
});