import { getters } from "~/store";

let store;
const expectedCategoricalJson = {

    Annotations: {

        IsAbout: {

            Label: "Sex",
            TermURL: "nb:Sex"
        },
        Levels: {
            "M": {
                "Label": "male",
                "TermURL": "bids:male"
            },
            "F": {
                "Label": "female",
                "TermURL": "bids:female"
            }
        },
        MissingValues: []
    },
    Description: "sex of the participant as reported by the participant",
    Levels: {

        "M": "male",
        "F": "female"
    }
};
const expectedContinuousJson = {

    Annotations: {

        IsAbout: {

            Label: "Age",
            TermURL: "nb:Age"
        },
        MissingValues: [],
        Transformation: {
            Label: "bounded value",
            TermURL: "nb:FromBounded"
        }
    },
    Description: "age of the participant",
    Units: "years"
};

describe("getJsonOutput", () => {

    beforeEach(() => {

        store = {

            getters: {

                getCategoricalJsonOutput: (p_columnName) => {

                    return expectedCategoricalJson;
                },

                getColumnDataType: (p_columnName) => {

                    // Determine the category for this column
                    const category = store.state.columnToCategoryMap[p_columnName];

                    // Return the component type from the categories object
                    return ( null === category ) ? null : store.state.categories[category].componentName;
                },

                getContinuousJsonOutput: (p_columnName) => {

                    return expectedContinuousJson;
                },

                getJsonOutput: getters.getJsonOutput
            },

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
    });

    it("Output data dictionary entries for data table columns are properly formatted according to their assigned data type", () => {

        // Act - Get data dictionary outputted in Neurobagel-BIDS format
        const jsonOutput = store.getters.getJsonOutput(store.state, store.getters);

        // Assert - Annotation tool's annotated data dictionary has been properly
        // transformed into the JSON format below for columns categorized as containing categorical data
        expect(jsonOutput["categoricalColumn"]).to.deep.equal(expectedCategoricalJson);

        // Assert - Annotation tool's annotated data dictionary has been properly
        // transformed into the JSON format below for columns categorized as containing continuous data
        // Also includes extra user provided data dictionary definition and missing values
        expect(jsonOutput["continuousColumn"]).to.deep.equal(expectedContinuousJson);

        // Assert - Annotation tool's annotated data dictionary has been properly transformed into the JSON format below for columns that have not been categorized
        expect(jsonOutput["uncategorizedColumn"]).to.deep.equal({ UserProvidedKey: "uncategorizedColumnUserProvidedValue" });
    });
});