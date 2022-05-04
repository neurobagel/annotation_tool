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
    import { mapGetters, mapState } from "vuex";

    export default {

        name: "AnnotMissingValues",

        props: {

            relevantColumns: { type: Array, required: true }
        },

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

                "valueDescription"
            ]),

            ...mapState([

                "missingColumnValues"
            ]),

            tableItems() {
                let missingValueArray = []

                for ( let column of this.relevantColumns ) {
                    if ( Object.keys(this.missingColumnValues).includes(column) ) {
                        for ( let missing_value of this.missingColumnValues[column] ) {
                            const description = this.valueDescription(column, missing_value);
                            missingValueArray.push(
                                {
                                    column: column,
                                    description: description === null ? "" : description,
                                    value: missing_value
                                }
                            )

                        }
                    }
                }
                return missingValueArray
            }
        },

        methods: {

            removeColumn(p_tableItem) {
                // Remove this value from the column's missing value list in the store
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
