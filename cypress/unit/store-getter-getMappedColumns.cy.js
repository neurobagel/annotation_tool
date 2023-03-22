import { getters } from "~/store";

const store = {

    state: {

        columnToCategoryMap: {

            "column1": "category1",
            "column2": "category2",
            "column3": "category1"
        }
    }
};

describe("getMappedColumns", () => {

    it("Gets list of columns of a given category", () => {

        // Assert
        expect(getters.getMappedColumns(store.state)("category1")).to.deep.equal(["column1", "column3"]);
    });

    it("Gets empty list if a given category is not assigned to any columns", () => {

        // Assert
        expect(getters.getMappedColumns(store.state)("category4")).to.deep.equal([]);
    });
});