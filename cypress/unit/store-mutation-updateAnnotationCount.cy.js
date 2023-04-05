import { mutations } from "~/store";

let store;

describe("updateAnnotationCount", () => {

    beforeEach(() => {

        store = {
            state: {
                annotationCount: 0,

                dataDictionary: {
                    annotated: {
                        column1: {},
                        column2: {},
                        column3: {
                            valueMap: {}
                        },
                        column4: {}
                    }
                }
            }
        };
    });

    it("Annotate and remove the annotation of a continuous value column", () => {

        mutations.setHeuristic(store.state, {
            columnName: "column1",
            heuristic: "column1Heuristic"
        });

        mutations.updateAnnotationCount(store.state);

        expect(store.state.annotationCount).to.equal(1);

        mutations.setHeuristic(store.state, {
            columnName: "column1",
            heuristic: null
        });

        mutations.updateAnnotationCount(store.state);

        expect(store.state.annotationCount).to.equal(0);

    });

    it("Annotate and remove the annotation of a categorical value column", () => {

        mutations.selectCategoricalOption(store.state, {
            optionValue: "https://example.org/female",
            columnName: "column2",
            rawValue: "F"
        });

        mutations.updateAnnotationCount(store.state);

        expect(store.state.annotationCount).to.equal(1);

        mutations.selectCategoricalOption(store.state, {
            optionValue: null,
            columnName: "column2",
            rawValue: "F"
        });

        mutations.updateAnnotationCount(store.state);

        expect(store.state.annotationCount).to.equal(0);

    });

    it("Annotate multiple columns", () => {

        mutations.selectCategoricalOption(store.state, {
            optionValue: "https://example.org/female",
            columnName: "column2",
            rawValue: "F"
        });

        mutations.selectCategoricalOption(store.state, {
            optionValue: "https://example.org/male",
            columnName: "column2",
            rawValue: "M"
        });

        mutations.updateAnnotationCount(store.state);

        mutations.setHeuristic(store.state, {
            columnName: "column1",
            heuristic: "column1Heuristic"
        });

        mutations.updateAnnotationCount(store.state);

        mutations.setHeuristic(store.state, {
            columnName: "column4",
            heuristic: "column4Heuristic"
        });

        mutations.updateAnnotationCount(store.state);

        expect(store.state.annotationCount).to.equal(3);

    });

});