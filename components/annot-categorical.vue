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

                        <v-select
                            :data-cy="'categoricalSelector' + '_' + row.index"
                            :value="getSelectedOption(row.index)"
                            @input="selectAnOption($event, row.item['columnName'], row.item['rawValue'])"
                            :options="getCategoricalOptions(row.item['columnName'])" />
                    </template>
                    <template #cell(missingValue)="row">
                        <b-button
                            :data-cy="'missingValueButton_' + row.index"
                            variant="danger"
                            @click="changeMissingStatus(row.item['columnName'], row.item['rawValue'], true)">
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

                // Text for UI elements
                uiText: {

                    instructions: "Annotate each unique value",
                    missingValueButton: "Mark as missing",
                    saveButton: "Save Annotation"
                },

                valueMapping: {}
            };

        },

        computed: {

            ...mapGetters([

                "getCategoricalOptions",
                "getSelectedOption",
                "getUniqueValues",
                "getValueDescription"
            ]),

            displayTable() {

                // Create and return table data for the unique values in the relevant columns that are not missing values
                const tableData = [];
                for ( const row of this.getUniqueValues(this.activeCategory) ) {

                    tableData.push({
                        columnName: row.columnName,
                        description: this.getValueDescription(row.columnName, row.rawValue),
                        rawValue: row.rawValue
                    });
                }

                return tableData;
            }
        },

        methods: {

            ...mapMutations([

                "changeMissingStatus",
                "selectAnOption"
            ])
        }
    };

</script>
