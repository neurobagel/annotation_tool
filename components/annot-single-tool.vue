<template>

    <div >
        <b-table
            striped
            :data-cy="('tool-annotation-for-' + name)"
            :fields="toolFields"
            :items="uniqueColumnValues">
            <template #cell(missingValue)="row">
                <b-button
                    :data-cy="'missingValueButton_' + row.index"
                    variant="danger"
                    @click="changeMissingStatus({column: row.item['columnName'], value: row.item['rawValue'], markAsMissing: true})">
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
                    "Missing Value"
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
        }
    };

</script>