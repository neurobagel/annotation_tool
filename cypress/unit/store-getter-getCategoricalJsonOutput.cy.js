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

    it("Make sure 'IsAbout' fields are properly formatted", () => {

        // Act - Get formatted json output data for discrete value column
        const output = store.getters.getCategoricalJsonOutput(store.state)("column1");

        // Assert - Label in this column's 'IsAbout' section to be its assigned category
        expect(output.Annotations.IsAbout.Label).to.equal("category1");

        // Assert - TermURL in this column's 'IsAbout' section is properly formatted
        // with prefix, colon, and capitalized term
        expect(output.Annotations.IsAbout.TermURL).to.equal("nb:hasCategory1");
    });

    it("Make sure 'Levels' contains correctly transformed value map data from the store's annotated data dictionary", () => {

        // Act - Get formatted json output data for discrete value column
        const output = store.getters.getCategoricalJsonOutput(store.state)("column1");

        // Assert - Keys in 'Levels' are raw values from the value map
        expect(Object.keys(output.Annotations.Levels)).to.deep.equal(
            Object.keys(store.state.dataDictionary.annotated["column1"].valueMap));

        // Assert - Labels in each object in 'Levels' should match label from the
        // store's annotated data dictionary value map
        expect(output.Annotations.Levels["rawValue1"].Label).to.equal("annotatedValue1");
    });

    it("Make sure 'MissingValues' is the same as 'missingValues' from annotated data dictionary ", () => {
        const output = store.getters.getCategoricalJsonOutput(store.state)("column1");

        expect(output.Annotations.MissingValues).to.deep.equal(["missing"]);
    });
});