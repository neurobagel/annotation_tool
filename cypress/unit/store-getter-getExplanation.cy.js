import { getters } from "~/store";

const store = {

    state: {

        categories: {

            "Category1": { explanation: "Category 1 explanation" }
        }
    }
};

describe("getExplanation", () => {

    it("Get explanation for a given category", () => {

        expect(getters.getExplanation(store.state)("Category1")).to.equal("Category 1 explanation");
    });

    // NOTE: Since corresponding component `annot-explanation` will handle categories
    // without an 'explanation' key and there is not the chance that an
    // incorrect/absent category will be given, tests for these scenarios have
    // not been implemented
});