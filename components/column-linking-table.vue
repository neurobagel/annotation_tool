<template>

    <b-container fluid>

        <!-- Category to column linking table -->
        <b-table
            bordered
            outlined
            :fields="fields"
            head-variant="dark"
            :items="tableData"
            @row-clicked="applyCategory"
            :tbody-tr-class="styleTableRow" />

    </b-container>

</template>

<script>

    export default {

        props: {

            categoryClasses: { type: Object, required: true },
            columnToCategoryMap: { type: Object, required: true },
            fields: { type: Array, required: true },
            selectedCategory: { type: String, required: true },
            tableData: { type: Array, required: true }
        },

        methods: {

            applyCategory(p_row, p_index, p_event) {

                // Tell the parent page that a column has been linked with a category
                this.$emit("column-name-selected", { column: p_row.column });
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                const assignedCategory = this.columnToCategoryMap[p_row.column];

                return ( null === assignedCategory ) ? "" : this.categoryClasses[assignedCategory];
            }
        }
    };
</script>
