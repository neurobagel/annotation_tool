<template>

    <div>

        <b-card class="annotation-card">

            <!-- User instructions and subject availability count for this tool group -->
            <b-card-header>
                <b-row>
                    <b-col class="text-left" cols="5">
                        {{ uiText.generalInstructions }}
                    </b-col>
                    <b-col cols="2" />
                    <b-col class="text-right" cols="5">
                        {{ uiText.availability + availableSubjects + " out of " + totalSubjects }}
                    </b-col>
                </b-row>
            </b-card-header>

            <!-- Tabbed view of column values for this tool group -->
            <b-card-body>

                <b-tabs content-class="mt-3">

                    <b-tab
                        v-for="(itemName, index) in relevantColumns"
                        :key="itemName"
                        :active="0 === index"
                        :title="itemName">

                        <b-table
                            fixed
                            striped
                            :fields="fields"
                            :items="tableItems[itemName]">

                            <!-- Each unique value in this table for a column can be marked as missing -->
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
                variant="success"
                @click="applyAnnotation()">
                {{ uiText.saveButton }}
            </b-button>
        </b-row>
    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        props: {

            details: { default: () => {}, required: true, type: Object },
            idField: { default: () => {}, required: true, type: String },
            relevantColumns: { default: () => [], required: true, type: Array },
            uniqueValues: { default: () => {}, required: true, type: Object },
            uniqueValuesToSubjectMap: { default: () => {}, required: true, type: Object }
        },

        inject: [

            "dataTable",
            "isMissingValue",
            "valueDescription"
        ],

        name: "AnnotToolGroup",

        data() {

            return {

                availableSubjects: 0,
                totalSubjects: 0,

                fields: [

                    "column_name",
                    "raw_value",
                    "description",
                    "missing_value"
                ],

                tableItems: {},

                uiText: {

                    availability: "Subjects available for this tool group: ",
                    generalInstructions: "Indicate which values are 'missing' for each column in the group",
                    missingValueButton: "Mark as missing",
                    saveButton: "Save Annotation"
                },

                subjectAvailability: {}
            };
        },

        computed: {

            ...mapGetters([

                "getColumnOfCategory"
            ])
        },

        watch: {

            "$store.state.missingColumnValues": {

                deep: true,
                handler(p_newValue, p_oldValue) {

                    // When missing column values are updated in the store,
                    // load table data from 'uniqueValues' and update 'subjectAvailability' if values for it are not missing
                    this.refreshTableItems();
                }
            },

            subjectAvailability: {

                deep: true,
                handler(p_newValue, p_oldValue) {

                    // 1. When the subject availability map changes, tally the available subject count
                    let newAvailableCount = this.totalSubjects;
                    for ( const id of Object.keys(this.subjectAvailability) ) {

                        // A. Look for columns where subject's value has been marked as 'missing'
                        let subjectIsAvailable = true;
                        for ( const columnName in this.subjectAvailability[id] ) {

                            if ( !this.subjectAvailability[id][columnName] ) {
                                subjectIsAvailable = false;
                                break;
                            }
                        }

                        // B. Determine the new subject availability count
                        if ( !subjectIsAvailable ) {

                            newAvailableCount -= 1;

                            if ( newAvailableCount < 0 ) {
                                newAvailableCount = 0;
                                break;
                            }
                        }
                    }

                    // 2. Save the new availability count
                    this.availableSubjects = newAvailableCount;
                }
            }
        },

        created() {

            // 1. Initial available amount of subjects is total subject count
            this.totalSubjects = this.availableSubjects = this.dataTable.original.length;

            // 2. Set up the mapping between subject and any potentially missing values for all tools in the group.
            this.initalizeAvailabilityMap();
        },

        mounted() {

            // Load table data 'uniqueValues' and update 'subjectAvailability' if values for it are not missing
            this.refreshTableItems();
        },

        methods: {

            applyAnnotation() {

                // NOTE: We want to use the annotated dataTable here in order to not overwrite previous
                // annotations from other components

                // 1. Create a local copy of the annotated table for transformation
                const transformedTable = structuredClone(this.dataTable.annotated);

                // 2. Save availability of all relevant columns in this group for each subject
                for ( let index = 0; index < transformedTable.length; index++ ) {

                    let allRelevantColumnsAvailable = true;

                    // A. Check to see if all tool group columns are available for this subject
                    for ( const columnName in transformedTable[index] ) {

                        if ( this.relevantColumns.includes(columnName) ) {

                            if ( !this.subjectAvailability[transformedTable[index][this.idField]][columnName] ) {
                                allRelevantColumnsAvailable = false;
                                break;
                            }
                        }
                    }

                    // B. Availability status for a subject is based on whether all tool group columns are available or not
                    transformedTable[index][this.details.groupName + "_avail"] = allRelevantColumnsAvailable;
                }

                // 3. Trigger a save of this transformation to the annotated table in the store
                // NOTE: 'transformHeuristics' are currently not being saved to the store
                this.$emit("update:dataTable", {

                    // transformHeuristics: this.subjectAvailability,
                    transformedTable: transformedTable
                });
            },

            declareMissing(p_row) {

                // 1. Indicate all subjects with this value are unavailable
                this.setSubjectAvailability(p_row.column_name, p_row.raw_value, false);

                // 2. Send missing value to store
                this.$emit("update:missingValue", {

                    column: p_row.column_name,
                    value: p_row.raw_value
                });
            },

            initalizeAvailabilityMap() {

                // 0. Wipe the availability map
                this.subjectAvailability = {};

                // 1. All subjects are initially available for this tool group for annotation
                for ( const row of this.dataTable.original ) {

                    this.subjectAvailability[row[this.idField]] = {};

                    for ( const toolName of this.relevantColumns ) {

                        this.subjectAvailability[row[this.idField]][toolName] = true;
                    }
                }
            },

            refreshTableItems() {

                // This method generates the unique values of the relevantColumns
                // divided across tabs, one for each column, for the user to mark 'missing', if necessary.
                // Only values that are not declared as missing will be shown.

                // Create table entries for each value in the relevant columns

                // 0. Wipe table contents
                this.tableItems = {};
                for ( const itemName of this.relevantColumns ) {
                    this.tableItems[itemName] = [];
                }

                // 1. Make a row for each column value
                for ( const columnName in this.uniqueValues ) {

                    for ( const rawValue of this.uniqueValues[columnName] ) {

                        // Only display values that are not declared as missing
                        if ( !this.isMissingValue(columnName, rawValue) ) {

                            // A. Get the value description from the data dictionary, if available
                            const valueDescription = this.valueDescription(columnName, rawValue);

                            // B. Save the new row entry
                            this.tableItems[columnName].push({

                                column_name: columnName,
                                description: valueDescription,
                                raw_value: rawValue
                            });

                            // C. Update the subject availability map as needed for this value
                            this.setSubjectAvailability(columnName, rawValue, true);
                        }
                    }
                }
            },

            setSubjectAvailability(p_columnName, p_rawValue, p_availabilityStatus) {

                // 0. Get subjects with this value
                const subjectIDList = this.uniqueValuesToSubjectMap[p_columnName][p_rawValue];

                // 1. Flag on or off the availability of the subjects with this value
                for ( const id of subjectIDList ) {

                    // A. Merge the inner level (e.g. the mapping for the p_columnName)
                    const innerUpdate = Object.assign(
                        this.subjectAvailability[id],
                        { [p_columnName]: p_availabilityStatus }
                    );

                    // B. Merge the outer layer (e.g. the complete mapping object)
                    this.subjectAvailability = Object.assign(
                        {},
                        this.subjectAvailability,
                        { [p_columnName]: innerUpdate }
                    );
                }
            }
        }
    };

</script>