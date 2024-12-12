<template>
    <div>
        <b-row>
            <b-col cols="4">
                <b-row>
                    <v-select
                        v-if="tableRows.length > 0"
                        :filter-by="filterOptions"
                        placeholder="Select an assessment tool"
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
            <b-col cols="8">
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
    </div>
</template>

<script>

    import { mapGetters, mapState, mapMutations } from 'vuex';

    export default {
        data() {
            return {
                selectedTool: {
                    tool: null,
                    identifier: null
                },
                instructions: 'Select a tool from the dropdown and then assign columns to it.'
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
            filterOptions(option, label, search) {
                if (!label || search[0].toLowerCase() !== label[0].toLowerCase()) {
                    return false;
                }

                let labelIndex = 1;
                for (let searchIndex = 1; searchIndex < search.length; searchIndex++) {
                    const searchChar = search[searchIndex].toLowerCase();
                    let matchFound = false;

                    while (labelIndex < label.length) {
                        if (label[labelIndex].toLowerCase() === searchChar) {
                            matchFound = true;
                            labelIndex++;
                            break;
                        }
                        labelIndex++;
                    }

                    if (!matchFound) {
                        return false;
                    }
                }
                return true;
            },
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
