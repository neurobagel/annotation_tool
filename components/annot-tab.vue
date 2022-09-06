<template>

    <div>

        <!-- Explanation text for this annotation tab -->
        <annot-explanation :explanation="details.explanation" :index="details.id" :data-cy="'annot-expl-' + title" />

        <!-- Lists all the columns linked to the category of this annotation tab -->
        <annot-columns
            :active-category="details.category"
            :relevant-columns="relevantColumns"
            @remove:column="$emit('remove:column', $event)" />

        <!-- Lists any values determined to be missing (e.g. potentially invalid) in this tab's columns -->
        <annot-missing-values
            :relevant-columns="relevantColumns"
            @remove:missingValue="$emit('remove:missingValue', $event)"
            @update:missingColumnValues="$emit('update:missingColumnValues', $event)" />

        <!-- Component specializing in the particular kind of annotation for this tab's category -->
        <component
            :is="details.specializedComponent"
            :data-cy="'annot-component-' + title"
            :id-field="idField"
            :details="details"
            :options="details.options"
            :relevant-columns="relevantColumns"
            :title="title"
            :unique-values="uniqueValues"
            :unique-values-to-subject-map="uniqueValuesToSubjectMap"
            @update:dataTable="$emit('update:dataTable', $event)"
            @update:heuristics="$emit('update:heuristics', $event)"
            @update:missingValue="$emit('update:missingValue', $event)" />

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        props: {

            details: { type: Object, required: true },
            title: { type: String, required: true }
        },

        inject: [

            "columnToCategoryMap",
            "dataTable"
        ],

        data() {

            return {

                // Category of the current annotation tab
                category: "",

                // String name of the column assigned the 'Subject ID' category in the data table
                idField: "",

                // Disabled state of the save annotation button
                saveButtonDisabled: true
            };
        },

        computed: {

            ...mapGetters([

                "getColumnsOfCategory"
            ]),

            filteredDataTable() {

                const filteredTable = this.dataTable.original.map((row) => {

                    return Object.fromEntries(
                        Object.entries(row).filter(([columnName, rowValue]) =>
                            this.relevantColumns.includes(columnName))
                    );
                });

                // Return a data table where each row is filtered to only show the columns that are mapped to the given category
                // NOTE: The original data table is used here because we want to display the original raw values
                return filteredTable;
            },

            relevantColumns() {

                // Create and return a list of columns that are categorized with this tab's category
                const columnList = [];
                for ( const columnName in this.columnToCategoryMap ) {

                    // If this tab is an assessment tool group, make sure this column is in its toolset
                    if ( Object.hasOwn(this.details, "groupName") &&
                        !(this.details.tools.includes(columnName)) ) {
                        continue;
                    }

                    if ( this.category === this.columnToCategoryMap[columnName] ) {
                        columnList.push(columnName);
                    }
                }

                return columnList;
            },

            uniqueValues() {

                // 1. Create and return an object that maps column names to unique values from the filtered table
                const uniqueValuesMap = {};
                for ( const columnName of this.relevantColumns ) {

                    // A. Get unique values for this column from the filtered table
                    uniqueValuesMap[columnName] = Array.from(new Set(this.filteredDataTable.map(row => row[columnName])));
                }

                return uniqueValuesMap;
            },

            uniqueValuesToSubjectMap() {

                const valuesToSubjectMap = {};

                // 1. Create a map between unique values for each column and the subjects that have those values

                // A. Begin with an empty map for all values in all columns
                for ( const column in this.uniqueValues ) {

                    valuesToSubjectMap[column] = {};

                    for ( const value of this.uniqueValues[column] ) {

                        valuesToSubjectMap[column][value] = [];
                    }
                }

                // B. Fill in the map with subjects that have the unique values for each column
                for ( const row of this.dataTable.original ) {

                    for ( const column in valuesToSubjectMap ) {

                        valuesToSubjectMap[column][row[column]].push(row[this.idField]);
                    }
                }

                return valuesToSubjectMap;
            }
        },

        created() {

            // NOTE: The category must be set here in created or the components
            // for 'annot-tab' will not be initialized correctly

            // 1. Set the given category for this tab
            this.category = this.details.category;

            // 2. Get column marked as subject ID
            // NOTE: the "Subject ID" category is only allowed to be applied to one column
            this.idField = this.getColumnsOfCategory("Subject ID")[0];
        }
    };

</script>
