<template>

    <div>
        <b-card
            no-body
            class="annotation-card">

            <b-card-header>
                {{ uiText.title }}
                <b-button
                    v-b-toggle.annot-missing-values-card-body-collapse
                    class="float-right"
                    data-cy="toggle-collapse-button"
                    @click="toggleCollapse">
                    {{ isCollapsed ? uiText.expandButton : uiText.collapseButton }}
                </b-button>
            </b-card-header>

            <b-collapse id="annot-missing-values-card-body-collapse">
                <b-card-body class="missing-values-card-body">
                    <b-table
                        striped
                        :fields="fields"
                        :items="tableItems">
                        <template #cell(not_missing)="data">
                            <b-button
                                variant="danger"
                                :data-cy="'not-missing-button-' + data.item.column + '-' + data.item.value"
                                @click="removeValue(data.item)">
                                {{ uiText.notMissingButton }}
                            </b-button>
                        </template>

                    </b-table>

                </b-card-body>
            </b-collapse>

        </b-card>
    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import {mapGetters, mapMutations} from "vuex";

    export default {

        name: "AnnotMissingValues",

        props: {
            // We need to know what category we are being called for,
            // so that we can go and ask the store for the correct data
            activeCategory: { type: String, required: true }
        },

        data() {

            return {
                isCollapsed: true,

                fields: [

                    {key: "column"},
                    {key: "description"},
                    {key: "value"},
                    {key: "not_missing"}
                ],

                uiText: {

                    notMissingButton: "Not Missing",
                    title: "Missing Values",
                    expandButton: "Expand",
                    collapseButton: "Collapse"
                }
            };
        },

        computed: {

            ...mapGetters([

                "getMissingValues",
                "getValueDescription"
            ]),

            tableItems() {

                // 0. Retrieve the missing values for each column linked to the active category
                const missingValuesForCategory = this.getMissingValues(this.activeCategory);

                // 1. Construct an array of objects with one object for each missing value
                // that each includes its column name, description, and the value itself
                const tableItems = [];
                for ( const column in missingValuesForCategory ) {
                    for ( const value of missingValuesForCategory[column] ) {

                        tableItems.push({

                            column: column,
                            description: this.getValueDescription(column, value),
                            value: value
                        });
                    }
                }

                return tableItems;
            }
        },

        methods: {

            ...mapMutations([

                "changeMissingStatus"
            ]),

            toggleCollapse() {
                this.isCollapsed = !this.isCollapsed;
            },

            removeValue(p_tableItem) {

                // Remove this value from the column's missing value list in the store
                this.changeMissingStatus({
                    column: p_tableItem.column,
                    markAsMissing: false,
                    value: p_tableItem.value
                });
            }
        }
    };

</script>

<style>

.missing-values-card-body {

    height: 30vh;
    overflow-y: scroll;
}

</style>
