import { getters } from "~/store";

describe("The getAnnotationComponent getter", () => {

    let store = {};

    beforeEach(() => {

        store = {

            state: {

                categories: {

                    "Subject ID": {},
                    "Age": {

                        componentName: "annot-continuous-values"
                    },
                    "Sex": {

                        componentName: "annot-categorical"
                    },
                    "Diagnosis": {

                        componentName: "annot-categorical"
                    }
                }
            }
        };
    });

    it("Get the component name for the 'Age' category", () => {

        // Act
        const componentName = getters.getAnnotationComponent(store.state)("Age");

        // Assert
        expect(componentName).to.equal("annot-continuous-values");
    });

    it("Get the component name for the 'Sex' category", () => {

        // Act
        const componentName = getters.getAnnotationComponent(store.state)("Sex");

        // Assert
        expect(componentName).to.equal("annot-categorical");
    });

    it("Get the component name for the 'Diagnosis' category", () => {

        // Act
        const componentName = getters.getAnnotationComponent(store.state)("Diagnosis");

        // Assert
        expect(componentName).to.equal("annot-categorical");
    });
});