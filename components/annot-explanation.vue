<template>

    <div>

        <b-card no-body class="mb-1">

            <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle="'explanation-' + uniqueID" variant="info">
                    {{ uiText.cardTitle }}
                </b-button>
            </b-card-header>

            <b-collapse :id="'explanation-' + uniqueID" accordion="explanation-accordion" role="tabpanel">
                <b-card-body>
                    <b-card-text>{{ explanationText }}</b-card-text>
                </b-card-body>
            </b-collapse>

        </b-card>

    </div>

</template>

<script>

    import { mapGetters, mapState } from "vuex";
    import { v4 as uuidv4 } from "uuid";

    export default {

        props: {

            activeCategory: {

                type: String,
                default: ""
            }
        },

        name: "AnnotExplanation",

        data() {

            return {

                uiText: {

                    cardTitle: "Explanation",
                    defaultText: "No category/explanation has been provided."
                },

                // If we have multiple instances of the accoridion,
                // the unique ID ensures that their behaviours don't interfere
                uniqueID: uuidv4()
            };
        },

        computed: {

            ...mapGetters([

                "getExplanation"
            ]),

            ...mapState([

                "categories"
            ]),

            explanationText() {

                // Returns default text
                return ( "explanation" in this.categories[this.activeCategory] ) ?
                    this.getExplanation(this.activeCategory) : this.uiText.defaultText;
            }
        }
    };

</script>
