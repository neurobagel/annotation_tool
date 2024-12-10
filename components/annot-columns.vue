<template>

    <b-card
        no-body
        class="annotation-card">

        <!-- TODO: Make this also toggleable like the explanation tab -->
        <b-card-header>
            {{ uiText.instructions }}
            <b-button
                v-b-toggle.annot-columns-card-body-collapse
                class="float-right"
                data-cy="toggle-collapse-button"
                @click="toggleCollapse">
                {{ isCollapsed ? uiText.expandButton : uiText.collapseButton }}
            </b-button>
        </b-card-header>

        <b-collapse id="annot-columns-card-body-collapse">
            <b-card-body class="columns-card-body">
                <b-list-group>
                    <b-list-group-item
                        data-cy="mappedColumns"
                        class="d-flex justify-content-between align-items-center"
                        :key="columnName"
                        v-for="columnName of getColumnsForCategory(activeCategory)">
                        {{ columnName }} {{ getColumnDescription(columnName) }}
                        <b-button
                            :data-cy="'remove_' + columnName"
                            variant="danger"
                            @click="alterColumnCategoryMapping({category: activeCategory, columnName: columnName})">
                            {{ uiText.removeButton }}
                        </b-button>
                    </b-list-group-item>
                </b-list-group>
            </b-card-body>
        </b-collapse>

    </b-card>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters, mapMutations } from "vuex";

    export default {

        props: {

            activeCategory: { type: String, required: true }
        },

        name: "AnnotColumns",

        data() {

            return {
                isCollapsed: true,

                uiText: {

                    instructions: "Review the annotated columns",
                    removeButton: "remove",
                    expandButton: "Expand",
                    collapseButton: "Collapse"
                }
            };
        },

        computed: {
            ...mapGetters([
                "getColumnsForCategory",
                "getColumnDescription"
            ])
        },

        methods: {
            ...mapMutations([
                "alterColumnCategoryMapping"
            ]),

            toggleCollapse() {
                this.isCollapsed = !this.isCollapsed;
            }
        }
    };

</script>

<style scoped>

    .columns-card-body {

        height: 30vh;
        overflow-y: scroll;
    }

</style>
