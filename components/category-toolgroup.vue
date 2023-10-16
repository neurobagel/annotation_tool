<template>
    <div>
        <b-row>
            <b-col cols="6">
                <v-select
                    data-cy="toolgroup-select"
                    :options="toolTerms"
                    outlined
                    @input="selectTool"
                    :selectable="(option) => !selectedTools.some(el => el.tool.includes(option.label))" />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-table
                    v-if="selectedTools.length > 0"
                    data-cy="assessment-tool-table"
                    outlined
                    selectable
                    head-variant="dark"
                    :items="selectedTools"
                    select-mode="single"
                    selected-variant=""
                    :fields="[{ key: 'tool' }]"
                    @row-selected="highlightRow"
                    :tbody-tr-class="styleTableRow"
                    thead-class="hidden" />

            </b-col>
            <b-col>
                <b-table
                    data-cy="assessment-column-table"
                    outlined
                    head-variant="dark"
                    :items="tableRows"
                    selected-variant=""
                    thead-class="hidden"
                    @row-clicked="mapColumnToTool"
                    :tbody-tr-class="styleRow" />
            </b-col>
        </b-row>
    </div>
</template>

<script>

    import { mapGetters, mapState } from 'vuex';

    export default {
        data() {
            return {
                selectedTools: [],
                selectedTool: null,
                //Todo: populate keys using columns that are coming from the store
                column2ToolMap: {
                    column1: null,
                    column2: null,
                    column3: null
                }
            };

        },

        computed: {
            ...mapGetters([
                'getColumnsForCategory'
            ]),

            ...mapState([

                "toolTerms"
            ]),
            tableRows() {
                return this.getColumnsForCategory('Assessment Tool').map(column => ({
                    column: column
                }));
            }
        },
        methods: {
            selectTool(selectedTool) {
                console.log('someone selected', selectedTool);
                this.selectedTools.push({
                    tool: selectedTool.label,
                    identifier: selectedTool.id
                });
            },
            highlightRow(rows) {
                if ( 0 !== rows.length ) {
                    this.selectedTool = rows[0].tool;
                }
            },

            styleTableRow(p_row) {
                if (p_row.tool === this.selectedTool) {
                    return "selected-tool";
                }
                return "";
            },
            mapColumnToTool(row) {
                if (this.column2ToolMap[row.column] === this.selectedTool) {
                    this.column2ToolMap[row.column] = null;
                } else {
                    this.column2ToolMap[row.column] = this.selectedTool;
                }
            },
            styleRow(p_row) {
                if (this.column2ToolMap[p_row.column] === this.selectedTool) {
                    return "selected-tool";
                } else {
                    return "";
                }
            }
        }
    };
</script>
<style>

.selected-tool {
    background-color: red !important;
}

</style>