<template>

    <div>

        <b-row>

            <b-col cols="12">
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
            </b-col>
        </b-row>

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    export default {

        name: "CategorySelectTable",

        props: {

            selectedCategory: { type: String, required: true }
        },

        computed: {

            ...mapGetters([

                "getCategoryNames"
            ]),

            ...mapState([

                "colorInfo"
            ]),

            categoryTable() {

                // Return a list of dicts for each category in the table
                return this.getCategoryNames.map((name) => ({ category: name }));
            }
        },

        methods: {

            selectCategory(p_row) {

                // If a new category was selected...
                if ( 0 !== p_row.length ) {

                    // Tell the parent page about the category selection
                    this.$emit("category-select", { category: p_row[0].category });
                }
            },

            styleTableRow(p_row, p_rowType) {

                // 1. Determine the opacity for this row
                const opacityClass = ( this.selectedCategory !== p_row.category ) ?
                    "category-transparent" : "category-opaque";

                // 2. Get the color class for this row
                const colorClass = this.colorInfo.categoryClasses[p_row.category];

                return [opacityClass, colorClass];
            }
        }
    };

</script>