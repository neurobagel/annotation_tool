import { getters } from "~/store";

const store = {

    state: {

        columnToToolMap: {
            "column1": "snomed:MOCA",
            "column2": null,
            "column3": "snomed:MOCA",
            "column4": "snomed:UPDRS"
        }
    }
};

describe("getColumnsForTool", () => {

    it("Gets list of columns mapped to a given tool", () => {

        // Assert
        expect(getters.getColumnsForTool(store.state)("snomed:MOCA")).to.deep.equal(["column1", "column3"]);
    });

    it("Gets empty list if no column was assigned to this tool", () => {

        // Assert
        expect(getters.getColumnsForTool(store.state)("snomed:SomethingElse")).to.deep.equal([]);
    });
});
