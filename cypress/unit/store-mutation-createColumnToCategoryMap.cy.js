import { getters, mutations } from "~/store/index-refactor";

var store = {};

describe("createColumnToCategoryMap", () => {

    beforeEach(() => {

        store = {

            columnToCategoryMapping: {},

            dataTable: [

                {
                    "column1Name": "value1", "column2Name": "value2"
                },
                {
                    "column1Name": "value3", "column2Name": "value4"
                }
            ],

            getColumnNames: p_state => ["column1Name", "column2Name"]
        };
    });

    it("Returns a list of columns from the data table", () => {

        const results = getters.getColumnNames(store);
        expect(results).to.eql(["column1Name", "column2Name"]);
    });

    it("Creates a column to category map based off the data table", () => {

        mutations.createColumnToCategoryMap(store);
        expect(store.columnToCategoryMapping).to.eql({"column1Name": null, "column2Name": null});
    });
});