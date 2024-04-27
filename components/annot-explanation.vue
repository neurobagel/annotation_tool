<template>

    <div>

        <b-card no-body class="mb-1">
            <b-card-header class="p-1" header-tag="header" role="tab" align="center">
                {{ uiText.cardTitle }}
            </b-card-header>
            <b-card-body>
                <b-card-text>
                    <ul>
                        <li v-for="(sentence, index) in explanationText.split('.')" :key="index">
                            {{ sentence }}.
                        </li>
                    </ul>
                </b-card-text>
            </b-card-body>
        </b-card>

    </div>

</template>

<script>

    import { mapGetters } from "vuex";

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
                }
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
