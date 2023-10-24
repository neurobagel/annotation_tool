<template>

    <b-card
        no-body
        class="annotation-card">

        <!-- TODO: Make this also toggleable like the explanation tab -->
        <b-card-header>{{ uiText.instructions }}</b-card-header>

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

                uiText: {

                    instructions: "Review the annotated columns",
                    removeButton: "remove"
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
            ])
        }
    };

</script>

<style scoped>

    .columns-card-body {

        height: 30vh;
        overflow-y: scroll;
    }

</style>
