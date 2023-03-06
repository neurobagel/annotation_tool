<template>

    <b-card
        no-body
        class="annotation-card">
        <b-card-header>{{ uiText.instructions }}</b-card-header>
        <b-card-body class="continuous-values-card-body">

            <b-tabs content-class="mt-3">

                <b-tab
                    v-for="(columnName, index) in relevantColumns"
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
                                :items="columnValidationItems(columnName)" />
                        </b-col>

                        <b-col cols="4">
                            <v-select
                                :data-cy="'selectTransform_' + columnName"
                                :options="getTransformOptions(activeCategory)"
                                :value="getHeuristic(columnName)"
                                @input="commitHeuristic(columnName, $event)" />
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

                uiText: {

                    instructions: "Review the age harmonization",
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
            ]),

            relevantColumns() {

                return this.getMappedColumns(this.activeCategory);
            }
        },

        methods: {

            ...mapMutations([

                "setHeuristic"
            ]),

            columnValidationItems(p_columnName) {

                // 1. Retrieve all unique values for each column linked to this category
                const uniqueValuesByColumn = this.getUniqueValues(this.activeCategory);

                // 2. Create items for the table consisting of objects containing column name, raw and transformed values
                const tableItems = [];
                uniqueValuesByColumn[p_columnName].forEach(value => {

                    tableItems.push({

                        preview: this.getHarmonizedPreview(p_columnName, value),
                        rawValue: value
                    });
                });

                return tableItems;
            },

            commitHeuristic(p_column, p_heuristic) {

                // TODO: With the addition of ability to set heuristic for
                // individual columns, 'activeCategory' below will be replaced
                // with the appropriate column name
                this.setHeuristic({ column: p_column, heuristic: p_heuristic });
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
