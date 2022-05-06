<template>

    <div>

        <b-card
            no-body
            class="annotation-card">

            <b-card-header>{{ uiText.instructions }}</b-card-header>

            <b-card-body>

                <b-table
                    striped
                    :fields="exampleFields"
                    :items="displayTable">
                    <template #cell(select_an_appropriate_mapping)="row">

                        <!-- Bootstrap-Vue doesn't have a great option here so I am using https://vue-select.org/ -->
                        <!-- NOTE: We use the $event statement to add the row data to the payload of the @input
                            event without replacing the original event payload -->
                        <v-select
                            label="Standard"
                            :options="options"
                            @input="updateMapping($event, row.item)" />
                    </template>
                </b-table>

                <!-- Button to save the annotated data of this tab to the store -->
                <b-row>
                    <b-button
                        :disabled="saveButtonDisabled"
                        :variant="saveButtonColor"
                        @click="applyAnnotation">
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
            options: {

                type: Array,
                // Default values for Arrays or Objects have to be created with constructor functions
                // see: https://vuejs.org/guide/components/props.html#prop-validation
                default() {
                    // TODO: We currently let users tell us about a missing value in the same way they annotate real values
                    // we should instead have a separate mechanism to identify missing values
                    return ["default category", "missing value"];
                },
                required: true
            },
            relevantColumns: { type: Array, required: true },
            uniqueValues: { type: Object, required: true }
        },

        inject: [

            "dataTable"
        ],

        name: "AnnotDiscreteValues",

        data() {

            return {

                saveButtonDisabled: true,

                exampleFields: [

                    "column_name",
                    "raw_value",
                    "select_an_appropriate_mapping"
                ],

                // Text for UI elements
                uiText: {

                    instructions: "Annotate each unique value",
                    saveButton: "Save Annotation"
                },

                valueMapping: {}
            };
        },

        computed: {

            displayTable() {

                // Create and return table data list column name and corresponding value for all unique values in the relevant columns
                const tableData = [];
                for ( const columnName of this.relevantColumns ) {
                    for ( const value of this.uniqueValues[columnName] ) {
                        tableData.push({

                            column_name: columnName,
                            raw_value: value
                        });
                    }
                }

                return tableData;
            },

            saveButtonColor() {

                // Bootstrap variant color of the button to save the annotation to the data table
                return ( !this.saveButtonDisabled ) ? "success" : "secondary";
            }
        },

        watch: {

            relevantColumns(p_newColumns, p_oldColumns) {

                const removedColumns = p_oldColumns.filter(column => !p_newColumns.includes(column));

                if ( removedColumns.length > 0 ) {

                    // There has been at least one column removed from this component's category,
                    // possibly via the annot-columns component 'remove' action
                    for ( const columnName of removedColumns ) {

                        // We cannot just remove the key from the object with a normal
                        // JS delete operator because then Vue wouldn't be aware of it.
                        // See also: https://v2.vuejs.org/v2/api/?redirect=true#vm-delete
                        this.$delete(this.valueMapping, columnName);
                    }

                    // TODO: Check if we need to also handle the case where a column is added
                }

                // Determine whether at least one annotation has occurred
                // and set the disabled status of the save annotation button
                this.saveButtonDisabled = !this.checkAnnotationState();
            }
        },

        mounted() {

            // Initialize the mapping of all unique values as null
            this.initializeMapping();
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

                            // TODO: If "value" is a missing value or doesn't fit the heuristic, this will currently break!
                            transformedTable[index][columnName] = this.transformedValue(columnName, transformedTable[index][columnName]);
                        }
                    }
                }

                // 3. Trigger a save of this transformation to the annotated table in the store
                this.$emit("update:dataTable", {

                    transformHeuristics: this.valueMapping,
                    transformedTable: transformedTable
                });
            },

            checkAnnotationState() {

                // 1. Begin with the assumption that there are no annotations
                let hasAnnotation = false;

                // 2. Attempt to find at least one value as having been annotated
                for ( const columnName in this.valueMapping ) {

                    // A. Check for an annotated value in the column
                    if ( Object.values(this.valueMapping[columnName]).some(
                        (uniqueValue) => null !== uniqueValue) ) {
                        hasAnnotation = true;
                        break;
                    }
                }

                // Return whether or not there is at least one annotation
                return hasAnnotation;
            },

            initializeMapping() {

                // TODO: Revisit this once we have implemented the missing value components to make sure
                // we don't break things by later turning values into missing values

                // Initialize the mapping as empty
                this.valueMapping = {};
                for ( const [colName, uniqueValues] of Object.entries(this.uniqueValues) ) {

                    // Now we will create a mapping of the form { uniqueVale: null } for each unique value
                    this.valueMapping[colName] = Object.fromEntries(
                        uniqueValues.map((uniqueValue) => [uniqueValue, null])
                    );
                }
            },

            removeRow(p_row) {

                // TODO: Use this method to move unique values to the missing value category
                return p_row;
            },

            transformedValue(p_columnName, p_value) {

                // Return the annotated version of this column's raw value
                return this.valueMapping[p_columnName][p_value];
            },

            updateMapping(p_selectedValue, p_row) {

                // 1. Update the local annotation value map with the selected, new annotation value
                this.valueMapping[p_row.column_name][p_row.raw_value] = p_selectedValue;

                // 2. Determine whether all unique values have now been mapped to something
                // and set the disabled status of the save annotation button
                // TODO: This might be better suited for a computed property, but this seems to break reactivity
                this.saveButtonDisabled = !this.checkAnnotationState();
            }
        }
    };

</script>
