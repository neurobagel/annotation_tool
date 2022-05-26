<template>

    <div>

        <b-card no-body class="annotation-card">

            <b-card-header>{{ uiText.generalInstructions }}</b-card-header>

            <b-card-body>

                <b-table striped :items="tableItems" :fields="fields" fixed>
                    
                    <!-- v-for="uniqueVal in vocabularyMapping[row.item.column_name][uniqueValues[row.item.column_name]]" -->
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
                    <!-- <b-button
                        :disabled="!saveButtonEnabled"
                        :variant="saveButtonColor"
                        @click="applyAnnotation()">
                        {{ uiText.saveButton }}
                    </b-button> -->
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

            filteredDataTable: { type: Array, default: () => [] },

            // Options contains 'mode' which is one of ["column", "row"]
            // column: Only the column names are mapped to vocabulary terms inside the data dictionary
            // row: The row values are mapped to vocabulary terms
            options: { type: Object, required: true },
            relevantColumns: { type: Array, required: true },
            uniqueValues: { type: Object, required: true }
        },

        inject: [

            "columnDescription",
            "dataTable",
            "isMissingValue",
            "missingColumnValues",
            "valueDescription"
        ],

        name: "AnnotVocabularyRow",

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

                // Text for UI elements
                uiText: {

                    generalInstructions: "Annotate each unique value",
                    placeholderText: "e.g. Parkinson's Disease",
                    saveButton: "Save Annotation",
                    vocabTermInstructions: "Please provide a SNOMED-CT term",
                    missingValueButton: "Missing value"
                },

                vocabularyMapping: {},

                vocabState: null
            };
        },

        computed: {

            canSaveAnnotation() {

                let hasUnmappedValues = false;

                // Look for unannotated values in the vocabulary map
                for ( const columnName in this.vocabularyMapping ) {

                    for ( const uniqueValue in this.vocabularyMapping[columnName] ) {

                        const mappedValue = this.vocabularyMapping[columnName][uniqueValue];

                        // Unannotated values are acceptable if they have been marked as missing
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

                    this.tableItems = this.refreshTableItems();
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

            // Load table data
            this.tableItems = this.refreshTableItems();
        },

        methods: {

            applyAnnotation() {

                // We want to use the annotated dataTable here in order to not overwrite previous
                // annotations from other components

                // 1. Create a local copy of the annotated table for transformation
                const transformedTable = structuredClone(this.dataTable.annotated);

                // 2. Transform all values in columns categorized as 'age' columns
                for ( let index = 0; index < transformedTable.length; index++ ) {
                    for ( const columnName in transformedTable[index] ) {

                        if ( this.relevantColumns.includes(columnName) ) {

                            if ( this.isMissingValue(columnName, transformedTable[index][columnName]) ) {

                                // TODO: this string should be replaced by an app-wide way to designate missing values
                                transformedTable[index][columnName] = "missing value";
                            } else {
                                transformedTable[index][columnName] = this.transformedValue(columnName, transformedTable[index][columnName]);
                            }

                        }
                    }
                }

                // 3. Trigger a save of this transformation to the annotated table in the store
                this.$emit("update:dataTable", {

                    transformHeuristics: this.vocabularyMapping,
                    transformedTable: transformedTable
                });
            },



            // saveButtonEnabled() {
            // hasUnmappedValues() {

            //     for ( const columnName in this.vocabularyMapping ) {

            //         const columnMappings = this.vocabularyMapping[columnName];

            //         // Column mapping may be unset
            //         if ( 0 === Object.keys(columnMappings).length ) {
            //             continue;
            //         }                    
                    
            //         for ( const uniqueValue in columnMappings ) {

            //             const mappedValue = columnMappings[uniqueValue];

            //             // The first time we find any mapped value that is empty
            //             // or unique value that is not missing, we return a status of false
            //             if ( 0 === mappedValue.trim().length &&
            //                  !this.isMissingValue(columnName, uniqueValue) ) {
            //                 return false;
            //             }                        
            //         }
            //     }

            //     // for ( const [columnName, columnMappings] of Object.entries(this.vocabularyMapping) ) {

            //     //     // Column mapping may be unset
            //     //     if ( null === columnMappings ) {
            //     //         continue;
            //     //     }

            //     //     for ( const [uniqueValue, mappedValue] of Object.entries(columnMappings) ) {

            //     //         // The first time we find any mapped value that is empty
            //     //         // or unique value that is not missing, we return a status of false
            //     //         if ( mappedValue.trim().length === 0 &&
            //     //              !this.isMissingValue(columnName, uniqueValue) ) {
            //     //             return false;
            //     //         }
            //     //     }
            //     // }
            //     return true;
            // },            

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

                console.log("initializeMapping()");

                // TODO: Revisit this once we have implemented the missing value components to make sure
                // we don't break things by later turning values into missing values

                // 1. Initialize the mapping as empty
                this.vocabularyMapping = {};

                // Create a mapping of the form { uniqueValue: "" } for each unique value
                for ( const columnName in this.uniqueValues ) {

                    this.vocabularyMapping[columnName] = {};

                    for ( const value of this.uniqueValues[columnName] ) {

                        this.vocabularyMapping[columnName][value] = "";
                    }
                }

                console.log(`this.uniqueValues: ${JSON.stringify(this.uniqueValues)}`);
                console.log(`this.vocabularyMapping: ${JSON.stringify(this.vocabularyMapping)}`);
            },

            refreshTableItems() {

                // This method generates the unique values that will be displayed in the UI for the user to annotate
                // Two modes exist:
                // row:     this mode shows the unique values in the relevantColumns (e.g. for diagnosis)
                // column:  this mode shows the relevantColumn names and let's the user annotate each column
                // In row mode, only values that are not declared as missing will be shown.

                const tableArray = [];

                // In 'row' mode create table entries for each value in the relevant columns

                // 1. Make a row for each unique column value
                for ( const columnName in this.uniqueValues ) {

                    for ( const value of this.uniqueValues[columnName]) {

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
                            tableArray.push({

                                column_name: columnName,
                                description: (null === valueDescription) ? "" : valueDescription,
                                raw_value: value,
                                select_a_vocabulary_term: mappedValue
                            });
                        }
                    }
                }

                return tableArray;
            },             

            storeMapping(p_columnName, p_uniqueValue, p_updatedValue) {

                // TODO: the implementation here is identical to the one in annot-discrete-choices.vue

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
