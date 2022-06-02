<template>

    <div>

        <b-card class="annotation-card">

            <b-card-header>
                {{ uiText.generalInstructions }}
            </b-card-header>

            <b-card-body>

                <b-tabs content-class="mt-3">

                    <b-tab
                        v-for="(itemName, index) in relevantColumns"
                        :key="itemName"
                        :active="0 === index"
                        :title="itemName"
                        :title-link-class="annotatedTabColor(itemName) ">

                        <b-table
                            fixed
                            striped
                            :fields="fields"
                            :items="tableItems[itemName]">

                            <!--  -->

                            <template #cell(annotated_value)="row">
                                <b-form-input
                                    trim
                                    v-model="row.item.annotated_value"
                                    @input="changeTableItem(itemName, row.item)"
                                    aria-describedby="input-live-help input-live-feedback"
                                    :placeholder="uiText.placeholderText"
                                    :state="vocabState" />

                                <b-form-text id="input-live-help">
                                    {{ uiText.termInstructions }}
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

                    </b-tab>

                </b-tabs>

            </b-card-body>

        </b-card>

        <!-- Button to save the annotated data of all group items to the store -->
        <b-row>
            <b-button
                :disabled="!canSaveAnnotation"
                :variant="saveButtonColor"
                @click="applyAnnotation()">
                {{ uiText.saveButton }}
            </b-button>
        </b-row>
    </div>

</template>

<script>

    export default {

        props: {

            relevantColumns: { default: () => [], required: true, type: Array },
            uniqueValues: { default: () => {}, required: true, type: Object }
        },

        inject: [

            "dataTable",
            "isMissingValue",
            "missingValueLabel",
            "valueDescription"
        ],

        name: "AnnotGroupedValues",

        data() {

            return {

                fields: [

                    "column_name",
                    "raw_value",
                    "description",
                    "annotated_value",
                    "missing_value"
                ],

                groupValueMap: {},

                tableItems: {},

                uiText: {

                    generalInstructions: "Annotate each unique value for each column in the group",
                    missingValueButton: "Missing value",
                    placeholderText: "Fill in value",
                    saveButton: "Save Annotation",
                    termInstructions: "Please provide a term"
                },

                vocabState: null
            };
        },

        computed: {

            canSaveAnnotation() {

                let allTabsAnnotated = true;

                // All tabs must have been annotated before annotation is saveable to the store
                for ( const itemName in this.groupValueMap ) {

                    if ( !this.isTabAnnotated(itemName) ) {
                        allTabsAnnotated = false;
                        break;
                    }
                }

                return allTabsAnnotated;
            },

            saveButtonColor() {

                return this.canSaveAnnotation ? "success" : "secondary";
            }
        },

        watch: {

            "$store.state.missingColumnValues": {

                deep: true,
                handler(p_newValue, p_oldValue) {

                    this.refreshTableItems();
                }
            },

            tableItems: {

                deep: true,
                handler(p_newValue, p_oldValue) {

                    for ( const itemName in p_newValue ) {

                        // Update the group mapping with newly-entered value
                        for ( const row of p_newValue[itemName] ) {

                            this.storeAnnotation(row.column_name, row.raw_value, row.annotated_value);
                        }
                    }
                }
            }
        },

        created() {

            // Set up the mapping between raw and annotated values for all items in the group.
            // Any previously annotated values are wiped.
            this.initializeGroupValueMap();
        },

        mounted() {

            // Load table data from what was stored in 'groupValueMap'
            this.refreshTableItems();
        },

        methods: {

            annotatedTabColor(p_itemName) {

                const returnedClass = ( this.isTabAnnotated(p_itemName) ) ? "tab-complete" : "tab-incomplete";
                console.log(`Tab color: ${returnedClass}`);

                return ( this.isTabAnnotated(p_itemName) ) ? "tab-complete" : "tab-incomplete";
            },

            annotatedValue(p_columnName, p_rawValue) {

                return this.groupValueMap[p_columnName][p_rawValue];
            },

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

                                transformedTable[index][columnName] = this.missingValueLabel;
                            } else {
                                transformedTable[index][columnName] = this.annotatedValue(columnName, transformedTable[index][columnName]);
                            }
                        }
                    }
                }

                // 3. Trigger a save of this transformation to the annotated table in the store
                this.$emit("update:dataTable", {

                    transformHeuristics: this.groupValueMap,
                    transformedTable: transformedTable
                });
            },

            changeTableItem(p_itemName, p_row) {

                for ( let index = 0; index < this.tableItems[p_itemName].length; index++ ) {

                    if ( p_row.raw_value === this.tableItems[p_itemName][index].raw_value ) {

                        this.$set(this.tableItems[p_itemName][index], "annotated_value", p_row.annotated_value);
                        break;
                    }
                }

                // HACK for now (?)
                this.storeAnnotation(p_row.column_name, p_row.raw_value, p_row.annotated_value);
            },

            declareMissing(p_row) {

                // 1. Set the current mapping to empty string
                this.storeAnnotation(p_row.column_name, p_row.raw_value, "");

                // 2. Send missing value to store
                this.$emit("update:missingValue", {

                    column: p_row.column_name,
                    value: p_row.raw_value
                });
            },

            initializeGroupValueMap() {

                // 0. Wipe the value map
                this.groupValueMap = {};

                // 1. Each item in the group has its own value map between raw and annotated values
                for ( const itemName of this.relevantColumns ) {

                    this.groupValueMap[itemName] = {};

                    for ( const rawValue of this.uniqueValues[itemName] ) {
                        this.groupValueMap[itemName][rawValue] = "";
                    }
                }
            },

            isTabAnnotated(p_itemName) {

                let allValuesAnnotated = true;

                // 1. Check to see if all non-missing values have been annotated
                for ( const [rawValue, annotatedValue] of Object.entries(this.groupValueMap[p_itemName]) ) {

                    // A. Value is consider unannotated if it is blank
                    // and has not been marked as missing
                    if ( 0 === annotatedValue.trim().length &&
                        !this.isMissingValue(p_itemName, rawValue) ) {

                        allValuesAnnotated = false;
                        break;
                    }
                }

                return allValuesAnnotated;
            },

            refreshTableItems() {

                // 0. Wipe table contents
                this.tableItems = {};
                for ( const itemName of this.relevantColumns ) {
                    this.tableItems[itemName] = [];
                }

                // 1. Make a row for each column value
                for ( const columnName in this.uniqueValues ) {

                    for ( const rawValue of this.uniqueValues[columnName] ) {

                        // Only display values for annotation that are not declared as missing
                        if ( !this.isMissingValue(columnName, rawValue) ) {

                            // A. Get the value description from the data dictionary, if available
                            const valueDescription = this.valueDescription(columnName, rawValue);

                            // B. Save the new row entry
                            this.tableItems[columnName].push({

                                annotated_value: this.groupValueMap[columnName][rawValue],
                                column_name: columnName,
                                description: valueDescription,
                                raw_value: rawValue
                            });
                        }
                    }
                }
            },

            storeAnnotation(p_columnName, p_rawValue, p_annotatedValue) {

                // 1. Merge the inner level (e.g. the map for the p_columnName)
                const innerUpdate = Object.assign(
                    this.groupValueMap[p_columnName],
                    { [p_rawValue]: p_annotatedValue }
                );

                // 2. Merge the outer layer (e.g. the complete map)
                this.groupValueMap = Object.assign(
                    {},
                    this.groupValueMap,
                    { [p_columnName]: innerUpdate }
                );
            }
        }
    };

</script>

<style>

.tab-incomplete {

    color: red !important;
}

.tab-complete {

    color: green !important;
}

</style>