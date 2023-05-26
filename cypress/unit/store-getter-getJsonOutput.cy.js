import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        categoricalOptions: {

            "category1": [

                { label: "option1Label", identifier: "option1Identifier" }
            ],
            "category2": [

                { label: "option2Label", identifier: "option2Identifier" }
            ]
        },
        categories: {

            category1: {

                componentName: "annot-categorical",
                identifier: "category1Identifier"
            },
            category2: {

                componentName: "annot-continuous-values",
                identifier: "category2Identifier"
            }
        },
        columnToCategoryMap: {

            categoricalColumn: "category1",
            continuousColumn: "category2",
            uncategorizedColumn: null
        },
        dataDictionary: {

            annotated: {

                categoricalColumn: {

                    missingValues: [],
                    valueMap: { "rawValue1": "option1Identifier" }
                },
                continuousColumn: {

                    missingValues: ["1", "2", "3"],
                    transformationHeuristic: "transform1",
                    UserProvidedKey: "continuousColumnUserProvidedValue"
                },
                uncategorizedColumn: {

                    UserProvidedKey: "uncategorizedColumnUserProvidedValue"
                }
            }
        },
        transformationHeuristics: {

            "transform1": {

                Label: "transform1",
                TermURL: "transform1Identifier"
            }
        }
    }
};

describe("getJsonOutput", () => {

    it("Output data dictionary entries for data table columns are properly formatted according to their assigned data type", () => {

        // Act - Get data dictionary outputted in Neurobagel-BIDS format
        const jsonOutput = store.getters.getJsonOutput(store.state, store.getters);

        // Assert - Annotation tool's annotated data dictionary has been properly
        // transformed into the JSON format below for columns categorized as containing categorical data
        expect(jsonOutput["categoricalColumn"]).to.deep.equal({

            Annotations: {

                IsAbout: {

                    Label: "category1",
                    TermURL: "category1Identifier"
                },
                Levels: {

                    "rawValue1": {
                        Label: "option1Label",
                        TermURL: "option1Identifier"
                    }
                },
                MissingValues: []
            }
        });

        // Assert - Annotation tool's annotated data dictionary has been properly
        // transformed into the JSON format below for columns categorized as containing continuous data
        // Also includes extra user provided data dictionary definition and missing values
        expect(jsonOutput["continuousColumn"]).to.deep.equal({

            Annotations: {

                IsAbout: {
                    Label: "category2",
                    TermURL: "category2Identifier"
                },
                MissingValues: ["1", "2", "3"],
                Transformation: {

                    Label: "transform1",
                    TermURL: "transform1Identifier"
                }
            },
            UserProvidedKey: "continuousColumnUserProvidedValue"
        });

        // Assert - Annotation tool's annotated data dictionary has been properly transformed into the JSON format below for columns that have not been categorized
        expect(jsonOutput["uncategorizedColumn"]).to.deep.equal({ UserProvidedKey: "uncategorizedColumnUserProvidedValue" });
    });
});