import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categories: {
            "category1": {

                componentName: "annot-continuous-values",
                explanation: "This is an explanation for how to annotate category1.",
                identifier: "nb:hasCategory1"
            }
        },
        columnToCategoryMap: { column1: "category1" },
        dataDictionary: {

            annotated: {

                column1: {

                    transformationHeuristic: "euro"
                }
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

describe("getcontinuousJsonOutput", () => {

    it("Make sure continuous json output is schema compliant", () => {

        // Act - Get formatted json output data for continuous value column
        const output = store.getters.getContinuousJsonOutput(store.state)("column1");

        // Assert - Current annotated data dictionary schema compliance
        expect(output).to.deep.equal(
            {

                Annotations: {
                    IsAbout: {
                        Label: "category1",
                        TermURL: "nb:hasCategory1"
                    },
                    Transformation: {

                        Label: "european decimal value",
                        TermURL: "nb:euro"
                    }
                }
        });
    });
});