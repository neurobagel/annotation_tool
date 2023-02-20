import annotContinuousValues from "~/components/annot-continuous-values";


const store = {

    commit: () => {},

    getters: {

        getHarmonizedPreview: () => (p_column, p_missingValue) => null,
        getHeuristic: () => (p_column) => null,
        getPreviewValues: () => (p_activeCategory) => {

            return {
                "column1": ["1Y", "11Y"],
                "column2": ["2,1", "22,1"]
            };
        },
        getTransformationHeuristics: () => (activeCategory) => {
            return ["float", "bounded", "euro", "range", "int", "string", "isoyear"];
        }
    },

    mutations: {

        // NOTE: changeMissingStatus reflects a future 'mark as missing' feature
        // for the continous value component
        changeMissingStatus: () => (p_columnName, p_rawValue, p_markAsMissing) => {},
        setHeuristic: () => (p_state, { p_column, p_heuristic }) => {}
    }
};

const props = {

    // TODO: This prop is currently necessary until new column-based heuristic feature is added
    activeCategory: "column1"
};

describe("Continuous values component", () => {

    it("Correctly displays preview values provided by the store", () => {

        // Act
        cy.mount(annotContinuousValues, {
            computed: store.getters,
            plugins: ["vue-select"],
            propsData: props
        });

        // Assert
        cy.get("[data-cy='dataTable']").then(table => {

            // TODO: Find a pattern to iterate over the values directly
            expect(table).to.contain("1Y");
            expect(table).to.contain("11Y");
            expect(table).to.contain("2,1");
            expect(table).to.contain("22,1");
        });
    });

    it("Can select a transformation and then dispatches it to the store", () => {

        // Setup
        cy.spy(store, "commit").as("commitSpy");
        cy.mount(annotContinuousValues, {
            computed: store.getters,
            mocks: { $store: store },
            plugins: ["vue-select"],
            propsData: props
        });

        // Act
        cy.get("[data-cy='selectTransform']").click();
        cy.get("[data-cy='selectTransform']")
            .find("li")
            .contains("float")
            .click();

        // Assert
        cy.get("@commitSpy").should("have.been.calledWith", "setHeuristic", { column: "column1", heuristic: "float" });
    });

    it("Applies a selected heuristic and previews transformed values", () => {

        // Act
        cy.mount(annotContinuousValues, {
            computed: Object.assign(store.getters, {
                getHeuristic: () => (p_column) => "float",
                getHarmonizedPreview: () => (p_column, p_missingValue) => p_column + "-" + p_missingValue + "-harmonized"
            }),
            propsData: props
        });

        // Assert
        cy.get("[data-cy='selectTransform']").contains("float");
        cy.get("[data-cy='dataTable']").then(table => {
            // TODO: Find a pattern to iterate over the values directly
            expect(table).to.contain("column1-1Y-harmonized");
            expect(table).to.contain("column1-11Y-harmonized");
            expect(table).to.contain("column2-2,1-harmonized");
            expect(table).to.contain("column2-22,1-harmonized");
        });
    });
});
