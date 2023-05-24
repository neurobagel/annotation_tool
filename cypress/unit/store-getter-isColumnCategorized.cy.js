import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        columnToCategoryMap: {

            column1: "category1",
            column2: null
        }
    }
};

describe("isColumnCategorized", () => {

    it("Check for column categorization via columnToCategoryMap", () => {

        // Assert - Returns true if column is a key in 'columnToCategoryMap'
        expect(store.getters.isColumnCategorized(store.state)("column1")).to.be.true;

        // Assert - Returns false if column is not a key in 'columnToCategoryMap'
        expect(store.getters.isColumnCategorized(store.state)("column2")).to.be.false;
    });
});