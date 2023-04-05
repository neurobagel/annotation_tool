<template>

    <b-container fluid>

        <!-- Category to column linking table -->
        <b-table
            bordered
            outlined
            data-cy="column-linking-table-table"
            head-variant="dark"
            :fields="uiText.tableFields"
            :items="tableRows"
            :tbody-tr-class="styleTableRow"
            @row-clicked="applyCategory" />

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
                "columnToCategoryMap"
            ]),

            tableRows() {

                return this.getColumnNames.map(column => ({

                    category: this.columnToCategoryMap[column],
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
                this.alterColumnCategoryMapping({ category: this.selectedCategory, columnName: p_row.column });
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                const assignedCategory = this.columnToCategoryMap[p_row.column];

                return ( null === assignedCategory ) ? "" : this.colorInfo.categoryClasses[assignedCategory];
            }
        }
    };
</script>
