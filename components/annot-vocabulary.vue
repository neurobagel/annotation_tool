<template>

    <div>

        <b-card no-body class="annotation-card">

            <b-card-header>{{ uiText.generalInstructions }}</b-card-header>

            <b-card-body>

                <b-table striped :items="tableItems" :fields="fields" fixed>

                    <template #cell(select_a_vocabulary_term)="row">

                        <b-form-input
                            trim
                            aria-describedby="input-live-help input-live-feedback"
                            id="input-live"
                            v-model="row.item.select_a_vocabulary_term"
                            :placeholder="uiText.placeholderText"
                            :state="vocabState" />

                        <!-- This will only be shown if the preceding input has an invalid state -->
                        <!--
                            <b-form-invalid-feedback id="input-live-feedback">
                                Enter at least 3 letters
                            </b-form-invalid-feedback>
                        -->

                        <!-- This is a form text block (formerly known as help block) -->
                        <b-form-text id="input-live-help">
                            {{ uiText.vocabTermInstructions }}
                        </b-form-text>

                    </template>

                    <template #cell(missing_value)="row">
                        <b-button
                            variant="danger"
                            @click="declareMissing(row.item)">
                            {{ uiText.missingValueButton }}
                        </b-button>
                    </template>

                </b-table>

                <!-- Button to save the annotated data of this tab to the store -->
                <b-row>
                    <b-button
                        :disabled="canSaveAnnotation"
                        :variant="saveButtonColor"
                        @click="applyAnnotation()">
                        {{ uiText.saveButton }}
                    </b-button>
                </b-row>

            </b-card-body>

        </b-card>

    </div>

</template>

<script>

    export default {

        props: {

            relevantColumns: { default: () => [], required: true, type: Array },
            uniqueValues: { default: () => {}, required: true, type: Object }
        },

        inject: [

            "columnDescription",
            "dataTable",
            "isMissingValue",
            "missingColumnValues",
            "missingValueLabel",
            "valueDescription"
        ],

        name: "AnnotVocabulary",

        data() {

            return {

                fields: [

                    "column_name",
                    "raw_value",
                    "description",
                    "select_a_vocabulary_term",
                    "missing_value"
                ],

                tableItems: [],

                uiText: {

                    generalInstructions: "Annotate each unique value",
                    missingValueButton: "Mark as missing",
                    placeholderText: "e.g. Parkinson's Disease",
                    saveButton: "Save Annotation",
                    vocabTermInstructions: "Please provide a SNOMED-CT term"
                },

                vocabularyMapping: {},

                vocabState: null
            };
        },

        computed: {

            canSaveAnnotation() {

                // 1. Look for unannotated values in the vocabulary map
                let hasUnmappedValues = false;
                for ( const columnName in this.vocabularyMapping ) {

                    for ( const uniqueValue in this.vocabularyMapping[columnName] ) {

                        const mappedValue = this.vocabularyMapping[columnName][uniqueValue];

                        // A. Unannotated values are acceptable if they have been marked as missing
                        if ( "" === mappedValue && !this.isMissingValue(columnName, uniqueValue) ) {

                            hasUnmappedValues = true;
                            break;
                        }
                    }
                }

                return hasUnmappedValues;
            },

            saveButtonColor() {

                // Bootstrap variant color of the button to save the annotation to the data table
                return this.canSaveAnnotation ? "secondary" : "success";
            }
        },

        watch: {

            "$store.state.missingColumnValues": {

                deep: true,
                handler(p_newValue, p_oldValue) {

                    // When missing column values are updated in the store,
                    // Load table data from 'vocabularyMapping' and the data dictionary, if values are not missing
                    this.refreshTableItems();
                }
            },

            tableItems: {

                deep: true,
                handler(p_newValue, p_oldValue) {

                    // Update the mapping with the new value
                    for ( const row of p_newValue ) {
                        this.storeMapping(row.column_name, row.raw_value, row.select_a_vocabulary_term);
                    }
                }
            }
        },

        created() {

            // Initialize the mapping of all unique values as empty string
            this.initializeMapping();
        },

        mounted() {

            // Load table data from 'vocabularyMapping' and the data dictionary, if values are not missing
            this.refreshTableItems();
        },

        methods: {

            applyAnnotation() {

                // NOTE: We want to use the annotated dataTable here in order to not overwrite previous
                // annotations from other components

                // 1. Create a local copy of the annotated table for transformation
                const transformedTable = structuredClone(this.dataTable.annotated);

                // 2. Transform all values in columns categorized as 'age' columns
                for ( let index = 0; index < transformedTable.length; index++ ) {
                    for ( const columnName in transformedTable[index] ) {

                        if ( this.relevantColumns.includes(columnName) ) {

                            // A. Either save the updated value as 'missing' or save the annotated value
                            if ( this.isMissingValue(columnName, transformedTable[index][columnName]) ) {

                                transformedTable[index][columnName] = this.missingValueLabel;
                            } else {
                                transformedTable[index][columnName] = this.transformedValue(columnName, transformedTable[index][columnName]);
                            }
                        }
                    }
                }

                // 3. Trigger a save of this transformation to the annotated table in the store
                // NOTE: 'transformHeuristics' are currently not being saved to the store
                this.$emit("update:dataTable", {

                    // transformHeuristics: this.vocabularyMapping,
                    transformedTable: transformedTable
                });
            },

            declareMissing(p_row) {

                // 1. Remove the item from the table
                let indexToDelete = -1;
                for ( let index = 0; index < this.tableItems.length; index++ ) {

                    if ( this.tableItems[index].column_name == p_row.column_name ) {

                        indexToDelete = index;
                        break;
                    }
                }
                this.$delete(this.tableItems, indexToDelete);

                // 2. Set the current mapping to empty string
                this.storeMapping(p_row.column_name, p_row.raw_value, "");

                // 3. Send missing value to store
                this.$emit("update:missingValue", {

                    column: p_row.column_name,
                    value: p_row.raw_value
                });
            },

            initializeMapping() {

                // 1. Initialize the mapping as empty
                this.vocabularyMapping = {};

                // 2. Create a mapping of the form { uniqueValue: "" } for each unique value
                for ( const columnName in this.uniqueValues ) {

                    this.vocabularyMapping[columnName] = {};

                    for ( const value of this.uniqueValues[columnName] ) {

                        this.vocabularyMapping[columnName][value] = "";
                    }
                }
            },

            refreshTableItems() {

                // This method generates the unique values that will be displayed in the UI for the user to annotate.
                // It shows the unique values of relevantColumns (e.g. for diagnosis) and lets the user annotate each.
                // Only values that are not declared as missing will be shown.

                // Create table entries for each value in the relevant columns

                // 0. Wipe the table
                this.tableItems = [];

                // 1. Make a row for each unique column value
                for ( const columnName in this.vocabularyMapping ) {

                    for ( const value of Object.keys(this.vocabularyMapping[columnName]) ) {

                        // Only display values for annotation that are not declared as missing by the user
                        if ( !this.isMissingValue(columnName, value) ) {

                            // A. Get the value description from the data dictionary, if available
                            const valueDescription = this.valueDescription(columnName, value);

                            // B. Get the mapped value if it already exists
                            let mappedValue = "";
                            if ( Object.keys(this.vocabularyMapping).includes(columnName) ) {

                                mappedValue = this.vocabularyMapping[columnName][value];
                            }

                            // C. Save the new row entry
                            this.tableItems.push({

                                column_name: columnName,
                                description: (null === valueDescription) ? "" : valueDescription,
                                raw_value: value,
                                select_a_vocabulary_term: mappedValue
                            });
                        }
                    }
                }
            },

            storeMapping(p_columnName, p_uniqueValue, p_updatedValue) {

                // 1. Merge the inner level (e.g. the mapping for the p_columnName)
                const innerUpdate = Object.assign(
                    this.vocabularyMapping[p_columnName],
                    { [p_uniqueValue]: p_updatedValue }
                );

                // 2. Merge the outer layer (e.g. the complete mapping object)
                this.vocabularyMapping = Object.assign(
                    {},
                    this.vocabularyMapping,
                    { [p_columnName]: innerUpdate }
                );
            },

            transformedValue(p_columnName, p_value) {

                return this.vocabularyMapping[p_columnName][p_value];
            }
        }
    };

</script>
