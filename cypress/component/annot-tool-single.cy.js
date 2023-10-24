import annotSingleTool from "~/components/annot-single-tool.vue";

const props = {
    name: "Hello",
    uniqueColumnValues: [
        {
            column: "column1",
            value: "val1"
        },
        {
            column: "column2",
            value: "val1"
        },
        {
            column: "column2",
            value: "val2"
        }
    ]
};


describe("Annotation tool component", () => {

    it("shows me a table of unique values when I provide the props", () => {
        cy.mount(annotSingleTool, {
            propsData: props
        });
        cy.get("table").should("exist");
        cy.get("table").contains("column1");

    });

    it("each row has a button called 'Mark as missing'", () => {
        cy.mount(annotSingleTool, {
            propsData: props
        });

        cy.get('table')
            .find('tr')
            .each((row, index) => {
                // skip the first (header) row
                if (index !== 0) {
                    cy.wrap(row)
                    .contains("Mark as missing");
                }
            });

    });

    it("clicking the missing value button emits a 'declareMissing' event", () => {
        const spy = cy.spy().as("emitSpy");
        cy.mount(annotSingleTool, {
            propsData: props,
            listeners: {
                declareMissing: spy
            }
        });

        cy.get('table')
            .find('tr')
            .eq(1) // Select the second row (0 index), see https://docs.cypress.io/api/commands/eq
            .then(row => {
                cy.wrap(row).contains("Mark as missing").click();
            });
        cy.get("@emitSpy")
            .should("have.been.calledWith", {
                column: "column1",
                value: "val1"
            });

    });

});
