import { actions, getters, mutations } from "~/store/index-refactor";

const context = {
    commit: () => {},
    state: {
        dataTable: []
    },
    getters: getters,
    mutations: mutations
};
const payload = {
    data: [
        ["col1", "col2"],
        ["val1", "val2"],
        ["val21", "val22"]
    ],
    filename: "myFile.tsv"
};

describe("processDataTable", () => {

    it("accepts the correct arguments and calls all the expected mutations", () => {
        cy.spy(context, 'commit');

        actions.processDataTable(context, payload);
        // Here we only want to ensure that the mutations are called at all
        // Whether they work correctly is tested in their respective unit tests
        expect(context.commit).to.be.calledWith("setDataTable");
        expect(context.commit).to.be.calledWith("initializeColumnToCategoryMap");
        expect(context.commit).to.be.calledWith("initializeDataDictionary");
    });
});