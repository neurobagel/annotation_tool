<template>

    <b-card
        no-body
        class="annotation-card">

        <!-- TODO: Make this also toggleable like the explanation tab -->
        <b-card-header>{{ uiText.instructions }}</b-card-header>

        <b-card-body class="columns-card-body">
            <b-list-group>
                <b-list-group-item
                    class="d-flex justify-content-between align-items-center"
                    :key="columnName"
                    v-for="columnName of relevantColumns">
                    {{ columnName }} {{ retrieveColumnDescription(columnName) }}
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

    export default {

        props: {

            relevantColumns: { type: Array, required: true }
        },

        inject: ["columnDescription"],

        name: "AnnotatePartAnnotatedColumns",

        data() {

            return {

                uiText: {

                    instructions: "Review the annotated columns",
                    removeButton: "remove"
                }
            };
        },

        methods: {

            removeColumn(columnName) {
                
                // Trigger an unlinking of this column from its previously assigned category in the store
                this.$emit("remove:column", {

                    removedColumn: columnName
                });
            },

            retrieveColumnDescription(p_columnName) {

                // Attempt to get the description of this column from the data dictionary
                const columnDescription = this.columnDescription(p_columnName);

                // Return the column description if it exists, otherwise return blank string
                return ( null !== columnDescription ) ? ` - ${columnDescription}` : "";
            }
        }
    }
    
</script>

<style scoped>

    .columns-card-body {
        
        height: 30vh;
        overflow-y: scroll;
    }

</style>
