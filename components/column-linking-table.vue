<template>

    <b-container fluid>

        <!-- Category to column linking table -->
        <b-table
            data-cy="column-linking-table-table"
            bordered
            outlined
            :fields="uiText.tableFields"
            head-variant="dark"
            :items="tableRows"
            @row-clicked="applyCategory"
            :tbody-tr-class="styleTableRow" />

    </b-container>

</template>

<script>

    // Allows for reference to store (index.js)
    import { mapMutations, mapGetters, mapState } from "vuex";

    export default {

        props: {

            selectedCategory: { type: String, required: true }
        },

        data() {

            return {

                uiText: {

                    tableFields: [

                        { key: "column" },
                        { key: "description" }
                    ]
                }
            };
        },

        computed: {

            ...mapGetters([

                "getColumnNames",
                "getColumnDescription"
            ]),

            ...mapState([

                "colorInfo",
                "columnToCategoryMapping"
            ]),

            tableRows() {

                return this.getColumnNames.map(column => ({

                    category: this.columnToCategoryMapping[column],
                    column: column,
                    description: this.getColumnDescription(column)
                }));
            }
        },

        methods: {

            ...mapMutations([

                "alterColumnCategoryMapping"
            ]),

            applyCategory(p_row, p_index, p_event) {

                // Link or unlink the currently-selected/active category and the clicked column
                this.alterColumnCategoryMapping({ category: this.selectedCategory, column: p_row.column });
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                const assignedCategory = this.columnToCategoryMapping[p_row.column];

                return ( null === assignedCategory ) ? "" : this.colorInfo.categoryClasses[assignedCategory];
            }
        }
    };
</script>
