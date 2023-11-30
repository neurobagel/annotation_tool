<template>

    <div>

        <!-- Navigation bar -->
        <tool-navbar />

        <!-- Current page -->
        <Nuxt />

        <!-- Next page button -->
        <next-page v-if="$route.name !== 'download'" />

    </div>

</template>

<script>

    export default {

        name: "DefaultLayout"
    };

</script>