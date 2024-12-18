import { mutations } from "~/store";

let store;

describe("alterColumnToToolMapping", () => {

    beforeEach(() => {

        store = {

            state: {

                columnToToolMap : {

                    "column1": "snomed:MOCA",
                    "column2": null,
                    "column3": "snomed:UPDRSIII"
                }
            }
        };
    });

    it("Maps column to tool if it's not already mapped", () => {

        mutations.alterColumnToToolMapping(store.state, {columnName: "column2", toolIdentifier: "snomed:MOCA"});
        expect(store.state.columnToToolMap.column2).to.equal("snomed:MOCA");
    });

    it("Maps column to new tool overwriting previous mapping", () => {

        mutations.alterColumnToToolMapping(store.state, {columnName: "column3", toolIdentifier: "snomed:MOCA"});
        expect(store.state.columnToToolMap.column3).to.equal("snomed:MOCA");
    });

    it("Sets mapping to null if it's already mapped", () => {

        mutations.alterColumnToToolMapping(store.state, {columnName: "column1", toolIdentifier: "snomed:MOCA"});
        expect(store.state.columnToToolMap.column1).to.equal(null);
    });
});
