<template>

    <b-container fluid>

        <!-- Navigation bar -->
		<tool-navbar 
			:navItems="pageData"
			:navOrder="pageOrder"
			:pageName="pageData.annotation.fullName">
		</tool-navbar>

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

	// Allows for reference to store data by creating simple, implicit getters
	import { mapState } from "vuex";

    export default {

        data() {

            return {

                // Image for temporary annotation page mockup
                mockupImage: {
                    filename: "annotation_mockup.jpg",
                    height: 956,
                    width: 1045
                }
            }
        },

        computed: {

            ...mapState([

                "pageData",
                "pageOrder"
            ])
        }
        
    }

</script>

<style scoped>

.vertical-center-mockup {
    margin: 0;
    position: absolute;
    top: 50%;
}

</style>
