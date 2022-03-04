<template>

    <div>
        <b-card>
            <p>{{ name }}</p>
        </b-card>
        <b-card>
            <p>{{ values }}</p>
        </b-card>
        <b-card>
            <p>{{ mappings }}</p>
        </b-card>
        <b-card>
            <p>{{ guesses }}</p>
        </b-card>
    </div>


</template>

<script>

    export default {

        mounted() {

            console.log("Name: " + this.name);
            console.log("Values: " + JSON.stringify(this.values));
            console.log("Mappings: " + JSON.stringify(this.mappings));
            console.log("Guesses: " + this.guesses);
        },

        data() {

            return {


            }
        },

        props: ["name", "values", "mappings", "guesses"]
    }
</script>

<style scoped>
</style>