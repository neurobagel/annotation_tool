<template>

<<<<<<< HEAD
    <b-container fluid>

		<!-- Navigation bar -->
		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>
=======
    <b-container>

        <b-row>
            <h1>Column Annotation</h1>
        </b-row>
>>>>>>> main

        <b-row>
            <b-col cols="4"></b-col>
            <b-col cols="4">
                <img class="vertical-center-mockup"
                     :src="require(`~/assets/${mockupImage.filename}`)"
                     :width="mockupImage.width"
                     :height="mockupImage.height"/>
            </b-col>
            <b-col cols="4"></b-col>
<<<<<<< HEAD
        </b-row>        

    </b-container>


=======
        </b-row>

    </b-container>

>>>>>>> main
</template>

<script>

    export default {

        data() {

            return {

<<<<<<< HEAD
                // Full text name of this page
				fullName: this.$store.getters.pageNames.categorization.fullName, 

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
        
=======
                mockupImage: {

                    filename: "annotation_mockup.jpg",
                    height: 956,
                    width: 1045
                }
            }
        }
>>>>>>> main
    }

</script>

<<<<<<< HEAD
<style scoped>

.vertical-center-mockup {
=======
<style>

.vertical-center-mockup {

>>>>>>> main
    margin: 0;
    position: absolute;
    top: 50%;
    /*-ms-transform: translateY(50%);*/
    /*transform: translateY(50%);*/
}

<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> main
