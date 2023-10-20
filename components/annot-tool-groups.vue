<template>

    <div>

        <b-card
            no-body
            class="annotation-card">
            <b-tabs content-class="mt-3" fill>
                <b-tab
                    v-for="({label, identifier}, index) in getSelectedTools"
                    :key="index"
                    :title="label">
                    <annot-single-tool
                        :name="identifier"
                        :uniqueColumnValues="provideUniqueValues(identifier)" />
                </b-tab>

            </b-tabs>

        </b-card>

    </div>

</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        computed: {
            ...mapGetters([
                "getSelectedTools",
                "getColumnsForTool",
                "getUniqueColumnValues"
            ])
        },
        methods: {
            provideUniqueValues(identifier) {
                const toolColumns = this.getColumnsForTool(identifier);
                return toolColumns
                    .map(column => this.getUniqueColumnValues(column)
                        .map(value => ({"column": column, "value": value})))
                    .flat();
            }
        }
    };

</script>