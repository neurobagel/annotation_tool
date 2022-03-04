<template>

    <div class="accordion" role="tablist" >

        <mapper-missingdata v-for="(value, key) in columnData"
            :key="key"
            :name="value"
            :values="columnValues[key]"
            :mappings="valueMappings[key]"
            :guesses="[]">
        </mapper-missingdata>
    </div>

</template>

<script>

/*

Required information

1) data type
2) values

*/

    export default {

        data() {

            return {


            }
        },

        methods: {

            isMissingCategorical() {

                // Check for "levels" in data dictionary

                // If no "levels", gather all unique values

            },

            isMissingNumerical() {

            }
        },

        props: ["columnData", "columnValues", "valueMappings"]
    }

</script>