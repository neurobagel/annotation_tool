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
                    v-for="columnName of getMappedColumns(activeCategory)">
                    {{ columnName }} {{ getColumnDescription(columnName) }}
                    <b-button
                        variant="danger"
                        @click="removeColumn(columnName)">
                        {{ uiText.removeButton }}
                    </b-button>
                </b-list-group-item>
            </b-list-group>
        </b-card-body>

    </b-card>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        props: {

            activeCategory: { type: String, required: true }
        },

        name: "AnnotatePartAnnotatedColumns",

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
                "getMappedColumns",
                "getColumnDescription"
            ])
        },

        methods: {

            removeColumn(columnName) {

                // Trigger an unlinking of this column from its previously assigned category in the store
                this.$emit("remove:column", {

                    removedColumn: columnName
                });
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
