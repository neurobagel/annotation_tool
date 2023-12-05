<template>

    <!-- Next page button -->
    <b-row align-h="end">
        <b-col class="text-right" cols="4">

            <!-- Optional instructions to remind user of criteria to proceed to the next page -->
            <p
                class="instructions-text"
                data-cy="instructions-nextpage"
                v-if="!isPageAccessible(nextPage)">
                {{ uiText.instructions[currentPage] }}
            </p>

            <!-- Button to proceed to the next page -->
            <!-- Only enabled when next page accessibility criteria have been met -->
            <b-button
                class="float-right"
                data-cy="button-nextpage"
                :disabled="!isPageAccessible(nextPage)"
                :variant="nextPageButtonColor"
                @click="navigateToPage(nextPage);">
                {{ uiText.button[currentPage] }}
            </b-button>
        </b-col>
    </b-row>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    // Allows for direct mutations of store data
    import { mapMutations } from "vuex";

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    import { mapActions } from "vuex";

    export default {

        data() {

            return {

                uiText: {

                    button: {

                        "home": "Next step: Categorize columns",
                        "categorization": "Next step: Annotate columns",
                        "annotation": "Next step: Review and download harmonized data"
                    },

                    instructions: {

                        "home": "",
                        "categorization": "One column must be categorized as 'Subject ID' and all assessment tools must be grouped to proceed",
                        "annotation": "One categroized column must be annotated to proceed"
                    }
                }
            };
        },

        computed: {

            ...mapGetters([

                "isPageAccessible"
            ]),

            ...mapState([

                "pageOrder"
            ]),

            currentPage() {
                return this.$route.name;
            },
            nextPage() {
                const pageIndex = this.pageOrder.indexOf(this.currentPage);
                if (pageIndex < this.pageOrder.length - 1) {
                    return this.pageOrder[pageIndex + 1];
                } else {
                    return "";
                }
            },

            nextPageButtonColor() {
                // Bootstrap variant color of the button leading to the next page
                return this.isPageAccessible(this.nextPage) ? "success" : "secondary";
            }
        },

        methods: {

            ...mapMutations([

                "setCurrentPage"
            ]),
            ...mapActions([
                "navigateToPage"
            ])
        }
    };

</script>