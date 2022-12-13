<template>

    <b-container fluid>

        <!-- Column-categorization linking -->
        <b-row>

            <!-- Category selection table -->
            <b-col cols="4">

                <!-- Heading for category select component -->
                <b-row>
                    <h3>{{ uiText.categorySelectTitle }}</h3>
                </b-row>

                <!-- Instructions prompting the user how to link categories and columns -->
                <b-row>
                    <p class="instructions-text">
                        {{ uiText.categorySelectInstructions }}
                    </p>
                </b-row>

                <category-select-table
                    data-cy="categorization-table"
                    :selected-category="selectedCategory"
                    @category-select="setSelectedCategory($event.category)" />
            </b-col>

            <!-- Category to column linking table -->
            <b-col cols="8">
                <column-linking-table
                    data-cy="column-linking-table"
                    :selected-category="selectedCategory" />
            </b-col>

        </b-row>

    </b-container>

</template>

<script>

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    export default {

        name: "CategorizationPage",

        data() {

            return {

                // Category selection (default is index 0, no selection is -1)
                selectedCategory: "",

                // Text for UI elements
                uiText: {

                    categorySelectInstructions: "Click category and then corresponding column from tsv file",
                    categorySelectTitle: "Recommended Categories"
                }
            };
        },

        computed: {

            ...mapState([

                "categories"
            ])
        },

        mounted() {

            // Set selected category to the first category by default
            this.setSelectedCategory(this.categories[0]);
        },

        methods: {

            setSelectedCategory(p_category) {

                // Save the name of the selected category
                this.selectedCategory = p_category;
            }
        }
    };

</script>
