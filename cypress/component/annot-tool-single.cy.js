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

    it("each row has a button called Missing Value", () => {
        cy.mount(annotSingleTool, {
            propsData: props
        });
        cy.get('table')
            .find('tr')
            .each(row => {
                cy.wrap(row)
                .find('button')
                .should('exist');
            });

    });

});
