import { getters } from "~/store/index";


const state = {
    dataDictionary : {
        annotated: {
            "describedColumn": {
                description: "This is my first column"
            },
            "lazyColumn": {}
        }
    }
};

describe("getColumnDescription", () => {
    it("returns description for a column if one exists", () => {
        const result = getters.getColumnDescription(state, "describedColumn");
        expect(result).to.be.equal("This is my first column");
    });
    it("returns an empty string if no descripton exists", () => {
        const result = getters.getColumnDescription(state, "lazyColumn");
        expect(result).to.be.empty;
    });
});