import indexPage from "~/pages/index.vue";
import fileSelector from "~/components/file-selector.vue";


let store = {};

const stubs = {
    "file-selector": fileSelector
};

describe("The index page", () => {
    beforeEach(() => {
        store = {
            getters: {
                getColumnNames: () => [
                        "col1",
                        "col2"
                    ]
            },
            state: {
                dataTable: [
                    {"col1": "val1", "col2": "val2"},
                    {"col1": "val11", "col2": "val22"}
                ],
                dataDictionary: {
                    "col1": "something",
                    "col2": "other"
                }

            }
        };

    });

    it("mounts empty and displays all UI elements", () => {
        cy.mount(indexPage, {
            mocks: {
                $store: Object.assign(store, {
                    getters: store.getters,
                    state: {
                        dataTable: [],
                        dataDictionary: {}
                    }
                })
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
    it("correctly displays previews of the loaded data", () => {
        cy.mount(indexPage, {
            mocks: {
                $store: store
            },
            computed: store.getters,
            stubs: stubs,
            plugins: ["bootstrap-vue"]
        });
        // Because we're looking at an input field, we need to assert over the value and
        // can't just use .contains as usual
        cy.get("[data-cy='data-table-display']").should('include.value', 'val1\tval2');
        cy.get("[data-cy='data-dictionary-display']").should('include.value', '"col1": "something"');

    });
});
// 2. Upload a data table and watch it come out as an action
// 3. Upload a data dictionary and watch it come out as an action
// 4. Also make sure all of this is accurately represented in the UI.