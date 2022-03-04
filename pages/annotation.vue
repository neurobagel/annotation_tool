<template>

    <b-container fluid>

		<!-- Navigation bar -->
		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>

        <b-row>
            <b-col cols="4"></b-col>
            <b-col cols="4">
                <img class="vertical-center-mockup"
                     :src="require(`~/assets/${mockupImage.filename}`)"
                     :width="mockupImage.width"
                     :height="mockupImage.height"/>
            </b-col>
            <b-col cols="4"></b-col>
        </b-row>        

    </b-container>

</template>

<script>

    export default {

        data() {

            return {

                // Full text name of this page
				fullName: this.$store.getters.pageData.categorization.fullName, 

                // Image for temporary annotation page mockup
                mockupImage: {
                    filename: "annotation_mockup.jpg",
                    height: 956,
                    width: 1045
                },

                // Initial status of the navbar items for other pages
                navItemsState: [

                    { 
                        enabled: true,
                        pageInfo: this.$store.getters.pageData.home,
                    },
					{
                        enabled: true,
                        pageInfo: this.$store.getters.pageData.categorization
                    },
					{
                        enabled: false,
                        pageInfo: this.$store.getters.pageData.download
                    }
				]
            }
        }
        
    }

</script>

<style scoped>

.vertical-center-mockup {
    margin: 0;
    position: absolute;
    top: 50%;
    /*-ms-transform: translateY(50%);*/
    /*transform: translateY(50%);*/
}

</style>
