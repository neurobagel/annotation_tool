<template>

    <div>

        <!-- Navigation bar -->
        <tool-navbar />

        <!-- Current page -->
        <Nuxt />

        <!-- Next page button -->
        <next-page v-if="getNextPage()!==''" />

    </div>

</template>

<script>

    import { mapGetters } from "vuex";

    export default {

        name: "DefaultLayout",

        methods: {

            ...mapGetters([

                "getNextPage"
            ])
        }
    };

</script>