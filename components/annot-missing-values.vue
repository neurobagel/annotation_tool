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

            dataType: { type: String, required: true },
            uniqueValues: { type: Object, required: true }
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

                tableItems: [],

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
            ])
        },

        created() {

            // 1. Create lists of potentially missing values for the data based on
            // information in the data dictionary and the data type for this category
            this.determineMissingValues();

            // 2. Create an array of objects for missing value table data
            this.createTableData();
        },

        methods: {

            createTableData() {

                // 0. Wipe any old table data
                this.tableItems = [];

                // 1. Create a list of objects describing each value for each
                // column listed in 'uniqueValues'
                for ( const columnName in this.uniqueValues ) {
                    for ( const value of this.uniqueValues[columnName] ) {

                        // A. Only missing values for this data type are listed
                        if ( this.isMissingValue(columnName, value) ) {

                            this.tableItems.push({

                                column: columnName,
                                description: this.valueDescription(columnName, value),
                                value: value
                            });
                        }
                    }
                }
            },

            determineMissingValues() {

                // 0. Create an object for missing values lists for all columns of this component
                const missingValuesLists = {};

                // 1. Create a set of lists for potentially missing values of
                // each column assigned to this tab's cateogry
                for ( const columnName in this.uniqueValues ) {

                    // A. Only determine missing values if there is no value list for this column in the store
                    if ( Object.keys(this.missingColumnValues).includes(columnName) ) {
                        continue;
                    }

                    // B. Each column has a list of potentially missing values
                    missingValuesLists[columnName] = [];

                    // C. Determine value invalidity based on the data type of this category
                    for ( const value of this.uniqueValues[columnName] ) {

                        switch ( this.dataType ) {

                            case "categorical":
                                if ( !this.isValidCategorical(columnName, value) ) {
                                    missingValuesLists[columnName].push(value);
                                }
                                break;

                            case "continuous":
                                if ( !this.isValidContinuous(value) ) {
                                    missingValuesLists[columnName].push(value);
                                }
                                break;

                            case "string":
                                if ( !this.isValidString(value) ) {
                                    missingValuesLists[columnName].push(value);
                                }
                                break;
                        }
                    }
                }

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