<template>
    <div>
        <b-table
            data-cy="assessment-column-table"
            outlined
            selectable
            head-variant="dark"
            :items="tableRows"
            select-mode="single"
            selected-variant=""
            thead-class="hidden" />

        <v-select
            data-cy="toolgroup-select"
            label="Select a tool"
            :options="toolGroups"
            outlined
            @input="selectTool"
            :selectable="(option) => !selectedTools.some(el => el.tool.includes(option))" />

        <b-table
            v-if="selectedTools.length > 0"
            data-cy="assessment-tool-table"
            outlined
            selectable
            head-variant="dark"
            :items="selectedTools"
            select-mode="single"
            selected-variant=""
            thead-class="hidden" />
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                toolGroups: ["MOCA", "UPDRSIII", "SomeOtherThing", "AnotherThing"],
                selectedTools: []
            };

        },

        computed: {
            ...mapGetters([
                'getColumnsForCategory'
            ]),
            tableRows() {
                return this.getColumnsForCategory('Assessment Tool').map(column => ({
                    column: column
                }));
            }
        },
        methods: {
            selectTool(selectedTool) {

                this.selectedTools.push({ tool: selectedTool});
                console.log('selected', selectedTool);
                console.log('list', this.selectedTools);

            }
        }
    };
</script>