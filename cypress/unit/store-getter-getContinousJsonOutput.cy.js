import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categories: {

            category1: {

                componentName: "annot-continuous-values",
                explanation: "This is an explanation for how to annotate category1.",
                identifier: "nb:hasCategory1"
            }
        },
        columnToCategoryMap: { column1: "category1" },
        dataDictionary: {

            annotated: {

                column1: {

                    missingValues: [],
                    transformationHeuristic: "euro"
                }
            }
        },
        transformationHeuristics: {

            bounded: {

                Label: "bounded value",
                TermURL: "nb:bounded"
            },
            euro: {

                Label: "european decimal value",
                TermURL: "nb:euro"
            },
            float: {

                Label: "float value",
                TermURL: "nb:float"
            },
            int: {

                Label: "integer value",
                TermURL: "nb:int"
            },
            iso8601: {

                Label: "period of time defined according to the ISO8601 standard",
                TermURL: "nb"
            }
        }
    }
};

describe("getcontinuousJsonOutput", () => {

    it("Make sure continuous json output is schema compliant", () => {

        // Act - Get formatted json output data for continuous value column
        const output = store.getters.getContinuousJsonOutput(store.state)("column1");

        // Assert - Current annotated data dictionary schema compliance
        expect(output).to.deep.equal({

            Annotations: {

                IsAbout: {

                    Label: "category1",
                    TermURL: "nb:hasCategory1"
                },
                MissingValues: [],
                Transformation: {

                    Label: "european decimal value",
                    TermURL: "nb:euro"
                }
            }
        });
    });
});