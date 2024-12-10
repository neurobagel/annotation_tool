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
        <b-row>
            <b-row>
                <p class="instructions-text">
                    {{ uiText.assessmentInstructions }}
                </p>
            </b-row>
        </b-row>

        <categoryToolgroup />

    </b-container>

</template>

<script>

    // Methods listed in mapGetters below can be found in the store (index.js)
    import { mapGetters } from "vuex";

    export default {
        name: "CategorizationPage",
        data() {
            return {
                // Category selection (default is index 0, no selection is -1)
                selectedCategory: "",
                // Text for UI elements
                uiText: {
                    categorySelectInstructions: "Click category and then corresponding column from tsv file",
                    categorySelectTitle: "Recommended Categories",
                    assessmentInstructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed velit risus, cursus sit amet nunc nec, ultricies ultricies nunc. Nullam nec nunc nec nunc."
                }
            };
        },
        computed: {
            ...mapGetters([
                "getCategoryNames"
            ])
        },
        mounted() {
            // Set selected category to the first category by default
            this.setSelectedCategory(this.getCategoryNames[0]);
        },
        methods: {
            setSelectedCategory(p_category) {
                // Save the name of the selected category
                this.selectedCategory = p_category;
            }
        }
    };

</script>
