import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categoricalOptions: {

            "category1": [
                { label: "option_0", identifier: "https://example.org/option_0"},
                { label: "option_1", identifier: "https://example.org/option_1"}
            ]
        },

        columnToCategoryMap: {

            "column1": "category1"
        }
    }
};

describe("getCategoricalOptions", () => {

    it("Retrieves options in a data dictionary for a categorical column", () => {

        // Act
        const options = store.getters.getCategoricalOptions(store.state)("column1");

        // Assert
        expect(options).to.deep.equal([
            { label: "option_0", identifier: "https://example.org/option_0"},
            { label: "option_1", identifier: "https://example.org/option_1"}
        ]);
    });

    it("Returns empty list for a categorical column that has no options in its data dictionary entry", () => {

        // Act
        const options = store.getters.getCategoricalOptions(store.state)("column2");

        // Assert
        expect(options).to.deep.equal([]);
    });
});