import fileSelector from "~/components/file-selector.vue";
import homePage from "~/pages/home.vue";

let store = {};

const stubs = {

    "file-selector": fileSelector
};

describe("The Home page", () => {

    // Setup
    beforeEach(() => {

        store = {

            dispatch: () => {},
            state: {

                dataDictionary: { userProvided: {}, annotated: {} },
                dataTable: []
            }
        };
    });

    it("Mounts empty and displays all UI elements", () => {

        // Act
        cy.mount(homePage, {

            mocks: { $store: store },
            stubs: stubs,
            plugins: ["bootstrap-vue"]
        });

        // Assert
        cy.get("[data-cy='data-table-display']").should("not.exist");
        cy.get("[data-cy='data-table-selector']").should("be.visible").contains("Choose file");
        cy.get("[data-cy='data-dictionary-display']").should("not.exist");
        cy.get("[data-cy='data-dictionary-selector']").should("be.visible").contains("Choose file");
    });

    it("Shows a warning about not being able to reuse annotations in the data dictionary", () => {
        cy.mount(homePage, {

            mocks: { $store: store },
            stubs: stubs,
            plugins: ["bootstrap-vue"]
        });

        cy.get("[data-cy='cannot-reuse-annotations-button']").should('be.visible').contains("Cannot reuse annotations");
    });

    it("Correctly displays previews of the loaded data", () => {

        // Act
        cy.mount(homePage, {

            mocks: { $store: Object.assign({}, store, {

                getters: { getColumnNames: () => ["col1", "col2"] },
                state: {

                    dataTable: [

                        {"col1": "val1", "col2": "val2"},
                        {"col1": "val11", "col2": "val22"}
                    ],
                    dataDictionary: {

                        userProvided: {

                            "col1": "something",
                            "col2": "other"
                        },

                        annotated: {

                            "col1": "something",
                            "col2": "other"
                        }
                    }
                }
            })},
            computed: { getColumnNames: () => ["col1", "col2"] },
            stubs: stubs,
            plugins: ["bootstrap-vue"]
        });

        cy.get("[data-cy='data-table-display']").contains("val1");
        cy.get("[data-cy='data-table-display']").contains("val2");
        cy.get("[data-cy='data-dictionary-display']").contains('"col1": "something"');
    });

    it("Dispatches an action when a dataTable is loaded", () => {

        // Setup
        cy.fixture("examples/good/example_short.tsv").as("exampleTable");
        cy.spy(store, "dispatch").as("dispatchSpy");
        cy.mount(homePage, {

            mocks: { $store: store },
            stubs: stubs,
            plugins: ["bootstrap-vue"]
        });

        // Act
        cy.get("[data-cy='data-table-selector']").contains("Choose file").selectFile("@exampleTable");

        // Assert
        cy.get("@dispatchSpy").should("have.been.calledWith", "processDataTable", {
            "data": [
                [ "participant_id", "age", "sex" ],
                [ "sub-1", "026Y", "1" ],
                [ "sub-2", "024Y", "2" ]
            ],
            "filename": "example_short.tsv"
        });
        cy.get("[data-cy='data-table-selector']").contains("example_short.tsv");
    });

    it("Dispatches an action when a dataDictionary is loaded", () => {

        // Setup
        store.state.dataTable = [
            [ "participant_id", "age", "sex" ],
            [ "sub-1", "026Y", "1" ],
            [ "sub-2", "024Y", "2" ]
        ];
        cy.fixture("examples/good/example_short.json").as("exampleDictionary");
        cy.spy(store, "dispatch").as("dispatchSpy");
        cy.mount(homePage, {

            mocks: { $store: store },
            stubs: stubs,
            plugins: ["bootstrap-vue"]
        });

        // Act
        cy.get("[data-cy='data-dictionary-selector']").contains("Choose file").selectFile("@exampleDictionary");

        // Assert
        cy.get("@dispatchSpy").should("have.been.calledWith", "processDataDictionary", {
            "data": "{\"age\":{\"Description\":\"age of the participant\",\"Units\":\"years\"},\"sex\":{\"Description\":\"sex of the participant as reported by the participant\",\"Levels\":{\"M\":\"male\",\"F\":\"female\"}},\"group\":{\"Description\":\"diagnostic status determined by the study clinician at baseline\",\"Levels\":{\"AD\":\"individuals with Alzheimer's Disease\",\"HC\":\"healthy controls\",\"MCI\":\"individuals with Mild Cognitive Impairment\"}}}",
            "filename": "example_short.json"
        });
        cy.get("[data-cy='data-dictionary-selector']").contains("example_short.json");
    });
});
