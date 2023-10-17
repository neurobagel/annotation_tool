import categoryToolGroup from "~/components/category-toolgroup.vue";
import { getters } from "~/store";

let store;
let state;

// TODO see if we can replace this by manipulating state and passing by reference
const makeGetters =(state) => {
    return {
        getColumnsForCategory: getters.getColumnsForCategory(state),
        getSelectedTools: getters.getSelectedTools(state)
    };
};

describe("Tool Group component", () => {

    beforeEach(() => {
        state = {

            columnToCategoryMap: {
                column1: "Assessment Tool",
                column2: "Age",
                column3: "Assessment Tool"
            },

            columnToToolMap: {
                column1: 'cogatlas:MOCA',
                column2: null,
                column3: 'cogatlas:UPDRSIII'
            },

            dataDictionary: {

                annotated: {

                    column1: { missingValues: [] },
                    column2: { missingValues: [] },
                    column3: { missingValues: ["column3_value1", "column3_value2"] }
                }
            },

            dataTable: [

                { column1: 1, column2: "column2_value1", column3: "column3_value1" },
                { column1: 2, column2: "column2_value2", column3: "column3_value2" },
                { column1: 1, column2: "column2_value3", column3: "column3_value3" },
                { column1: 3, column2: "column2_value2", column3: "column3_value4" }
            ],

            toolTerms: [
                {label: 'MOCA', id: 'cogatlas:MOCA', selected: false},
                {label: 'UPDRSIII', id: 'cogatlas:UPDRSIII', selected: false},
                {label: 'SomeOtherThing', id: 'cogatlas:SomeOtherThing', selected: false},
                {label: 'AnotherThing', id: 'cogatlas:AnotherThing', selected: false}
            ]
        };
        store = {

            commit: () => {},
            state: state,
            getters: makeGetters(state)
        };
    });

    it("mounts", () => {
        cy.mount(categoryToolGroup, {
            mocks: {

                $store: store
            }
        });

    });

    it("has a table of columns about assessment tools on the right", () => {

        cy.mount(categoryToolGroup, {
            mocks: {

                $store: store
            }
        });

        cy.get("[data-cy='assessment-column-table']").should("be.visible");

    });

    it("gets columns about assessment tools from the store and shows them to me", () => {

        cy.mount(categoryToolGroup, {
            mocks: {

                $store: store
            }

        });

        cy.get("[data-cy='assessment-column-table']").contains("column1");
        cy.get("[data-cy='assessment-column-table']").contains("column3");
    });

    it("gets assessment tool names from the store and shows them in a dropdown", () => {
        cy.mount(categoryToolGroup, {
            mocks: {

                $store: store
            }
        });

        cy.get("[data-cy='toolgroup-select']").should("be.visible");
        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        cy.get("[data-cy='toolgroup-select']").should("contain", "MOCA");
    });

    it("selecting a tool group fires a createTool mutation", () => {
        cy.spy(store, "commit").as("commitSpy");
        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });

        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        cy.get("@commitSpy").should("have.been.calledWith", "createTool", { identifier: 'cogatlas:MOCA', label: 'MOCA' });


    });

    it("when a tool is selected in the store, it appears in the tool table", () => {
        store.state.toolTerms[0]['selected'] = true;
        store.getters = makeGetters(store.state);
        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });

        cy.get("[data-cy='assessment-tool-table']").contains('MOCA');
    });

    it("tools in the tool-table start unselected and become styled when clicked", () => {
        store.state.toolTerms[0]['selected'] = true;
        store.state.toolTerms[2]['selected'] = true;
        store.getters = makeGetters(store.state);
        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });

        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')")
        .invoke("css", "background-color").then((InitialBackgroundColor) => {
            cy.get("[data-cy='assessment-tool-table']")
            .find("tr:contains('MOCA')").click();
            // assert that element has different color after
            cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").should("not.have.css", "background-color", InitialBackgroundColor);
        });
    });

    it("if a tool is already created, trying to create it again has no effect", () => {
        store.state.toolTerms[0]['selected'] = true;
        store.getters = makeGetters(store.state);

        cy.spy(store, "commit").as("commitSpy");

        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });
        cy.get("[data-cy='assessment-tool-table']").contains("MOCA").click();
        cy.get("@commitSpy").should("not.have.been.called");

    });

    it("when I click on a tool the tool gets highlighted", () => {
        store.state.toolTerms[0]['selected'] = true;
        store.getters = makeGetters(store.state);

        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });

        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')")
        .invoke("css", "background-color").then((InitialBackgroundColor) => {
            cy.get("[data-cy='assessment-tool-table']")
            .find("tr:contains('MOCA')").click();
            // assert that element has different color after
            cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").should("not.have.css", "background-color", InitialBackgroundColor);
        });
    });

    it("when a tool is selected and I click on a column, the column gets mapped to the tool", () => {
        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });

        cy.get().should('be.invisilbe');
    });

    it("when a column is mapped to a tool and the tool gets selected, the column gets highlighted", () => {
        // MOCA
        store.state.toolTerms[0]['selected'] = true;
        // UPDRS
        store.state.toolTerms[1]['selected'] = true;
        store.getters = makeGetters(store.state);

        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });
        // Starting out with a different tool selected
        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").click();
        cy.get("[data-cy='assessment-column-table']").find("tr:contains('column3')")
        .invoke("css", "background-color").then((InitialBackgroundColor) => {
            cy.get("[data-cy='assessment-tool-table']")
            // Selecting the tool my column is mapped to should change my columns styling
            .find("tr:contains('UPDRSIII')").click();
            // assert that element has different color after
            cy.get("[data-cy='assessment-column-table']").find("tr:contains('column3')").should("not.have.css", "background-color", InitialBackgroundColor);
        });
    });
});
