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

                        <v-select
                            :data-cy="'categoricalSelector' + '_' + row.index"
                            :options="getCategoricalOptions(row.item['columnName'])"
                            :reduce="term => term.identifier"
                            :value="getSelectedCategoricalOption(row.item['columnName'], row.item['rawValue'])"
                            @input="selectOptionAndUpdate($event, row.item['columnName'], row.item['rawValue'])" />

                    </template>
                    <template #cell(missingValue)="row">
                        <b-button
                            :data-cy="'missingValueButton_' + row.index"
                            variant="danger"
                            @click="changeMissingStatus({column: row.item['columnName'], value: row.item['rawValue'], markAsMissing: true})">
                            {{ uiText.missingValueButton }}
                        </b-button>
                    </template>
                    <template #cell(isControl)="row" v-if="activeCategory === 'Diagnosis'">
                        <b-button
                            :data-cy="'isControlButton_' + row.index"
                            variant="info"
                            @click="selectOptionAndUpdate('ncit:C94342', row.item['columnName'], row.item['rawValue'])">
                            {{ uiText.isControlButton }}
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

                // Text for UI elements
                uiText: {

                    instructions: "Annotate each unique value",
                    missingValueButton: "Mark as missing",
                    saveButton: "Save Annotation",
                    isControlButton: "Mark as healthy control"
                }
            };

        },

        computed: {

            ...mapGetters([

                "getCategoricalOptions",
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

                return tableData;
            }
        },

        mounted() {
            if (this.activeCategory == 'Diagnosis') {
                this.exampleFields.push("isControl");
            }


        },

        methods: {

            ...mapMutations([

                "changeMissingStatus",
                "selectCategoricalOption",
                "updateAnnotationCount"
            ]),

            selectOptionAndUpdate(p_optionValue, p_columnName, p_rawValue) {

                // 1. Set the categoricla option for this value in the store
                this.selectCategoricalOption({

                    optionValue: p_optionValue,
                    columnName: p_columnName,
                    rawValue: p_rawValue
                });

                // 2. Update the annotation count
                this.updateAnnotationCount();
            }
        }
    };

</script>