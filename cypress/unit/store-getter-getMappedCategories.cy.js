import { getters } from "~/store";

const store = {

    state: {

        columnToCategoryMap: {

            column1: "category1",
            column2: "category2",
            column3: "category1"
        }
    }
};

describe("getMappedCategories", () => {

    it("Get list of unique categories", () => {

        // Assert
        expect(getters.getMappedCategories(store.state)()).to.deep.equal(["category1", "category2"]);
    });

    it("Get list of unique categories, skipping one", () => {

        // Assert
        expect(getters.getMappedCategories(store.state)(["category1"])).to.deep.equal(["category2"]);
    });
});