import { getters } from "~/store";

describe("The getHeuristic getter", () => {

    let store = {};

    beforeEach(() => {

        store = {

            state: {

                dataDictionary: {

                    userProvided: {},
                    annotated: {

                        column1: {}
                    }
                }
            }
        };
    });

    it("Get the heuristic of a column with no heuristic", () => {

        // Act
        const transformationHeuristic = getters.getHeuristic(store.state)("column1");

        // Assert
        expect(transformationHeuristic).to.equal("");
    });

    it("Get the heuristic of a column with an already set heuristic", () => {

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "column1Heuristic";

        // Act
        const transformationHeuristic = getters.getHeuristic(store.state)("column1");

        // Assert
        expect(transformationHeuristic).to.equal("column1Heuristic");
    });
});