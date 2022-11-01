<template>

    <div>

        <b-card no-body class="mb-1">

            <b-card-header class="p-1" header-tag="header" role="tab">
                <b-button block v-b-toggle="'explanation-' + uniqueID" variant="info">
                    {{ cardTitle }}
                </b-button>
            </b-card-header>

            <b-collapse :id="'explanation-' + uniqueID" accordion="explanation-accordion" role="tabpanel">
                <b-card-body>
                    <b-card-text>{{ explanation }}</b-card-text>
                </b-card-body>
            </b-collapse>

        </b-card>

    </div>

</template>

<script>
    import { v4 as uuidv4 } from 'uuid';

    export default {

        props: {

            explanation: {

                type: String,
                default: "No explanation has been provided yet."
            }
        },

        name: "AnnotExplanation",

        data() {

            return {

                cardTitle: "Explanation",

                // If we have multiple instances of the accoridion,
                // the unique ID ensures that their behaviours don't interfere
                uniqueID: uuidv4()
            };
        }
    };

</script>
