import { getters } from "~/store";

let store;
let originalValue;

describe("getHarmonizedPreview", () => {

    beforeEach(() => {

        store = {

            state: {

                appSetting: {

                    missingValueLabel: "missing value"
                },

                dataDictionary: {

                    annotated: {

                        column1: {

                            transformationHeuristic: ""
                        }
                    }
                }

            }
        };
    });

    it.only("float transformation", () => {

        console.log("Pre-setup");

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "float";
        originalValue = "42.6";

        console.log("Pre-act");

        // Act
        const harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        console.log("Pre-assert");

        // Assert
        expect(Number.isInteger(harmonizedValue)).to.be.false;
        expect(harmonizedValue).to.equal(42.6);
    });

    it("bounded transformation", () => {

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "bounded";


        // 1. Positive integer with "+" prepended

        // Setup
        originalValue = "+42";

        // Act
        let harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(42);

        // 2. Regular integer

        // Setup
        originalValue = "42";

        // Act
        harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(42);


        // 3. Negative integer

        // Setup
        originalValue = "-42";

        // Act
        harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(-42);

        // 4. Float value truncated

        // Setup
        originalValue = "42.6";

        // Act
        harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(42);
    });

    it("euro transformation", () => {

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "euro";
        originalValue = "42,6";

        // Act
        const harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(Number.isInteger(harmonizedValue)).to.be.false;
        expect(harmonizedValue).to.equal(42.6);
    });

    it("range transformation", () => {

        // 1. Integer range transformation

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "range";
        originalValue = "42-44";

        // Act
        let harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(43);

        // 2. Floating point range transformation

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "range";
        originalValue = "42-43";

        // Act
        harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(42.5);

    });

    it("int transformation", () => {

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "int";
        originalValue = "42.6";

        // Act
        const harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(42);
    });

    it("string transformation", () => {

        // Setup
        store.state.dataDictionary.annotated.column1.transformationHeuristic = "string";

        // Act
        const harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

        // Assert
        expect(harmonizedValue).to.equal(store.state.appSetting.missingValueLabel);
    });

    // it("isoyear transformation", () => {

    //     // Setup
    //     store.state.dataDictionary.annotated.column1.transformationHeuristic = "isoyear";
    //     originalValue = "22Y10M";

    //     // Act
    //     const harmonizedValue = getters.getHarmonizedPreview(store.state)("column1", originalValue);

    //     // Assert
    //     expect(harmonizedValue).to.equal(32);
    // });
});