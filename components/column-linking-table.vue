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
            :tbody-tr-class="styleTableRow">
        </b-table>

    </b-container>

</template>

<script>

    export default {

        methods: {

            applyCategory(p_row, p_index, p_event) {

                // Tell the parent page that a column has been linked with a category
                this.$emit("column-name-selected", { column: p_row.column });
            },

            styleTableRow(p_row, p_rowType) {

                // Check to see what category has been assigned to this row's column, if any
                let tableClass = "";
                for ( let index = 0; index < this.tableData.length; index++ ) {
                    if ( p_row.column == this.tableData[index].column ) {
                        tableClass = this.categoryClasses[this.tableData[index].category];
                        break;
                    }
                }

                return tableClass;
            }
        },

        props: ["categoryClasses", "fields", "needsRefresh", "selectedCategory", "tableData"],

        watch: {

            needsRefresh() {

                // 1. Force a redraw if requested by the parent page.
                if ( this.needsRefresh ) {
                    
                    // A. Force redraw
                    this.$forceUpdate();

                    // B. Tell parent page that drawing request has been made
				    this.$emit("done-redraw");
                }
            }
        }
    }
</script>