import categoryToolGroup from "~/components/category-toolgroup.vue";

let store;
let state;
let getters;

describe("Tool Group component", () => {

    beforeEach(() => {
        state = {

            columnToToolMap: {
                column1: 'cogatlas:MOCA',
                column2: null,
                column3: 'cogatlas:UPDRSIII'
            },

            toolTerms: [
                {label: 'MOCA', identifier: 'cogatlas:MOCA', selected: false},
                {label: 'UPDRSIII', identifier: 'cogatlas:UPDRSIII', selected: false},
                {label: 'SomeOtherThing', identifier: 'cogatlas:SomeOtherThing', selected: false},
                {label: 'AnotherThing', identifier: 'cogatlas:AnotherThing', selected: false}
            ]
        };
        getters = {
            getColumnsForCategory: () => (p_category) => {
                return ["column1", "column2", "column3"];
            },
            getSelectedTools: () => {
                return [
                    {label: 'MOCA', identifier: 'cogatlas:MOCA', selected: true},
                    {label: 'UPDRSIII', identifier: 'cogatlas:UPDRSIII', selected: true}
                ];
            }
        };
        store = {

            commit: () => {},
            state: state,
            getters: getters
        };
    });

    it("if nothing is selected or mapped, component is empty", () => {
        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: {
                getColumnsForCategory: () => (p_category) => {
                    return [];
                },
                getSelectedTools: () => {
                    return [];
                }
            }
        });

        cy.get("[data-cy='toolgroup-select']").should('not.exist');
        cy.get("[data-cy='assessment-tool-table']").should('not.exist');
        cy.get("[data-cy='assessment-column-table']").should('not.exist');

    });

    it("gets columns about assessment tools from the store and shows them to me", () => {

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: Object.assign(store.getters, {getSelectedTools: () => {
                return [];
            }})
        });

        cy.get("[data-cy='assessment-column-table']").should("be.visible");
        cy.get("[data-cy='assessment-column-table']").contains("column1");
        cy.get("[data-cy='assessment-column-table']").contains("column3");
    });

    it("before a tool is selected, all columns are unstyled", () => {
        store.state.columnToToolMap = {
                column1: null,
                column2: null,
                column3: null
        };

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: Object.assign(store.getters, {getSelectedTools: () => {
                return [];
            }})
        });

        cy.get("[data-cy='assessment-column-table']").find("tr:contains('column1')").should('not.have.class', 'category-style-5');
        cy.get("[data-cy='assessment-column-table']").find("tr:contains('column3')").should('not.have.class', 'category-style-5');

    });

    it("gets assessment tool names from the store and shows them in a dropdown", () => {
        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: store.getters
        });

        cy.get("[data-cy='toolgroup-select']").should("be.visible");
        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        cy.get("[data-cy='toolgroup-select']").should("contain", "MOCA");
    });

    it("selecting a tool group fires a createAssessmentTool mutation", () => {
        cy.spy(store, "commit").as("commitSpy");
        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: Object.assign(store.getters, {getSelectedTools: () => {
                return [];
            }})
        });

        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        cy.get("@commitSpy").should("have.been.calledWith", "createAssessmentTool", { identifier: 'cogatlas:MOCA', label: 'MOCA' });

    });

    it("clearing the dropdown selection does not crash the app", () => {
        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: Object.assign(store.getters, {getSelectedTools: () => {
                return [];
            }})
        });

        cy.get("[data-cy='toolgroup-select']").type("MOCA{enter}");
        cy.get("[data-cy='toolgroup-select']").get('button').eq(0).click();

    });

    it("when a tool is selected in the store, it appears in the tool table", () => {
        store.state.toolTerms[0]['selected'] = true;

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: store.getters
        });

        cy.get("[data-cy='assessment-tool-table']").contains('MOCA');
    });

    it("tools in the tool-table start unselected and become styled when clicked", () => {
        store.state.toolTerms[0]['selected'] = true;
        store.state.toolTerms[2]['selected'] = true;

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: store.getters
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

        cy.spy(store, "commit").as("commitSpy");

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: store.getters
        });
        cy.get("[data-cy='assessment-tool-table']").contains("MOCA").click();
        cy.get("@commitSpy").should("not.have.been.called");

    });

    it("when I click on a tool the tool gets highlighted", () => {
        store.state.toolTerms[0]['selected'] = true;

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: store.getters
        });

        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')")
        .invoke("css", "background-color").then((InitialBackgroundColor) => {
            cy.get("[data-cy='assessment-tool-table']")
            .find("tr:contains('MOCA')").click();
            // assert that element has different color after
            cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").should("not.have.css", "background-color", InitialBackgroundColor);
        });
    });

    it("clicking on column with tool fires mapping mutation every time", () => {
        store.state.toolTerms[0]['selected'] = true;

        cy.spy(store, "commit").as("commitSpy");

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: store.getters
        });

        cy.get("[data-cy='assessment-tool-table']").contains('MOCA').click();
        cy.get("[data-cy='assessment-column-table']").contains("column1").click();
        cy.get("@commitSpy").should("have.been.calledWith", "alterColumnToToolMapping", {columnName:"column1", toolIdentifier: "cogatlas:MOCA"});
        cy.get("[data-cy='assessment-column-table']").contains("column1").click();
        cy.get("@commitSpy").should("have.been.calledWith", "alterColumnToToolMapping", {columnName:"column1", toolIdentifier:  "cogatlas:MOCA"});
        cy.get("[data-cy='assessment-column-table']").contains("column3").click();
        cy.get("@commitSpy").should("have.been.calledWith", "alterColumnToToolMapping", {columnName: "column3", toolIdentifier: "cogatlas:MOCA"});
    });

    it("when a column is mapped to a tool and the tool gets selected, the column gets highlighted", () => {
        // MOCA
        store.state.toolTerms[0]['selected'] = true;
        // UPDRS
        store.state.toolTerms[1]['selected'] = true;

        cy.mount(categoryToolGroup, {
            mocks: { $store: store },
            computed: store.getters
        });
        // Starting out with a different tool selected and then checking the background color
        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").click();
        cy.get("[data-cy='assessment-column-table']").find("tr:contains('column3')")
        .invoke("css", "background-color").then((InitialBackgroundColor) => {
            cy.get("[data-cy='assessment-tool-table']")
            // Selecting the tool my column is mapped to should change my columns styling
            .find("tr:contains('UPDRSIII')").click();
            // assert that element has the same background color after
            cy.get("[data-cy='assessment-column-table']").find("tr:contains('column3')").should("have.css", "background-color", InitialBackgroundColor);
        });

        // Starting out with a different tool selected and then checking the opacity
        cy.get("[data-cy='assessment-tool-table']").find("tr:contains('MOCA')").click();
        cy.get("[data-cy='assessment-column-table']").find("tr:contains('column3')")
        .invoke("css", "opacity").then((InitialOpacity) => {
            cy.get("[data-cy='assessment-tool-table']")
            // Selecting the tool my column is mapped to should change my columns styling
            .find("tr:contains('UPDRSIII')").click();
            // assert that element has a different opacity after
            cy.get("[data-cy='assessment-column-table']").find("tr:contains('column3')").should("not.have.css", "Opacity", InitialOpacity);
        });
    });
});
