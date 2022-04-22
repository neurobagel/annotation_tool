<template>

    <div>

        <b-card no-body class="annotation-card">

            <b-card-header>{{ uiText.instructions }}</b-card-header>

            <b-card-body>

                <b-table striped :items="displayTable" :fields="exampleFields" fixed>
                    <template #cell(select_a_vocabulary_term)="row">

                        <b-form-input
                            trim
                            aria-describedby="input-live-help input-live-feedback"
                            id="input-live"
                            @input="updateMapping($event, row.item)"
                            :placeholder="placeholder"
                            :state="vocabState"></b-form-input>

                        <!-- This will only be shown if the preceding input has an invalid state -->
                        <!-- 
                            <b-form-invalid-feedback id="input-live-feedback">
                                Enter at least 3 letters
                            </b-form-invalid-feedback>
                        -->

                        <!-- This is a form text block (formerly known as help block) -->
                        <b-form-text id="input-live-help">{{ instruction }}</b-form-text>

                    </template>
                </b-table>
                
                <!-- Button to save the annotated data of this tab to the store -->
                <b-row>     
                    <b-button
                        :disabled="saveButtonDisabled"
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
            
            filteredTable: { type: Array },
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
            "valueDescription"
        ],             

        name: "AnnotVocabulary",

        data() {

            return {

                saveButtonDisabled: true,

                // Text for UI elements
                uiText: {

                    instructions: "Annotate each unique value",
                    saveButton: "Save Annotation"
                },

                vocabularyMapping: {},

                vocabState: null,
            };
        },

        computed: {

            displayTable() {

                const tableArray = [];

                // If in 'column' mode, create table entries for each of the relevant columns
                if ( "column" === this.options.mode ) {

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
                }
                // Else, in 'row' mode create table entries for each value in the relevant columns
                else {

                    // 1. Make a row for each column value 
                    for ( const columnName of this.relevantColumns ) {

                        console.log("displayTable uniqueValues[" + columnName + "]: " + JSON.stringify(this.uniqueValues[columnName]));

                        for ( const value of this.uniqueValues[columnName]) {

                            // A. Get the value description from the data dictionary, if available
                            const valueDescription = this.valueDescription(columnName, value);

                            // B. Save the new row entry
                            tableArray.push({

                                column_name: columnName,
                                description: ( null === valueDescription ) ? "" : valueDescription,
                                raw_value: value
                            });
                        }
                    }
                }

                return tableArray;
            },            

            exampleFields() {

                const defaultFields = [

                    "column_name",
                    "description",
                    "select_a_vocabulary_term",
                ];

                if ( this.options.mode === "column" ) {
                    return defaultFields;
                }

                return [

                    "column_name",
                    "raw_value",
                    "description",
                    "select_a_vocabulary_term",
                ];
            },                     

            instruction() {

                let instructionText = "";
                switch ( this.options.mode ) {

                    case "column":
                        instructionText = "Please provide a Reproschema term";
                        break;
                    
                    case "row":
                        instructionText = "Please provide a SNOMED-CT term";
                        break;

                    default:
                        instructionText = "Please provide an appropriate vocabulary term";
                        break;
                }

                return instructionText;
            },            

            placeholder() {

                let placeHolderText = "";
                switch ( this.options.mode ) {

                    case "column":
                        placeHolderText = "e.g. MoCA";
                        break;

                    case "row":
                        placeHolderText = "e.g. Parkinson's Disease";
                        break;

                    default:
                        break;
                }

                return placeHolderText;
            },

            saveButtonColor() {

                // Bootstrap variant color of the button to save the annotation to the data table
                return ( !this.saveButtonDisabled ) ? "success" : "secondary";
            }
        },

        mounted() {
            
            // Initialize the mapping of all unique values as null
            this.initializeMapping();
        },        

        methods: {

            applyAnnotation() {

                // If this is 'row' mode
                if ( "row" === this.options.mode ) {

                    // We want to use the annotated dataTable here in order to not overwrite previous
                    // annotations from other components

                    // 1. Create a local copy of the annotated table for transformation
                    const transformedTable = structuredClone(this.dataTable.annotated);

                    // 2. Transform all values in columns categorized as 'age' columns
                    for ( let index = 0; index < transformedTable.length; index++ ) {
                        for ( const columnName in transformedTable[index] ) {

                                if ( this.relevantColumns.includes(columnName) ) {

                                    // TODO: if "value" is a missing value or doesn't fit the heuristic, this will currently break!
                                    transformedTable[index][columnName] = this.transformedValue(columnName, transformedTable[index][columnName]);
                                }
                        }
                    }

                    // 3. Trigger a save of this transformation to the annotated table in the store
                    this.$emit("update:dataTable", {

                        transformHeuristics: this.vocabularyMapping,
                        transformedTable: transformedTable
                    });
                } 
                // Else, this is 'column' mode
                else {

                    this.$emit("update:heuristics", {

                        transformHeuristics: this.vocabularyMapping,
                    });
                }
            },          

            checkAnnotationState() {

                let columnHasUnmappedValues = false;

                if ( "row" === this.options.mode ) {

                    // 1. Look for unannotated values in the vocabulary map
                    for ( const columnName in this.vocabularyMapping ) {

                        // A. Check to see if there is at least one unannotated value for this column
                        if ( Object.values(this.vocabularyMapping[columnName])
                                   .some((uniqueValue) => null === uniqueValue) ) {

                            columnHasUnmappedValues = true;
                            break;
                        }
                    }
                } 
                // Else, this is in "column" mode
                else {

                    // 1. Look for unannotated values in the vocabulary map
                    columnHasUnmappedValues = Object.values(this.vocabularyMapping)
                                                    .some((uniqueValue) => null === uniqueValue);
                }

                return columnHasUnmappedValues;
            },

            initializeMapping() {

                // TODO: Revisit this once we have implemented the missing value components to make sure
                // we don't break things by later turning values into missing values

                // 1. Initialize the mapping as empty
                this.vocabularyMapping = {};

                // If this is 'row' mode
                if ( "row" === this.options.mode ) {

                    // Create a mapping of the form { uniqueValue: null } for each unique value
                    for ( const columnName in this.uniqueValues ) {

                        this.vocabularyMapping[columnName] = {};

                        for ( const value of this.uniqueValues[columnName] ) {

                            console.log(`value: ${value}`);
                            this.vocabularyMapping[columnName][value] = null;
                        }
                    }
                } 
                // Else, this is 'column' mode
                else {

                    // TODO: Revisit why we do not have access to this.uniqueValues in column Mode.
                    for ( const columnName of this.relevantColumns ) {

                        this.vocabularyMapping[columnName] = null;
                    }
                }
            },

            transformedValue(p_columnName, p_value) {

                return this.vocabularyMapping[p_columnName][p_value];
            },

            updateMapping(p_newValue, p_tableRow) {

                console.log("annot-vocabulary:updateMapping");

                // 1. Update the mapping with the new value

                // If this is 'row' mode
                if ( "row" === this.options.mode ) {
                    this.vocabularyMapping[p_tableRow.column_name][p_tableRow.raw_value] = p_newValue;
                } 
                // Else, this is 'column' mode
                else {
                    this.vocabularyMapping[p_tableRow.column_name] = p_newValue;
                }

                // 2. Base the status of the disabled button on if annotation criteria have been met
                this.saveButtonDisabled = this.checkAnnotationState();
            }
        }
    }

</script>