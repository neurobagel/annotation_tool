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

    // Allows for reference to store mutations (index.js)
    import { mapMutations } from "vuex";

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        props: {

            activeCategory: { type: String, required: true }
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

                "categoryClasses",
                "getColumnNames",
                "getColumnDescription",
                "columnToCategoryMap"
            ]),

            tableRows() {

                return this.getColumnNames.map(column => ({

                    category: this.columnToCategoryMap[column],
                    column: column,
                    description: this.getColumnDescription(column.name)
                }));
            }
        },

        methods: {

            ...mapMutations([

                "alterColumnCategoryMapping"
            ]),

            applyCategory(p_row, p_index, p_event) {
                // 1. Link or unlink the currently-selected/active category and the clicked column
                this.alterColumnCategoryMapping(this.activeCategory, p_row.column);
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                const assignedCategory = this.columnToCategoryMap[p_row.column];

                return ( null === assignedCategory ) ? "" : this.categoryClasses[assignedCategory];
            }
        }
    };
</script>
