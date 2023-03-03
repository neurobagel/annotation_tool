import annotContinuousValues from "~/components/annot-continuous-values";


let store;

const props = {

    activeCategory: "category1"
};

describe("Continuous values component", () => {

    beforeEach(() => {

        store = {

            commit: (p_mutationName, p_argument) => { store.mutations[p_mutationName](p_argument); },

            getters: {

                getHarmonizedPreview: () => (p_column, p_originalValue) => {

                    let convertedValue = "";

                    switch ( store.state.dataDictionary.annotated[p_column].transformationHeuristic ) {

                        case "euro":

                            convertedValue = parseFloat(p_originalValue.replace(",", "."));
                            break;
                    }

                    return convertedValue;
                },
                getHeuristic: () => (p_column) => {

                    return store.state.dataDictionary.annotated[p_column].transformationHeuristic;
                },
                getMappedColumns: () => (p_activeCategory) => {

                    return ["column1"];
                },
                getTransformOptions: () => (p_activeCategory) => {

                    // return ["float", "bounded", "euro", "range", "int", "string", "isoyear"];
                    return ["", "float", "bounded", "euro", "range", "int", "string"];
                },
                getUniqueValues: () => (p_activeCategory) => {

                    return {

                        column1: ["2,1", "22,1"]
                    };
                }
            },

            mutations: {

                // NOTE: changeMissingStatus reflects a future 'mark as missing' feature
                // for the continous value component
                changeMissingStatus: () => (p_columnName, p_rawValue, p_markAsMissing) => {},
                setHeuristic: ({ column, heuristic }) => {

                    store.state.dataDictionary.annotated[column].transformationHeuristic = heuristic;
                }
            },

            state: {

                dataDictionary: {

                    annotated: {

                        "column1": {

                            transformationHeuristic: ""
                        }
                    }
                }
            }
        };
    });

    it("Correctly displays blank preview value on mount", () => {

        // Act
        cy.mount(annotContinuousValues, {

            computed: store.getters,
            mocks: { $store: store },
            plugins: ["vue-select"],
            propsData: props
        });

        // Assert - With default transformation of "", preview values should be blank
        cy.get("[data-cy='dataTable-column1'] tr").eq(1)
          .find("td").eq(0)
          .should("contain", "");
        cy.get("[data-cy='dataTable-column1'] tr").eq(2)
          .find("td").eq(0)
          .should("contain", "");
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
        cy.get("[data-cy='selectTransform_column1']").click();
        cy.get("[data-cy='selectTransform_column1']")
            .find("li")
            .contains("float")
            .click();

        // Assert
        cy.get("@commitSpy").should("have.been.calledWith", "setHeuristic", { column: "column1", heuristic: "float" });
    });

    it("Applies a selected heuristic and previews transformed values", () => {

        // Setup
        cy.mount(annotContinuousValues, {

            computed: store.getters,
            mocks: { $store: store },
            plugins: ["vue-select"],
            propsData: props
        });

        // Act
        cy.get("[data-cy='selectTransform_column1']").click().contains("euro").click();

        // Assert - With euro transformation selected, preview values should have ',' replaced with '.'
        cy.get("[data-cy='dataTable-column1'] tr").eq(1)
          .find("td").eq(0)
          .should("contain", "2.1");
        cy.get("[data-cy='dataTable-column1'] tr").eq(2)
          .find("td").eq(0)
          .should("contain", "22.1");
    });
});
