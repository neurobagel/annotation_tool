import { getters } from "~/store";

const store = {

    state: {

        columnToToolMap: {
            "column1": "cogatlas:MOCA",
            "column2": null,
            "column3": "cogatlas:MOCA",
            "column4": "cogatlas:UPDRS"
        }
    }
};

describe("getColumnsForTool", () => {

    it("Gets list of columns mapped to a given tool", () => {

        // Assert
        expect(getters.getColumnsForTool(store.state)("cogatlas:MOCA")).to.deep.equal(["column1", "column3"]);
    });

    it("Gets empty list if no column was assigned to this tool", () => {

        // Assert
        expect(getters.getColumnsForTool(store.state)("cogatlas:SomethingElse")).to.deep.equal([]);
    });
});
