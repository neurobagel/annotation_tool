import { getters } from "~/store";


const state = {
    dataDictionary: {
        annotated: {
            "goodColumn": {
                "Levels": {
                    "value1": {
                        "Description": "my description"
                    },
                    "value2": {
                        "Description": "my other description"
                    }
                }
            },
            "levelsButNothingElse": {
                "Levels": {
                }
            },
            "badColumn": {
            }
        }
    }
};


describe("getValueDescription", () => {

    it("Returns the description of a value in a column, if it exists", () => {

        const result = getters.getValueDescription(state)("goodColumn", "value1");
        expect(result).to.be.equal("my description");
    });

    it("Returns 'no description available' if the value does not have a description", () => {

        const resultNoValue = getters.getValueDescription(state)("levelsButNothingElse", "notExistValue");
        expect(resultNoValue).to.be.equal("no description available");

        const resultNoLevels = getters.getValueDescription(state)("badColumn", "notExistValue");
        expect(resultNoLevels).to.be.equal("no description available");
    });
});