import { getters } from "~/store";

const category = "category1";
const columnName = "column1";
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
                    missingValues: {0: "missing"}
                }
            }
        }
    }
};

describe("getCategoricalJsonOutput", () => {

    it("Make sure categorical json output is schema compliant", () => {

        // Act - Get formatted json output data for discrete value column
        const output = store.getters.getCategoricalJsonOutput(store.state)(columnName);

        // Assert - Current annotated data dictionary schema compliance

        // Parent level

        expect(output).to.have.property("Annotations");

        // Child level

        expect(output.Annotations).to.have.property("IsAbout");
        expect(output.Annotations).to.have.property("Levels");
        expect(output.Annotations).to.have.property("MissingValues");

        // Grandchild level
        expect(output.Annotations.IsAbout).to.have.property("Label");
        expect(output.Annotations.IsAbout).to.have.property("TermURL");
        Object.keys(output.Annotations.Levels).forEach(rawValue => {

            expect(output.Annotations.Levels[rawValue]).to.have.property("Label");
            expect(output.Annotations.Levels[rawValue]).to.have.property("TermURL");
        });
    });

    it("Make sure 'IsAbout' fields are properly formatted", () => {

        // Act - Get formatted json output data for discrete value column
        const output = store.getters.getCategoricalJsonOutput(store.state)(columnName);

        // Assert - Label in this column's 'IsAbout' section to be its assigned category
        expect(output.Annotations.IsAbout.Label).to.equal(category);

        // Assert - TermURL in this column's 'IsAbout' section is properly formatted
        // with prefix, colon, and capitalized term
        expect(output.Annotations.IsAbout.TermURL).to.equal("nb:hasCategory1");
    });

    it("Make sure 'Levels' contains correctly transformed value map data from the store's annotated data dictionary", () => {

        // Act - Get formatted json output data for discrete value column
        const output = store.getters.getCategoricalJsonOutput(store.state)(columnName);

        // Assert - Keys in 'Levels' are raw values from the value map
        expect(Object.keys(output.Annotations.Levels)).to.deep.equal(
            Object.keys(store.state.dataDictionary.annotated[columnName].valueMap));

        // Assert - Labels in each object in 'Levels' should match label from the
        // store's annotated data dictionary value map
        Object.keys(output.Annotations.Levels).forEach(rawValue => {

            expect(output.Annotations.Levels[rawValue].Label).to.equal("annotatedValue1");
        });
    });

    it("Make sure 'MissingValues' is the same as 'missingValues' from annotated data dictionary ", () => {
        const output = store.getters.getCategoricalJsonOutput(store.state)(columnName);

        expect(Object.keys(output.Annotations.MissingValues)).to.deep.equal(Object.keys(["missing"]));
    });
});