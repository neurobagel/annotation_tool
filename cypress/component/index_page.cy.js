import indexPage from "~/pages/index.vue";
import fileSelector from "~/components/file-selector.vue";


let store = {};

const stubs = {
    "file-selector": fileSelector
};

describe("The index page", () => {
    beforeEach(() => {
        store = {
            dispatch: () => {},
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

    // 2. Upload a data table and watch it come out as an action
    it("dispatches an action when a dataTable is loaded", () => {
        store.state.dataTable = [];
        cy.fixture("examples/good/example_short.tsv").as("exampleTable");
        cy.spy(store, 'dispatch').as('dispatchSpy');
        cy.mount(indexPage, {
            mocks: {
                $store: store
            },
            computed: store.getters,
            stubs: stubs,
            plugins: ["bootstrap-vue"]
        });
        cy.get("[data-cy='data-table-selector']").contains("Choose file").click().selectFile("@exampleTable");
        cy.get("@dispatchSpy").should("have.been.calledWith", "setDataTable", {
            "data": [
                [
                    "participant_id",
                    "age",
                    "sex"
                ],
                [
                    "sub-1",
                    "026Y",
                    "1"
                ],
                [
                    "sub-2",
                    "024Y",
                    "2"
                ]
            ],
            "filename": "example_short.tsv"
        });
        cy.get("[data-cy='data-table-selector']").contains("example_short.tsv");
    });
});



// 3. Upload a data dictionary and watch it come out as an action

