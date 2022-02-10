<template>

    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <p><h1 class="myHeader">Test page: {{ name }}</h1>
            </b-col>
        </b-row>
    </b-container>

</template>

<script>

    export default {

        // Lifecycle hooks

        beforeCreate() {

            console.log("Before create");
        },

        created() {

            console.log("Created");
        },

        beforeMount() {

            console.log("Before mount");
        },

        mounted() {

            console.log("Mounted");
        },

        beforeUnmount() {

            console.log("Before unmount");
        },

        unmounted() {

            console.log("Unmounted");  
        },

        data() {

            return {

                name: "Bob Wiley"
            }
        }

    }

</script>

<style scoped>

.myHeader {

    font-style: italic;
}
</style>