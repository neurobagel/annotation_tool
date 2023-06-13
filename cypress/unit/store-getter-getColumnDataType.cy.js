import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categories: {

            "category1": {

                componentName: "annot-categorical"
            }
        },
        columnToCategoryMap: {

            column1: "category1",
            uncategorizedColumn: null
        }
    }
};

describe("getColumnDataType", () => {

    it("Find the data (a.k.a. component) type of a categorized column", () => {

        // Assert - Given column returns the expected data type from the categories store field
        expect(store.getters.getColumnDataType(store.state)("column1")).to.equal("annot-categorical");
    });

    it("If column is uncategorized, it has no data type", () => {

        // Assert - Uncategorized column has a 'null' data type
        expect(store.getters.getColumnDataType(store.state)("uncategorizedColumn")).to.equal(null);
    });
});