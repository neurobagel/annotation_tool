<template>

    <div>
        <b-card class="annotation-card">

            <b-card-header>{{ uiText.title }}</b-card-header>

            <b-card-body class="missing-values-card-body">
                <b-table
                    striped
                    :fields="fields"
                    :items="tableItems">
                    <template #cell(not_missing)="data">
                        <b-button
                            variant="danger"
                            @click="removeColumn(data.item)">
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
    import { mapGetters } from "vuex";

    export default {

        name: "AnnotMissingValues",

        props: {

            relevantColumns: { type: Array, required: true }
        },

        inject: ["missingColumnValues"],

        data() {

            return {

                fields: [

                    { key: "column" },
                    { key: "description"},
                    { key: "value"},
                    { key: "not_missing"}
                ],

                uiText: {

                    notMissingButton: "Not Missing",
                    title: "Missing Values"
                }
            };
        },

        computed: {

            ...mapGetters([

                "isMissingValue",
                "valueDescription"
            ]),

            tableItems() {
                const tmp = [
                    {
                        column: 'sex',
                        description: 'my description',
                        value: 'my value'
                    }
                ]
                return tmp
            }
        },

        methods: {

            removeColumn(p_tableItem) {

                // 1. Remove the item from table data
                this.tableItems = this.tableItems.filter(item =>
                    item.column === p_tableItem.column && item.value !== p_tableItem.value );

                // 2. Remove this value from the column's missing value list in the store
                this.$emit('remove:missingValue', p_tableItem);
            }
        }
    }

</script>

<style>

    .missing-values-card-body {

        height: 30vh;
        overflow-y: scroll;
    }

</style>
