<template>

    <div>

        <b-card no-body class="annotation-card">

            <b-card-header>{{ uiText.generalInstructions }}</b-card-header>

            <b-card-body>

                <b-table striped :items="displayTable" :fields="fields" fixed>
                    
                    <template #cell(select_a_vocabulary_term)="row">

                        <!-- <b-form-input
                            trim
                            aria-describedby="input-live-help input-live-feedback"
                            id="input-live"
                            @input="updateMapping($event, row.item)"
                            :placeholder="placeholder"
                            :state="vocabState" /> -->

                        <b-form-input
                            trim
                            aria-describedby="input-live-help input-live-feedback"
                            id="input-live"
                            v-model="vocabularyMapping[row.item.column_name][uniqueValues[row.item.column_name]]"
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
                        :disabled="!saveButtonEnabled"
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

            "dataTable",
            "columnDescription",
            "valueDescription",
            "isMissingValue"
        ],

        name: "AnnotVocabularyColumn",

        data() {

            return {

                fields: [

                    "column_name",
                    "description",
                    "select_a_vocabulary_term",
                    "missing_value"
                ],                

                saveButtonDisabled: true,

                // Text for UI elements
                uiText: {

                    generalInstructions: "Annotate each unique value",
                    placeholderText: "e.g. MoCA",
                    saveButton: "Save Annotation",
                    vocabTermInstructions: "Please provide a SNOMED-CT term",
                    missingValueButton: "Missing value"
                },

                vocabularyMapping: {},

                vocabState: null
            };
        },

        computed: {

            displayTable() {

                // This method generates the unique values that will be displayed in the UI for the user to annotate
                // Two modes exist:
                // row:     this mode shows the unique values in the relevantColumns (e.g. for diagnosis)
                // column:  this mode shows the relevantColumn names and let's the user annotate each column
                // In row mode, only values that are not declared as missing will be shown.

                const tableArray = [];

                // If in 'column' mode, create table entries for each of the relevant columns
                
                // 1. Make a row for each column
                for ( const columnName of this.relevantColumns ) {

                    // A. Get the column description
                    const columnDescription = this.columnDescription(columnName);

                    // B. Save the new row entry
                    tableArray.push({

                        column_name: columnName,
                        description : ( null === columnDescription ) ? "" : columnDescription
                    });
                }

                return tableArray;
            },

            saveButtonEnabled() {

                for ( const columnName in this.vocabularyMapping ) {

                    const mappedValue = this.vocabularyMapping[columnName];

                    // The first time we find any mapped value that is empty
                    // or unique value that is not missing, we return a status of false
                    if ( 0 === mappedValue.trim().length &&
                         !this.isMissingValue(columnName, mappedValue) ) {
                        return false;
                    }                        
                }

                // for ( const [columnName, columnMappings] of Object.entries(this.vocabularyMapping) ) {

                //     // Column mapping may be unset
                //     if ( null === columnMappings ) {
                //         continue;
                //     }

                //     for ( const [uniqueValue, mappedValue] of Object.entries(columnMappings) ) {

                //         // The first time we find any mapped value that is empty
                //         // or unique value that is not missing, we return a status of false
                //         if ( (mappedValue === null || mappedValue.trim().length === 0) &&
                //              !this.isMissingValue(columnName, uniqueValue) ) {
                //             return false;
                //         }
                //     }
                // }

                return true;
            },

            saveButtonColor() {

                // Bootstrap variant color of the button to save the annotation to the data table
                return this.saveButtonEnabled ? "success" : "secondary";
            }
        },

        watch: {

            displayTable: {
      
                deep: true,
                handler (p_newValue, p_oldValue) {

                    // 1. Update the mapping with the new value
                    for ( const row of p_newValue ) {
                        this.vocabularyMapping[row.column_name] = row.select_a_vocabulary_term;
                    }

                    // 2. Base the status of the disabled button on if annotation criteria have been met
                    this.saveButtonDisabled = this.checkAnnotationState();                    
                }
            }

            // updateMapping(p_newValue, p_tableRow) {

            //     // 1. Update the mapping with the new value

            //     // If this is 'row' mode
            //     if ( "row" === this.options.mode ) {
            //         this.storeMapping(p_tableRow.column_name, p_tableRow.raw_value, p_newValue);
            //     }
            //     // Else, this is 'column' mode
            //     else if ( "column" === this.options.mode ) {
            //         this.vocabularyMapping[p_tableRow.column_name] = p_newValue;
            //     }

            //     // 2. Base the status of the disabled button on if annotation criteria have been met
            //     this.saveButtonDisabled = this.checkAnnotationState();
            // }            
        },

        created() {

            // Initialize the mapping of all unique values as empty string
            this.initializeMapping();
        },

        methods: {

            applyAnnotation() {

                this.$emit("update:heuristics", {

                    transformHeuristics: this.vocabularyMapping
                });
            },

            checkAnnotationState() {

                // Look for unannotated values in the vocabulary map
                return Object.values(this.vocabularyMapping)
                    .some((uniqueValue) => "" === uniqueValue);
            },

            declareMissing(p_row) {

                // 1. Set the current mapping to ""
                this.storeMapping(p_row.column_name, p_row.raw_value, "");

                // 2. Send missing value to store
                this.$emit("update:missingValue", {

                    column: p_row.column_name,
                    value: p_row.raw_value
                });
            },            

            initializeMapping() {

                // TODO: Revisit this once we have implemented the missing value components to make sure
                // we don't break things by later turning values into missing values

                // 1. Initialize the mapping as empty
                this.vocabularyMapping = {};

                // TODO: Revisit why we do not have access to this.uniqueValues in column mode.
                for ( const columnName of this.relevantColumns ) {

                    this.vocabularyMapping[columnName] = "";
                }
            },

            storeMapping(columnName, uniqueValue, updatedValue) {

                // TODO: the implementation here is identical to the one in annot-discrete-choices.vue

                // 1. Merge the inner level (e.g. the mapping for the columnName)
                const innerUpdate = Object.assign(
                    this.vocabularyMapping[columnName],
                    { [uniqueValue]: updatedValue}
                );

                // 2. Merge the outer layer (e.g. the complete mapping object)
                this.vocabularyMapping = Object.assign(
                    {},
                    this.vocabularyMapping,
                    { [columnName]: innerUpdate }
                );
            },

            transformedValue(p_columnName, p_value) {

                return this.vocabularyMapping[p_columnName][p_value];
            }            
        }
    };

</script>
