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

            "annot-continuous-values": [

                "float", "bounded", "euro", "range", "int", "string", "isoyear"
            ]
        }
    }
};

describe("getTransformOptions", () => {

    it("Retrieves transformation heuristic options for a category with a continuous values data type", () => {

        // Act
        const options = store.getters.getTransformOptions(store.state)("category1");

        // Assert
        expect(options).to.deep.equal([
            "float", "bounded", "euro", "range", "int", "string", "isoyear"
        ]);
    });
});