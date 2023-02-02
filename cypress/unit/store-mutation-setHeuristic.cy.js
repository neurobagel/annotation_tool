import { mutations } from "~/store";

let state = {};

describe("setHeuristic", () => {

    beforeEach(() => {

        // Setup
        state = {

            dataDictionary: {
                annotated: {
                    column1: {}
                }
            }
        };
    });

    it("Set the heuristic of a column with no transformationHeuristic key", () => {

        // Act
        mutations.setHeuristic(state, {
            column: "column1",
            heuristic: "column1Heuristic"
        });

        // Assert
        expect(state.dataDictionary.annotated.column1.transformationHeuristic).to.equal("column1Heuristic");
    });

    it("Set the heuristic of a column that already has a transformationHeuristic key", () => {

        // Setup
        state.dataDictionary.annotated.column1.transformationHeuristic = "oldHeuristic";

        // Act
        mutations.setHeuristic(state, {
            column: "column1",
            heuristic: "column1Heuristic"
        });

        // Assert
        expect(state.dataDictionary.annotated.column1.transformationHeuristic).to.equal("column1Heuristic");
    });
});