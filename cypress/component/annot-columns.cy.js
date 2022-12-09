import AnnotatePartAnnotatedColumns from "~/components/annot-columns.vue";


const store = {
    commit: () => {},
    getters: {
        getMappedColumns: () => (activeCategory) => {
            return [
                    "column1",
                    "column2",
                    "column3"
            ];
        },
        getColumnDescription: () => (columnName) => {
            return "descr_" + columnName;
        }
    }
};

const props = {
    activeCategory: "someCategory"
};


describe("columns annotation", () =>  {
    it("displays columns mapped to the current category and their descriptions", () => {
        cy.mount(AnnotatePartAnnotatedColumns, {
            computed: store.getters,
            propsData: props

        });
        const columns = ["column1", "column2", "column3"];
        columns.forEach(column => {
            cy.get("[data-cy='mappedColumns']").contains(column);
            cy.get("[data-cy='mappedColumns']").contains("descr_" + column);
        });

    });
});


