<template>

    <b-container fluid>

        <!-- Category to column linking table -->
        <b-table
            data-cy="column-linking-table-table"
            bordered
            outlined
            :fields="uiText.tableFields"
            head-variant="dark"
            :items="columnToCategoryTable"
            @row-clicked="applyCategory"
            :tbody-tr-class="styleTableRow" />

    </b-container>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    // Allows for reference to store actions (index.js)
    import { mapActions } from "vuex";

    export default {

        props: {

            selectedCategory: { type: String, required: true }
        },

        data() {

            return {

                columnToCategoryTable: [],

                uiText: {

                    tableFields: [

                        { key: "column" },
                        { key: "description" }
                    ]
                }
            };
        },

        created() {

            // Create the data structure for the category to column linking table
            this.setupColumnToCategoryTable();
        },

        computed: {

            ...mapState([

                "categoryClasses",
                "columnToCategoryMap",
                "dataDictionary",
                "dataTable"
            ])
        },

        methods: {

            ...mapActions([

                "linkColumnWithCategory",
                "unlinkColumnFromCategory"
            ]),

            applyCategory(p_row, p_index, p_event) {

                const dataForStore = { column: p_row.column };

                // 1. Link or unlink the currently-selected category and the clicked column
                if ( this.selectedCategory !== this.columnToCategoryMap[p_row.column] ) {

                    this.linkColumnWithCategory({...dataForStore, category: this.selectedCategory});
                } else {

                    this.unlinkColumnFromCategory(dataForStore);
                }

                // 2. Tell the categorization page a column has been clicked
                this.$emit("column-name-clicked", dataForStore);
            },

            setupColumnToCategoryTable() {

                // 0. Check that there is at least a data table and data dictionary in the data store
                if ( null === this.dataTable.original )
                    return;

                // 1. Produce an array of dicts
                this.columnToCategoryTable = [];

                // A. Each dict has a header entry from the data table file
                const headerFields = [];
                for ( const headerField in this.dataTable.original[0] ) {

                    // I. Save the header field in a list
                    headerFields.push(headerField);

                    // II. Save a new dict for this column and description
                    this.columnToCategoryTable.push({

                        "category": null,
                        "column": headerField,
                        "description": ""
                    });
                }

                // 2. Add in descriptions if a data dictionary has been supplied
                if ( null !== this.dataDictionary.original ) {

                    // A. and a corresponding "description" column that is (possibly) sourced from the json file
                    for ( const column in this.dataDictionary.original ) {

                        // I. Save a lowercase version of the current json key
                        const columnLowercase = column.toLowerCase();

                        // II. Try to match the json key with one in the tsv file
                        if ( headerFields.includes(columnLowercase) ) {

                            for ( let index = 0; index < this.columnToCategoryTable.length; index++ ) {

                                // NOTE: Advanced column name matching here between tsv and json? J. Armoza 01/26/22
                                if ( columnLowercase === this.columnToCategoryTable[index].column.toLowerCase() ) {

                                    // a. Determine the description string for this json file column entry
                                    let descriptionStr = "";
                                    for ( const subkey in this.dataDictionary.original[column] ) {

                                        if ( "description" === subkey.toLowerCase() ) {
                                            descriptionStr = this.dataDictionary.original[column][subkey];
                                            break;
                                        }
                                    }

                                    // b. Save the description from the json file colum entry
                                    this.columnToCategoryTable[index].description = descriptionStr;
                                }
                            }
                        }
                    }
                }
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                const assignedCategory = this.columnToCategoryMap[p_row.column];

                return ( null === assignedCategory ) ? "" : this.categoryClasses[assignedCategory];
            }
        }
    };
</script>
