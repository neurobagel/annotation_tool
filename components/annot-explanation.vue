<template>

    <div>

        <b-card no-body class="mb-1">

            <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle="'explanation-' + uniqueID" variant="info">
                    {{ uiText.cardTitle }}
                </b-button>
            </b-card-header>

            <b-collapse :id="'explanation-' + uniqueID" accordion="explanation-accordion" role="tabpanel">
                <b-card-body data-cy="test">
                    <b-card-text>{{ explanationText }}</b-card-text>
                </b-card-body>
            </b-collapse>

        </b-card>

    </div>

</template>

<script>

    import { mapGetters } from "vuex";
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

            explanationText() {

                // Returns default text if no explanation text exists for the active category
                const explanation = this.getExplanation(this.activeCategory);
                return ( null === explanation ) ? this.uiText.defaultText : explanation;
            }
        }
    };

</script>
