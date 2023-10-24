<template>

    <div>
        <b-table
            striped
            :data-cy="('tool-annotation-for-' + name)"
            :fields="toolFields"
            :items="uniqueColumnValues">
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
            }
        }
    };

</script>