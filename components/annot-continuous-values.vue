<template>

    <b-card
        no-body
        class="annotation-card">
        <b-card-header>{{ uiText.instructions }}</b-card-header>
        <b-card-body class="continuous-values-card-body">

            <b-tabs content-class="mt-3">

                <b-tab
                    v-for="(columnName, index) in getMappedColumns(activeCategory)"
                    :key="columnName"
                    :active="0 === index"
                    :title="columnName">

                    <b-row>

                        <b-col cols="8">
                            <b-table
                                hover
                                striped
                                id="annotation-table"
                                :data-cy="'dataTable-' + columnName"
                                :fields="exampleFields"
                                :items="columnValidationItems(columnName)">

                                <template #cell(missingValue)="row">
                                    <b-button
                                        :data-cy="'missingValueButton_' + row.index"
                                        variant="danger"
                                        @click="changeMissingStatus({column: columnName, value: row.item['rawValue'], markAsMissing: true})">
                                        {{ uiText.missingValueButton }}
                                    </b-button>
                                </template>
                            </b-table>
                        </b-col>

                        <b-col cols="4">
                            <v-select
                                :data-cy="'selectTransform_' + columnName"
                                :options="getTransformOptions(activeCategory)"
                                :value="getHeuristic(columnName)"
                                @input="selectHeuristic({ columnName: columnName, heuristic: $event})" />
                        </b-col>

                    </b-row>
                </b-tab>
            </b-tabs>

        </b-card-body>
    </b-card>


</template>

<script>

    import { mapGetters, mapMutations } from "vuex";

    export default {

        props: {

            activeCategory: { type: String, required: true }
        },

        name: "ContinuousTable",

        data() {

            return {

                exampleFields: [

                    "preview",
                    "rawValue",
                    "missingValue"
                ],

                uiText: {

                    instructions: "Review the age harmonization",
                    missingValueButton: "Mark as missing",
                    saveButton: "Save Annotation"
                }
            };
        },

        computed: {

            ...mapGetters([

                "getHarmonizedPreview",
                "getHeuristic",
                "getMappedColumns",
                "getTransformOptions",
                "getUniqueValues"
            ])
        },

        methods: {

            ...mapMutations([

                "changeMissingStatus",
                "setHeuristic",
                "updateAnnotationCount"
            ]),

            columnValidationItems(p_columnName) {

                // 1. Retrieve all unique values for each column linked to this category
                const uniqueValuesByColumn = this.getUniqueValues(this.activeCategory);

                // 2. Create items for the table consisting of objects containing column name, raw and transformed values
                const tableItemsForColumn = [];
                uniqueValuesByColumn[p_columnName].forEach(value => {

                    tableItemsForColumn.push({

                        preview: this.getHarmonizedPreview(p_columnName, value),
                        rawValue: value
                    });
                });

                return tableItemsForColumn;
            },

            selectHeuristic({ columnName, heuristic }) {

                // 1. Set the heuristic for this column in the store
                this.setHeuristic({ columnName: columnName, heuristic: heuristic });

                // 2. Update the annotation count
                this.updateAnnotationCount();
            }
        }
    };

</script>

<style scoped>

.continuous-values-card-body {

    height: 300px;
    overflow-y: scroll;
    position: relative;
}

</style>
