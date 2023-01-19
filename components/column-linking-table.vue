<template>

    <b-container fluid>

        <!-- Category to column linking table -->
        <b-table
            ref="table"
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

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

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

                "alterColumnCategoryMap"
            ]),

            applyCategory(p_row, p_index, p_event) {

                // 1. Link or unlink the currently-selected/active category and the clicked column
                this.alterColumnCategoryMap({ category: this.selectedCategory, column: p_row.column });

                this.$refs.table.refresh();
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                const assignedCategory = this.columnToCategoryMap[p_row.column];

                return ( null === assignedCategory ) ? "" : this.colorInfo.categoryClasses[assignedCategory];
            }
        }
    };
</script>
