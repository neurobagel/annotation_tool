<template>

    <b-card
        no-body
        class="annotation-card">
        <b-card-header>{{ uiText.instructions }}</b-card-header>
        <b-card-body class="continuous-values-card-body">

            <v-select
                data-cy="selectTransform"
                :options="transformChoices"
                :value="getActiveHeuristic(this.activeCategory)"
                @input="commitHeuristic($event)" />

            <b-table
                hover
                striped
                id="annotation-table"
                data-cy="dataTable"
                :items="validationItems" />

        </b-card-body>
    </b-card>


</template>

<script>

    import { mapGetters, mapMutations } from "vuex";

    export default {

        props: {

            activeCategory: {type: String, required: true}
        },

        name: "ContinuousTable",

        data() {

            return {

                uiText: {

                    instructions: "Review the age harmonization",
                    saveButton: "Save Annotation"
                }
            };
        },
        computed: {

            ...mapGetters([

                "getPreviewValues",
                "getHarmonizedPreview",
                "getTransformHeuristics",
                "getActiveHeuristic"
            ]),

            transformChoices() {

                return this.getTransformHeuristics(this.activeCategory);
            },

            validationItems() {

                // A table generated from the unique values provided by the
                // store for columns assigned to the activeCategory.
                return Object.entries(
                    this.getPreviewValues(this.activeCategory)
                ).map(([column, values]) => {
                    return values.map(value => {
                        return {
                            rawValue: value,
                            column: column,
                            preview: this.getHarmonizedPreview(column, value)
                        };
                    });
                }).flat();
            }
        },

        methods: {

            ...mapMutations([

                "setHeuristic"
            ]),

            commitHeuristic(p_heuristic) {

                // TODO: With the addition of ability to set heuristic for
                // individual columns, 'activeCategory' below will be replaced
                // with the appropriate column name
                this.setHeuristic({ column: this.activeCategory, heuristic: p_heuristic });
            }
        }
    };

</script>

<style scoped>

.continuous-values-card-body {

    height: 300px;
    overflow-y: scroll;
    position: relative;
}

</style>
