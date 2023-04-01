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
                    data-cy="categoricalTable"
                    :items="displayTable">
                    <template #cell(select_an_appropriate_mapping)="row">

                        <!-- Bootstrap-Vue doesn't have a great option here so I am using https://vue-select.org/ -->
                        <!-- NOTE: We use the $event statement to add the row data to the payload of the @input
                            event without replacing the original event payload -->
                        <!-- NOTE: We're using the "reduce" option for vue-select so that we can pass around the
                            term.identifier parameter, but still display the term.label parameter to the user.
                            See: https://vue-select.org/guide/values.html#transforming-selections -->

                        <!-- <v-select
                            :data-cy="'categoricalSelector' + '_' + row.index"
                            :value="getSelectedCategoricalOption(row.item['columnName'], row.item['rawValue'])"
                            :reduce="term => term.identifier"
                            @input="selectCategoricalOption({optionValue: $event, columnName: row.item['columnName'], rawValue: row.item['rawValue']}); updateAnnotationCount();"
                            :options="getCategoricalOptions(row.item['columnName'])" /> -->

                        <!-- :value="getSelectedCategoricalOption(row.item['columnName'], row.item['rawValue'])" -->

                        <v-select
                            :data-cy="'categoricalSelector' + '_' + row.index"
                            :options="getCategoricalOptions(row.item['columnName'])"
                            :value="selectedValues[row.item['columnName']][row.item['rawValue']]"
                            @input="selectCategoricalOption({ optionValue: $event, columnName: row.item['columnName'], rawValue: row.item['rawValue'] })" />

                    </template>
                    <template #cell(missingValue)="row">
                        <b-button
                            :data-cy="'missingValueButton_' + row.index"
                            variant="danger"
                            @click="changeMissingStatus({column: row.item['columnName'], value: row.item['rawValue'], markAsMissing: true})">
                            {{ uiText.missingValueButton }}
                        </b-button>
                    </template>

                </b-table>

                <b-row />

            </b-card-body>

        </b-card>

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters, mapMutations } from "vuex";

    export default {

        name: "AnnotCategorical",

        props: {

            activeCategory: { type: String, required: true }
        },

        data() {

            return {

                exampleFields: [

                    "columnName",
                    "rawValue",
                    "description",
                    "select_an_appropriate_mapping",
                    "missingValue"
                ],

                selectedValues: {},

                // Text for UI elements
                uiText: {

                    instructions: "Annotate each unique value",
                    missingValueButton: "Mark as missing",
                    saveButton: "Save Annotation"
                }
            };

        },

        mounted() {

            this.getSelectedValues();
        },

        computed: {

            ...mapGetters([

                "getCategoricalOptions",
                "getMappedColumns",
                "getSelectedCategoricalOption",
                "getUniqueValues",
                "getValueDescription"
            ]),

            displayTable() {

                // 0. Retrieve all unique values for columns linked to the active category
                const uniqueValuesMap = this.getUniqueValues(this.activeCategory);

                // 1. Create and return table data for the unique values in the relevant columns that are not missing values
                const tableData = [];

                for ( const columnName in uniqueValuesMap ) {
                    for ( const uniqueValue of uniqueValuesMap[columnName] ) {

                        tableData.push({

                            columnName: columnName,
                            description: this.getValueDescription(columnName, uniqueValue),
                            rawValue: uniqueValue
                        });
                    }
                }

                console.log(`Categorical table data: ${JSON.stringify(tableData)}`);

                return tableData;
            }

            // getSelectedValues() {

            //     // 0. Retrieve data that will be used by the categorical dropdowns
            //     const tableData = this.displayData();

            //     // 1. Build a map of selected values by column for display in the v-selects
            //     this.selectedValues = {};
            //     for ( const row of tableData ) {

            //         if ( !(row.columnName in this.selectedValues) ) {

            //             this.selectedValues[row.columnName] = {};
            //         }

            //         this.selectedValues[row.columnName][row.rawValue] = this.getSelectedCategoricalOption(row.columnName, row.rawValue);
            //     }
            // }
        },

        methods: {

            ...mapMutations([

                "changeMissingStatus",
                "selectCategoricalOption",
                "updateAnnotationCount"
            ]),

            getSelectedValues() {

                // 1. Populate selectedValues with the columns linked to this category
                this.selectedValues = Object.fromEntries(() => {

                    return this.getMappedColumns(this.activeCategory).map(columnName => {

                        return [columnName, ""];
                    });
                });

                // 2. Populate the columns of selectedValues with data dictionary's annotated values
                Object.keys(this.displayTable).forEach(row => {

                    this.selectedValues[row.columnName][row.rawValue] = this.getSelectedCategoricalOption(row.columnName, row.rawValue);
                });
            },

            selectCategoricalOptionWrapper({ optionValue, columnName, rawValue }) {

                this.getSelectedValues();
                this.selectCategoricalOptin({ optionValue, columnName, rawValue });
            }
        }
    };

</script>