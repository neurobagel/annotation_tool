import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categoricalOptions: {

            category1: [

                { label: "annotatedValue1", identifier: "https://example.org/option_1"},
                { label: "annotatedValue2", identifier: "https://example.org/option_2"}
            ]
        },
        categories: {
            "category1": {

                componentName: "annot-categorical",
                explanation: "This is an explanation for how to annotate category1.",
                identifier: "nb:hasCategory1"
            }
        },
        columnToCategoryMap: { column1: "category1" },
        dataDictionary: {

            annotated: {

                column1: {

                    valueMap: { "rawValue1": "https://example.org/option_1" },
                    missingValues: ["missing"]
                }
            }
        }
    }
};

describe("getCategoricalJsonOutput", () => {

    it("Make sure categorical json output is schema compliant", () => {

        // Act - Get formatted json output data for discrete value column
        const output = store.getters.getCategoricalJsonOutput(store.state)("column1");

        // Assert - Current annotated data dictionary schema compliance
        expect(output).to.deep.equal(
            {

                Annotations: {
                    IsAbout: {
                        Label: "category1",
                        TermURL: "nb:hasCategory1"
                    },
                    Levels: {
                        rawValue1: {
                            Label: "annotatedValue1",
                            TermURL: "https://example.org/option_1"
                        }
                    },
                    MissingValues: ["missing"]
                }
        });
    });
});