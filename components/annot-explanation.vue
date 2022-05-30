<template>

    <div>

        <b-card no-body class="mb-1">

            <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle="'accordion-explanation-' + index" variant="info">
                    {{ uiText.cardTitle }}
                </b-button>
            </b-card-header>

            <b-collapse :id="'accordion-explanation-' + index" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <b-card-text>{{ explanation }}</b-card-text>
                </b-card-body>
            </b-collapse>

        </b-card>

    </div>

</template>

<script>

    export default {

        props: {

            explanation: {

                type: String,
                default: "No explanation has been provided yet."
            },

            index: {

                type: Number,
                default: 0
            }
        },

        name: "AnnotExplanation",

        data() {

            return {

                // Text for UI elements
                uiText: {

                    cardTitle: "Explanation"
                }
            };
        }
    };

</script>
