import annotColumns from "~/components/annot-columns.vue";


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
    },
    mutations: {
        alterColumnCategoryMapping: () => ({ category, columnName }) => {}
    }
};

const props = {
    activeCategory: "someCategory"
};


describe("columns annotation", () =>  {
    it("displays columns mapped to the current category and their descriptions", () => {
        cy.mount(annotColumns, {
            computed: store.getters,
            propsData: props

        });
        const columns = ["column1", "column2", "column3"];
        columns.forEach(column => {
            cy.get("[data-cy='mappedColumns']").contains(column);
            cy.get("[data-cy='mappedColumns']").contains("descr_" + column);
        });

    });
    it("displays remove button and informs the store when a column is removed/unlinked at the click of the button", () => {
        cy.spy(store, 'commit').as('commitSpy');
        cy.mount(annotColumns, {
            computed: store.getters,
            propsData: props,
            mocks: {
                $store: store
            }
        });
        cy.get("[data-cy='remove_column2']").click();
        cy.get("@commitSpy").should("have.been.calledOnceWith", "alterColumnCategoryMapping", {category: "someCategory", columnName: "column2"});
    });
});


