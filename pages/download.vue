<template>

    <div>

        <b-row >

            <b-table
                bordered
                outlined
                sticky-header
                head-variant="dark"
                :items="dataTable.annotated">
            </b-table>
            <!-- Debug component - shows file contents -->
            <!-- <textarea :rows="textArea.width" :cols="textArea.height" v-model="stringifiedDataTable"></textarea> -->
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
					Download Annotated Data
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

        data() {

            return {

				// Size of the file display textboxes
				textArea: {

					width: 5,
					height: 800
				}

            };
        },

        computed: {

            ...mapState([

				"dataTable",
				"pageData"
			]),

            ...mapGetters([

                "isDataAnnotated"
            ]),

			downloadButtonColor() {

				// Bootstrap variant color of the button leading to the output download
				return this.isDataAnnotated ? "success" : "secondary"
			},

            fields() {

                if ( !this.isDataAnnotated ) {
                    return [];
                }

                let fieldsArray = [];
                for ( let column of Object.keys(this.dataTable.annotated[0]) ) {
                    fieldsArray.push({ key: column });
                }
                return fieldsArray;
            },

			stringifiedDataTable() {

				// 0. Return a blank string is there is no loaded data table
				if ( !this.isDataAnnotated ) {
					return "";
				}

				// 1. Convert the tsv file data into a list of strings
				// NOTE: Defaults to tsv for now
				let textAreaArray = [Object.keys(this.dataTable.annotated[0]).join("\t")];
				for ( let index = 0; index < Object.keys(this.dataTable.annotated[0]).length; index++ ) {
					textAreaArray.push(Object.values(this.dataTable.annotated[index]).join("\t"));
				}

				// 2. Return the tsv file data joined as one string
				return textAreaArray.join("\n");
			}            
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
        },

        mounted() {

            // 1. Set the current page
            this.$store.dispatch("setCurrentPage", "download");
        }
    }

</script>