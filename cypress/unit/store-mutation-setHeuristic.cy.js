import { mutations } from "~/store";

let state = {};

describe("setHeuristic", () => {

    beforeEach(() => {

        // Setup
        state = {

            dataDictionary: {
                annotated: {
                    column1: { transformationHeuristic: "" }
                }
            }
        };
    });

    it("Set the transformation heuristic of a column", () => {

        // Act
        mutations.setHeuristic(state, {
            column: "column1",
            heuristic: "column1Heuristic"
        });

        // Assert
        expect(state.dataDictionary.annotated.column1.transformationHeuristic).to.equal("column1Heuristic");
    });
});