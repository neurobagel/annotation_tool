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
                TermURL: "nb:FromBounded",
                Label: "bounded value"
            },

            euro: {
                TermURL: "nb:FromEuro",
                Label: "european decimal value"
            },

            float: {
                TermURL: "nb:FromFloat",
                Label: "float value"
            },

            iso8601: {
                TermURL: "nb:FromISO8601",
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
            "bounded", "euro", "float", "iso8601"
        ]);
    });
});