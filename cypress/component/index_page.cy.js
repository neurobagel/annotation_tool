import indexPage from "~/pages/index.vue";
import fileSelector from "~/components/file-selector.vue";


const store = {
    getters: {
        isdataDictionaryLoaded: () => false,
        isDataTableLoaded: () => false,
        getColumnNames: () => [
                "participant_id",
                "age",
                "sex"
            ]
    },
    state: {

    }
};

const stubs = {
    "file-selector": fileSelector
};

describe("The index page", () => {
    it("displays all elements correctly", () => {
        cy.mount(indexPage, {
            mocks: {
                $store: store
            },
            computed: store.getters,
            stubs: stubs,
            plugins: ["bootstrap-vue"]
            });
            cy.get("[data-cy='data-table-display']").should("be.visible.and.empty");
            cy.get("[data-cy='data-table-selector']").should("be.visible").contains("Choose file");
            cy.get("[data-cy='data-dictionary-display']").should("be.visible.and.empty");
            cy.get("[data-cy='data-dictionary-selector']").should("be.visible").contains("Choose file");

        }
    );
});
// 2. Upload a data table and watch it come out as an action
// 3. Upload a data dictionary and watch it come out as an action
// 4. Also make sure all of this is accurately represented in the UI.