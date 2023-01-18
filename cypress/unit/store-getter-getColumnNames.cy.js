import { getters } from "~/store/index";

describe("getColumnNames", () => {
    it("Returns an array of all column names in the data table", () => {
        const { getColumnNames } = getters;
        const state = {
            dataTable: [
                {
                    "column1": "value1", "column2": "value2"
                },
                {
                    "column1": "value3", "column2": "value4"
                }
            ]
        };
        const columnNames = getColumnNames(state);
        expect(columnNames).to.deep.equal(["column1", "column2"]);
    });
});