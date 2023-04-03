import { getters } from "~/store";


const state = {
    dataDictionary : {
        annotated: {
            "describedColumn": {
                Description: "This is my first column"
            },
            "lazyColumn": {}
        }
    }
};

describe("getColumnDescription", () => {

    it("Returns description for a column if one exists", () => {

        const result = getters.getColumnDescription(state)("describedColumn");
        expect(result).to.be.equal("This is my first column");
    });

    it("Returns an empty string if no descripton exists", () => {

        const result = getters.getColumnDescription(state)("lazyColumn");
        expect(result).to.be.empty;
    });
});