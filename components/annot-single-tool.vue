<template>

    <div>
        <b-table
            :data-cy="('tool-annotation-for-' + name)"
            :fields="toolFields"
            :items="uniqueColumnValues"
            :tbody-tr-class="styleTableRow">
            <template #cell(missing_value)="row">
                <b-button
                    :data-cy="'missingValueButton_' + row.index"
                    variant="danger"
                    @click="emitMissingValue(row.item['column'], row.item['value']) ">
                    {{ uiText.missingValueButton }}
                </b-button>
            </template>
        </b-table>

    </div>

</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        data() {
            return {
                uiText: {

                    instructions: "Annotate each unique value",
                    missingValueButton: "Mark as missing",
                    saveButton: "Save Annotation"
                },
                toolFields: [
                    "column",
                    "value",
                    "missing_value"
                ]
            };
        },
        props: {

            name: { type: String, required: true },
            uniqueColumnValues: { type: Array, required: true }
        },
        computed: {
            ...mapGetters([
                "getSelectedTools"
            ])
        },
        methods: {
            emitMissingValue(column, value) {
                this.$emit("declareMissing", {column, value});
            },
            styleTableRow(row) {
                const styleClass = [];
                const columns = this.uniqueColumnValues.map(item => item.column);
                const uniqueColumns = [...new Set(columns)];
                const colIndex = uniqueColumns.indexOf(row.column);
                if (colIndex % 2 === 0) {
                    if (this.uniqueColumnValues.indexOf(row) % 2 === 0) {
                        styleClass.push('column1-color1');
                    }
                    else {
                        styleClass.push('column1-color2');
                    }
                } else {
                    if (this.uniqueColumnValues.indexOf(row) % 2 === 0) {
                        styleClass.push('column2-color1');
                    }
                    else {
                        styleClass.push('column2-color2');
                    }
                }
                return styleClass;
            }
        }
    };

</script>
<style>
.column1-color1 {
  background-color: #f9f9f9;
}
.column1-color2 {
  background-color: #e9ecef;
}
.column2-color1 {
  background-color: #abdde5;
}
.column2-color2 {
  background-color: #aed2d7;
}
</style>