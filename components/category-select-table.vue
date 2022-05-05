<template>

    <b-container fluid>

        <!-- Heading for category select component -->
        <b-row>
            <h3>{{ title }}</h3>
        </b-row>

        <!-- Instructions prompting the user how to link categories and columns -->
        <b-row>
            <p class="instructions-text">
                {{ instructions }}
            </p>
        </b-row>

        <!-- Category selection table -->
        <b-row>
            <b-table
                outlined
                selectable
                head-variant="dark"
                :items="categoryTable"
                @row-selected="selectCategory"
                select-mode="single"
                selected-variant=""
                :tbody-tr-class="styleTableRow"
                thead-class="hidden" />
        </b-row>

    </b-container>

</template>

<script>

    export default {

        props: {

            categories: { type: Array, required: true },
            categoryClasses: { type: Object, required: true },
            instructions: { type: String, required: true },
            title: { type: String, required: true }
        },

        data() {

            return {

                selectedCategory: this.categories[0]
            };
        },

        computed: {

            categoryTable() {

                // Return a list of dicts for each category in the table
                return this.categories.map((name) => ({ category: name }));
            }
        },

        methods: {

            selectCategory(p_row) {

                // If a new category was selected...
                if ( 0 !== p_row.length ) {

                    // 1. Save the newly selected category, if given
                    this.selectedCategory = p_row[0].category;

                    // 2. Tell the parent page about the category selction
                    this.$emit("category-select", { category: this.selectedCategory });
                }
            },

            styleTableRow(p_row, p_rowType) {

                // 1. Determine the opacity for this row
                const opacityClass = ( this.selectedCategory !== p_row.category ) ?
                    "category-transparent" : "category-opaque";

                // 2. Get the color class for this row
                const colorClass = this.categoryClasses[p_row.category];

                return [opacityClass, colorClass];
            }
        }
    };

</script>

<style>

    .category-transparent {

        opacity: 0.5;
    }

    .category-opaque {

        opacity: 1.0;
    }

    .instructions-text {

        color: grey;
        font-style: italic;
    }

</style>