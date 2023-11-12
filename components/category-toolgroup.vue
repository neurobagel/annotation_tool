<template>
    <b-row>
        <b-col cols="4">
            <b-row>
                <v-select
                    v-if="tableRows.length > 0"
                    data-cy="toolgroup-select"
                    :options="toolTerms"
                    outlined
                    @input="selectTool"
                    :selectable="(option) => !getSelectedTools.some(el => el.identifier.includes(option.identifier))"
                    class="aligned-element" />
            </b-row>
            <b-row>
                <b-table
                    v-if="getSelectedTools.length > 0"
                    data-cy="assessment-tool-table"
                    outlined
                    selectable
                    head-variant="dark"
                    :items="getSelectedTools"
                    select-mode="single"
                    selected-variant=""
                    :fields="[{ key: 'label' }]"
                    @row-selected="highlightRow"
                    :tbody-tr-class="styleTableRow"
                    thead-class="hidden" />
            </b-row>
        </b-col>
        <b-col cols="8" class="margin-top">
            <b-table
                v-if="tableRows.length > 0"
                data-cy="assessment-column-table"
                outlined
                head-variant="dark"
                :items="tableRows"
                selected-variant=""
                thead-class="hidden"
                @row-clicked="mapColumn"
                :tbody-tr-class="styleRow" />
        </b-col>
    </b-row>
</template>

<script>

    import { mapGetters, mapState, mapMutations } from 'vuex';

    export default {
        data() {
            return {
                selectedTool: {
                    tool: null,
                    identifier: null
                }
            };

        },

        computed: {
            ...mapGetters([
                'getColumnsForCategory',
                'getSelectedTools'
            ]),

            ...mapState([

                "toolTerms",
                "columnToToolMap"
            ]),
            tableRows() {
                return this.getColumnsForCategory('Assessment Tool').map(column => ({
                    column: column
                }));
            }
        },
        methods: {
            ...mapMutations([

                "createAssessmentTool",
                "alterColumnToToolMapping"
            ]),
            selectTool(selectedTool) {
                if ( selectedTool !== null ) {
                    this.createAssessmentTool({
                        identifier: selectedTool.identifier,
                        label: selectedTool.label
                    });
                }
            },
            highlightRow(rows) {
                if ( 0 !== rows.length ) {
                    this.selectedTool = rows[0];
                }
            },

            styleTableRow(p_row) {
                if (p_row.identifier === this.selectedTool.identifier) {
                    return "category-style-5";
                }
                return "";
            },
            mapColumn(row) {
                this.alterColumnToToolMapping({columnName: row.column, toolIdentifier: this.selectedTool.identifier});
            },
            styleRow(row) {
                const styleClass = [];
                if ((this.columnToToolMap[row.column] !== null) ) {
                    styleClass.push("category-style-5");
                    if (
                        (this.columnToToolMap[row.column] !== this.selectedTool.identifier)) {
                        styleClass.push("category-transparent");
                    }
                }
                return styleClass;
            }
        }
    };
</script>
<style>

.margin-top {
    margin-top: 66px;
}
.aligned-element {
    flex: 1;
}

</style>
