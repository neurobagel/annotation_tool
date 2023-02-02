import annotContinuousValues from "~/components/annot-continuous-values";


const store = {

    commit: () => {},

    getters: {

        getActiveHeuristic: () => (column) => null,
        getHarmonizedPreview: () => (column, missingValue) => null,
        getPreviewValues: () => (activeCategory) => {
            return {
                "column1": ["1Y", "11Y"],
                "column2": ["2,1", "22,1"]
            };
        },
        getTransformHeuristics: () => (activeCategory) => {
            return ["float", "bounded", "euro", "range", "int", "string", "isoyear"];
        }
    },

    mutations: {

        setHeuristic: () => (p_state, { column, heuristic }) => {},
        designateAsMissing: () => (columnName, rawValue) => {}
    }
};


const props = {

    // TODO: This prop is currently necessary until new column-based heuristic feature is added
    activeCategory: "column1"
};

describe("continuous-values-component", () => {

    it("Correctly displays preview values provided by the store", () => {

        cy.mount(annotContinuousValues, {
            propsData: props,
            computed: store.getters,
            plugins: ["vue-select"]
        });

        cy.get("[data-cy='dataTable']").then(table => {
            // TODO: find a pattern to iterate over the values directly
            expect(table).to.contain("1Y");
            expect(table).to.contain("11Y");
            expect(table).to.contain("2,1");
            expect(table).to.contain("22,1");
        });
    });

    it("Can select a transformation and then dispatches it to the store", () => {

        cy.spy(store, "commit").as("commitSpy");

        cy.mount(annotContinuousValues, {

            propsData: props,
            computed: store.getters,
            mocks: { $store: store },
            plugins: ["vue-select"]
        });

        cy.get("[data-cy='selectTransform']").click();
        cy.get("[data-cy='selectTransform']")
            .find("li")
            .contains("float")
            .click();
        cy.get("@commitSpy").should('have.been.calledWith', "setHeuristic", { column: "column1", heuristic: "float" });
    });

    it("Applies a selected heuristic and previews transformed values", () => {

        cy.mount(annotContinuousValues, {
            propsData: props,
            computed: Object.assign(store.getters, {
                getActiveHeuristic: () => (column) => "float",
                getHarmonizedPreview: () => (column, missingValue) => column + "-" + missingValue + "-harmonized"
            })
        });

        cy.get("[data-cy='selectTransform']").contains("float");
        cy.get("[data-cy='dataTable']").then(table => {
            // TODO: find a pattern to iterate over the values directly
            expect(table).to.contain("column1-1Y-harmonized");
            expect(table).to.contain("column1-11Y-harmonized");
            expect(table).to.contain("column2-2,1-harmonized");
            expect(table).to.contain("column2-22,1-harmonized");
        });
    });
});
