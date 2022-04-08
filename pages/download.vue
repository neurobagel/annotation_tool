<template>

    <div>

        <b-row >

            <b-col cols="12">
                <b-table
                    bordered
                    outlined
                    sticky-header
                    striped
                    head-variant="dark"
                    :items="dataTable.annotated">
                </b-table>
            </b-col>
            
        </b-row>

        <b-row>

            <b-col cols="9"></b-col>

            <!-- Button to proceed to download the annotation output data -->
			<!-- Only enabled when annotation has been at least partially completed -->
			<b-col cols="3">
				<b-button
					class="float-right"
					:disabled="!isDataAnnotated"
					:variant="downloadButtonColor">
					{{ uiText.downloadButton }}
				</b-button>
			</b-col>
        
        </b-row>

    </div>

</template>

<script>

	// Allows for reference to store data by creating simple, implicit getters
	import { mapState } from "vuex";
    import { mapGetters } from "vuex";

    export default {

        name: "DownloadPage",

        data() {

            return {

				// Size of the file display textboxes
				textArea: {

					width: 5,
					height: 800
				},

                // Text for UI elements
                uiText: {

                    downloadButton: "Download Annotated Data"
                }

            };
        },

        computed: {

            ...mapGetters([

                "isDataAnnotated"
            ]),			

            ...mapState([

				"dataTable"
			]),

			downloadButtonColor() {

				// Bootstrap variant color of the button leading to the output download
				return this.isDataAnnotated ? "success" : "secondary"
			}           
        },

        mounted() {

            // Set the current page
            this.$store.dispatch("setCurrentPage", "download");
        },		

        methods: {

            saveFile() {

                // 1. Create a blob out of the annotated table data           
                const data = JSON.stringify(this.dataTable.annotated)
                const blob = new Blob([data], {type: "text/plain"})
    
                // 2. Create an anchor tag in memory linked to the blob
                const pseudoAnchor = document.createElement("a");
                pseudoAnchor.download = "annotated_data.json";
                pseudoAnchor.href = window.URL.createObjectURL(blob);
                pseudoAnchor.dataset.downloadurl = [
                    "text/json",
                    pseudoAnchor.download,
                    pseudoAnchor.href
                ].join(':');
                
                // 3. Dispatch a mouse click event on the in-memory anchor tag
                const pseudoClickEvent = document.createEvent("MouseEvents");
                pseudoClickEvent.initEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                pseudoAnchor.dispatchEvent(pseudoClickEvent);
            }
        }
    }

</script>