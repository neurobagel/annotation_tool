import { getters } from "~/store/index-refactor";


const state = {
    dataDictionary: {
        annotated: {
            "goodColumn": {
                "levels": {
                    "value1": {
                        "description": "my description"
                    },
                    "value2": {
                        "description": "my other description"
                    }
                }
            },
            "levelsButNothingElse": {
                "levels": {
                }
            },
            "badColumn": {
            }
        }
    }
};


describe("getValueDescription", () => {
    it("returns the description of a value in a column, if it exists", () => {
        const result = getters.getValueDescription(state, "goodColumn", "value1");
        expect(result).to.be.equal("my description");
    });
    it("returns an empty string if the value does not have a description", () => {
        const resultNoValue = getters.getValueDescription(state, "levelsButNothingElse", "notExistValue");
        expect(resultNoValue).to.be.empty;
        const resultNoLevels = getters.getValueDescription(state, "badColumn", "notExistValue");
        expect(resultNoLevels).to.be.empty;
    });
});