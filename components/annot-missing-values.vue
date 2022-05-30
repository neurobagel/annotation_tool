<template>

    <div>
<<<<<<< HEAD
        <b-card class="annotation-card">
=======
        <b-card
            no-body
            class="annotation-card">
>>>>>>> master

            <b-card-header>{{ uiText.title }}</b-card-header>

            <b-card-body class="missing-values-card-body">
<<<<<<< HEAD
=======

>>>>>>> master
                <b-table
                    striped
                    :fields="fields"
                    :items="tableItems">
<<<<<<< HEAD
=======

>>>>>>> master
                    <template #cell(not_missing)="data">
                        <b-button
                            variant="danger"
                            @click="removeColumn(data.item)">
                            {{ uiText.notMissingButton }}
                        </b-button>
                    </template>
<<<<<<< HEAD
                </b-table>
=======

                </b-table>

>>>>>>> master
            </b-card-body>

        </b-card>
    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
<<<<<<< HEAD
    import { mapGetters } from "vuex";
=======
    import { mapGetters, mapState } from "vuex";
>>>>>>> master

    export default {

        name: "AnnotMissingValues",

        props: {

<<<<<<< HEAD
            dataType: { type: String, required: true },
            uniqueValues: { type: Object, required: true }
        },

        inject: ["missingColumnValues"],

=======
            relevantColumns: { type: Array, required: true }
        },

>>>>>>> master
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

                let missingValueArray = [];

                // Create a table of missing values along with their column and data dictionary description
                for ( let column of this.relevantColumns ) {

                    if ( Object.keys(this.missingColumnValues).includes(column) ) {

                        for ( let missingValue of this.missingColumnValues[column] ) {

                            const description = this.valueDescription(column, missingValue);

                            missingValueArray.push({

                                column: column,
                                description: description === null ? "" : description,
                                value: missingValue
                            });

                        }
                    }
                }

<<<<<<< HEAD
                // 2. Save the missing values lists to the store
                this.$emit("update:missingColumnValues", missingValuesLists);
            },

            isValidCategorical(p_column, p_value) {

                let isValid = true;

                // 1. Value is potentially invalid if it is missing from the data dictionary description
                if ( null === this.valueDescription(p_column, p_value) ) {
                    isValid = false;
                }

                return isValid;
            },

            isValidContinuous(p_value) {

                let isValid = true;

                // 1. Value is likely invalid if it is not numeric
                if ( isNaN(p_value) ) {
                    isValid = false;
                }

                return isValid;
            },

            isValidString(p_value) {

                let isValid = true;

                return isValid;
            },

            removeColumn(p_tableItem) {

                // 1. Remove the item from table data
                this.tableItems = this.tableItems.filter(item =>
                    item.column === p_tableItem.column && item.value !== p_tableItem.value );

                // 2. Remove this value from the column's missing value list in the store
                this.$emit('remove:missingValue', p_tableItem);
            }
        }
    }
=======
                return missingValueArray;
            }
        },

        methods: {

            removeColumn(p_tableItem) {

                // Remove this value from the column's missing value list in the store
                this.$emit('remove:missingValue', p_tableItem);
            }
        }
    };
>>>>>>> master

</script>

<style>

    .missing-values-card-body {

        height: 30vh;
        overflow-y: scroll;
    }
<<<<<<< HEAD
    
</style>
=======

</style>
>>>>>>> master
