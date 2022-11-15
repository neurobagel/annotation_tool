<template>

    <div>

        <!-- Category selection table -->
        <b-row class="no-padding-row">

            <b-col cols="12" class="no-padding-col">
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
                <b-icon-plus-circle
                    style="display: block; margin-left: auto; margin-right: auto;"
                    @click="addCustomCategory" />
            </b-col>
        </b-row>

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        data() {

            return {

                selectedCategory: ""
            };
        },

        created() {

            // Set the first given category as the selected one
            this.selectedCategory = this.categories[0];
        },

        computed: {

            ...mapGetters([

                "categories",
                "categoryClasses"
            ]),

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

</style>