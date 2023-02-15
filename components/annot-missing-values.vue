<template>

    <div>
        <b-card
            no-body
            class="annotation-card">

            <b-card-header>{{ uiText.title }}</b-card-header>

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

                fields: [

                    {key: "column"},
                    {key: "description"},
                    {key: "value"},
                    {key: "not_missing"}
                ],

                uiText: {

                    notMissingButton: "Not Missing",
                    title: "Missing Values"
                }
            };
        },

        computed: {

            ...mapGetters([

                "getMissingValues",
                "getValueDescription"
            ]),

            tableItems() {
                // Returns an array of objects, with one object for each missing value
                // in the columns assigned to the activeCategory
                // for display in the missing Value Table
                return Object.entries(this.getMissingValues(this.activeCategory)).map(([column, missingValues]) => {
                    return missingValues.map(missingValue => {
                        return {
                            column: column,
                            description: this.getValueDescription(column, missingValue),
                            value: missingValue
                        };
                    });
                }
                ).flat();
            }
        },

        methods: {
            ...mapMutations([
                "declareNotMissing"
            ]),

            removeValue(tableItem) {

                // Remove this value from the column's missing value list in the store
                this.declareNotMissing({column: tableItem.column, value: tableItem.value});
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
