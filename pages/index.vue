<template>

	<b-container fluid>

		<!-- Data table file loading area -->
        <b-row>
            <h2>Data table</h2>
        </b-row>

        <!-- Shows file contents -->
		<b-row>
			<textarea :rows="textArea.width" :cols="textArea.height" v-model="stringifiedDataTable"></textarea>
		</b-row>

        <!-- Selects data table file (i.e. participants.tsv) -->
        <b-row>
			<file-selector
				:content-type="contentTypes.dataTable"
				v-on:file-selected="saveDataTable($event)">
			</file-selector>
        </b-row>


		<!-- Data dictionary file loading area -->
        <b-row>
            <h2>Data dictionary</h2>
        </b-row>

        <!-- Shows file contents -->
		<b-row>
			<textarea :rows="textArea.width" :cols="textArea.height" v-model="stringifiedDataDictionary"></textarea>
		</b-row>

        <b-row>
        	<!-- Selects data dictionary file (i.e. participants.json) -->
			<file-selector
				:content-type="contentTypes.dataDictionary"
				v-on:file-selected="saveDataDictionary($event)">
			</file-selector>
        </b-row>
        
		<b-row>

			<b-col cols="9"></b-col>

			<!-- Button to proceed to the next page -->
			<!-- Only enabled when file content has been loaded -->
			<b-col cols="3">
				<b-button
					class="float-right"
					:disabled="!pageData.categorization.accessible"
					:to="'/' + pageData.categorization.location"
					:variant="nextPageButtonColor">
                    {{ buttonText }}
				</b-button>
			</b-col>

		</b-row>

	</b-container>

</template>

<script>

	// Allows for reference to store data by creating simple, implicit getters
	import { mapState } from "vuex";

	export default {

		name: "IndexPage",

		data() {

			return {

                // Next button text
                buttonText: "Next step: Categorize columns",

				// Content types that are expected for the file selectors
				contentTypes: {

					dataDictionary: "application/json",
					dataTable: "text/tab-separated-values"
				},

				// Size of the file display textboxes
				textArea: {

					width: 5,
					height: 200
				}
			}
		},

		computed: {

			...mapState([

				"dataDictionary",
				"dataTable",
				"pageData"
			]),

            nextPageButtonColor() {
            
                // Bootstrap variant color of the button leading to the categorization page
                return this.pageData.categorization.accessible ? "success" : "secondary";
            },

			stringifiedDataDictionary() {

				// 0. Return a blank string if there is no loaded data dictionary file
				if ( !this.$store.getters.isDataDictionaryLoaded ) {
					return "";
				}

				// 1. Return a string version of the data dictionary file
				// NOTE: Defaults to json for now
				return JSON.stringify(this.dataDictionary.original, null, 4);
			},

			stringifiedDataTable() {

				// 0. Return a blank string is there is no loaded data table
				if ( !this.$store.getters.isDataTableLoaded ) {
					return "";
				}

				// 1. Convert the tsv file data into a list of strings
				// NOTE: Defaults to tsv for now
				let textAreaArray = [Object.keys(this.dataTable.original[0]).join("\t")];
				for ( let index = 0; index < Object.keys(this.dataTable.original[0]).length; index++ ) {
					textAreaArray.push(Object.values(this.dataTable.original[index]).join("\t"));
				}

				// 2. Return the tsv file data joined as one string
				return textAreaArray.join("\n");
			}
		},

        mounted() {

            // 1. Set the current page name
            this.$store.dispatch("setCurrentPage", "home");

            // 2. If a data table has been loaded, 
            // enable access to the categorization page and perform setup actions for it
            this.$store.dispatch("enablePage", {

                pageName: "categorization",
                enable: this.$store.getters.isDataTableLoaded
            });            
        },        

		methods: {

			saveDataDictionary(p_fileData) {

				// Update the store with json file data
                // NOTE: Defaults to json for now
				this.$store.dispatch("saveDataDictionary", {

					data: ( "none" == p_fileData ) ? null : p_fileData,
					fileType: "json"
				});
			},            

			saveDataTable(p_fileData) {

				// 1. Update the store with tsv file data
                // NOTE: Defaults to tsv for now
				this.$store.dispatch("saveDataTable", {

					data: ( null == p_fileData || 0 == p_fileData.length ) ? null : p_fileData,
					fileType: "tsv"
				});

                // 2. Enable access to the categorization page and perform setup actions for it
                this.$store.dispatch("enablePage", {

                    pageName: "categorization",
                    enable: true
                });
			}
		}		
	};

</script>
