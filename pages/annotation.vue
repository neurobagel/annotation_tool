<template>

    <b-container fluid>
		<!-- Navigation bar -->
		<tool-navbar :navItemsState="navItemsState"></tool-navbar>

    </b-container>


</template>

<script>

    export default {

        data() {

            return {

                // Initial status of the navbar items for other pages
                navItemsState: [

                    { 
                        enabled: true,
                        pageInfo: this.$store.state.pageNames.home,
                    },
					{
                        enabled: true,
                        pageInfo: this.$store.state.pageNames.categorization
                    },
					{
                        enabled: false,
                        pageInfo: this.$store.state.pageNames.download
                    }
				]
            }
        }
        
    }

</script>

<style>
</style>