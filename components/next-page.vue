<template>

    <!-- Next page button -->
    <b-row align-h="end">
        <b-col class="text-right" cols="4">

            <!-- Optional instructions to remind user of criteria to proceed to the next page -->
            <p class="instructions-text" v-if="!isPageAccessible(currentPage)">
                {{ uiText.instructions[currentPage] }}
            </p>

            <!-- Button to proceed to the next page -->
            <!-- Only enabled when next page accessibility criteria have been met -->
            <b-button
                class="float-right"
                data-cy="button-nextpage"
                :disabled="!pageData[getNextPage].accessible"
                :to="'/' + pageData[getNextPage].location"
                :variant="nextPageButtonColor"
                @click="setCurrentPage(getNextPage)">
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
                        "annotation": ""
                    }
                }
            };
        },

        computed: {

            ...mapGetters([

                "getNextPage",
                "isPageAccessible"
            ]),

            ...mapState([

                "currentPage",
                "pageData"
            ]),

            nextPageButtonColor() {

                // Bootstrap variant color of the button leading to the next page
                return this.isPageAccessible(this.getNextPage) ? "success" : "secondary";
            }
        },

        methods: {

            ...mapMutations([

                "setCurrentPage"
            ])
        }
    };

</script>