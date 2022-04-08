<template>

    <b-card no-body class="annotation-card">

        <!--        TODO: make this also toggleable like the explanation tab-->
        <b-card-header>{{ uiText.instructions }}</b-card-header>

        <b-card-body class="columns-card-body">
            <b-list-group>
                <b-list-group-item
                    class="d-flex justify-content-between align-items-center"
                    v-for="[columName, categoryName] of Object.entries(filteredColumns)">
                    {{ columName }}
                    <b-button
                        variant="danger"
                        @click="removeColumn(columName, categoryName)">
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
            
            activeCategory: { type: String, default: "" },
            columns: { type: Object, required: true }
        },    

        name: "annotate-part-annotated-columns",

        data() {

            return {

                uiText: {

                    instructions: "Review the annotated columns",
                    removeButton: "remove"
                }
            };
        },

        computed: {

            filteredColumns() {

                // "columns" is an object of the form
                // { columnName: "CategoryName", ... } that contains all annotated columns and the categories they were mapped to
                // In normal use, this object is kept in the global state and is passed here via the parent components
                return Object.fromEntries(
                    Object.entries(this.columns)
                          .filter(([columnName, categoryName]) => categoryName === this.activeCategory)
                );
            }
        },    

        methods: {

            removeColumn(columnName, categoryName) {
                
                // TODO: take the information passed from the button to remove the column from the list of columns in the global state
                this.$emit("remove:column", {

                    removedColumn: columnName,
                    columnCategory: categoryName
                });
            },

            // TODO: retrieve any descriptions of the column names from the data dictionary - if they exist
            retrieveColumnDescription() {

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
