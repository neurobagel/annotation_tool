import categoryToolGroup from "~/components/category-toolgroup.vue";
import { getters } from "~/store";

let store;
let state;

describe("Tool Group component", () => {

    beforeEach(() => {
        state = {

            columnToCategoryMap: {
                column1: "Assessment Tool",
                column2: "Age",
                column3: "Assessment Tool"
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
            getters: {
                getColumnsForCategory: getters.getColumnsForCategory(state),
                getSelectedTools: getters.getSelectedTools(state)
            }
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
        // For now the tool groups come from inside the component and we know they will include MOCA
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

    it("if I have already made a tool, I cannot make another one    ", () => {
        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });
        // Do it the first time
        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        cy.get("[data-cy='toolgroup-select']").type("SomeOtherThing{enter}");
        // I hope nobody asks me to explain this
        cy.get("[data-cy='assessment-tool-table']")
            .find("tr:contains('MOCA')")
            .filter((index, element) => Cypress.$(element).text() === "MOCA")
            .should("have.length", 1);

        // Do it again
        // The reason this is expected to fail is because the dropdown will not permit the
        // user to type and enter again. Maybe we should make the assert more explicit
        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        cy.get("[data-cy='assessment-tool-table']")
            .find("tr:contains('MOCA')")
            .filter((index, element) => Cypress.$(element).text() === "MOCA")
            .should("have.length", 1);
    });

    it("when I click on a tool the tool gets highlighted", () => {
        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });
        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");

        // Grab the element background color before beiing
        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')")
        .invoke("css", "background-color").then((InitialBackgroundColor) => {
            cy.get("[data-cy='assessment-tool-table']")
            .find("tr:contains('MOCA')").click();
            // assert that element has different color after
            cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").should("not.have.css", "background-color", InitialBackgroundColor);
        });
    });

    it("when a tool is selected and I click on a column, the column gets highlighted", () => {
        cy.mount(categoryToolGroup, {
            mocks: {
                $store: store
            }
        });
        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        // select the first tool
        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").click();
        // Then the column gets highlighted
        cy.get("[data-cy='assessment-column-table']").find("tr:contains('column1')")
        .invoke("css", "background-color").then((InitialBackgroundColor) => {
            cy.get("[data-cy='assessment-column-table']")
            .find("tr:contains('column1')").click();
            // assert that element has different color after
            cy.get("[data-cy='assessment-column-table']").find("tr:contains('column1')").should("not.have.css", "background-color", InitialBackgroundColor);
        });
    });
});
