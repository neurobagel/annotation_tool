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

    // Allows for reference to store actions (index.js)
    import { mapActions } from "vuex";

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        props: {

            selectedCategory: { type: String, required: true }
        },

        data() {

            return {

                uiText: {

                    tableFields: [

                        { key: "column" },
                        { key: "description" },
                        { key: "category" }
                    ]
                }
            };
        },

        computed: {

            ...mapGetters([

                "categoryClasses",
                "columns",
                "columnToCategoryMap"
            ]),

            tableRows() {

                return this.columns.map(column => ({

                    category: this.columnToCategoryMap[column],
                    column: column.name,
                    description: column.description
                }));
            }
        },

        methods: {

            ...mapActions([

                "alterColumnCategoryRelation"
            ]),

            applyCategory(p_row, p_index, p_event) {

                const payload = {

                    category: this.selectedCategory,
                    column: p_row.column
                };

                // 1. Link or unlink the currently-selected category and the clicked column
                this.alterColumnCategoryRelation(payload);

                // 2. Tell the categorization page a column has been clicked
                this.$emit("column-name-clicked", payload);
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                const assignedCategory = this.columnToCategoryMap[p_row.column];

                return ( null === assignedCategory ) ? "" : this.categoryClasses[assignedCategory];
            }
        }
    };
</script>
