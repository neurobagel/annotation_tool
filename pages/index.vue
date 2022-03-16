<template>

	<b-container fluid>

		<!-- Navigation bar -->
		<tool-navbar 
			:navItems="pageData"
			:navOrder="pageOrder"
			:pageName="pageData.home.fullName">
		</tool-navbar>

		<!-- Data table file loading area -->
		<b-row>
			<h2>Data table</h2>

			<!-- Debug component - shows file contents -->			
			<textarea :rows="textArea.width" :cols="textArea.height" v-model="stringifiedDataTable"></textarea>
			
			<!-- Selects data table file (i.e. participants.tsv) -->
			<file-selector 
				:content-type="contentTypes.dataTable"
				v-on:file-selected="saveDataTable($event)">
			</file-selector>			
		</b-row>		

		<!-- Data dictionary file loading area -->
		<b-row>
			<h2>Data dictionary</h2>

			<!-- Debug component - shows file contents -->			
			<textarea :rows="textArea.width" :cols="textArea.height" v-model="stringifiedDataDictionary"></textarea>

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
					Next step: Categorize columns
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
		
		mounted() {

			// Determine page state from data contents and change to that new state
			this.changeToNewState();
		},

		data() {

			return {

				// Content types that are expected for the file selectors
				contentTypes: {

					dataDictionary: "application/json",
					dataTable: "text/tab-separated-values"
				},

				// Bootstrap variant color of the button leading to the categorization page
				nextPageButtonColor: "secondary",

				// Possible states of this page
				possibleStates: {

					STATE_NOFILES_LOADED: 0,
					STATE_TSVFILE_LOADED: 1 << 0,
					STATE_JSONFILE_LOADED: 1 << 1,
					STATE_BOTHFILES_LOADED: (1 << 0) | (1 << 1)
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
				"pageData",
				"pageOrder"
			]),

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

		methods: {				

			changeState(p_state) {

				// 1. Trigger the behavior for the requested state change
				switch ( p_state ) {

					// A. Handle changes for when a tsv file has been loaded
					case this.possibleStates.STATE_TSVFILE_LOADED:
					case this.possibleStates.STATE_BOTHFILES_LOADED:
						this.changeState_TsvFileLoaded();
						break;

					// B. No interface changes necessary
					case this.possibleStates.STATE_JSONFILE_LOADED:
						break;

					// C. Handle changes for when no files are loaded
					default:
						this.changeState_NoFilesLoaded();
						break;
				}
			},

			changeState_NoFilesLoaded() {

				// Disable access to the categorization page
				this.nextPageAccess(false);
			},

			changeState_TsvFileLoaded(p_data) {

				// Enable access to the categorization page
				this.nextPageAccess(true);
			},

			changeToNewState() {

				// 1. Determine page state from data contents
				let newState = this.determineState();

				// 2. Change the page to the determined state
				this.changeState(newState);
			},

			determineState() {

				// 1. Reset the state to default
				let newState = this.possibleStates.STATE_NOFILES_LOADED;

				// 2. Add appropriate state flags based on data contents
				if ( this.$store.getters.isDataTableLoaded )
					newState |= this.possibleStates.STATE_TSVFILE_LOADED;
				if ( this.$store.getters.isDataDictionaryLoaded )
					newState |= this.possibleStates.STATE_JSONFILE_LOADED;

				return newState;
			},			

			nextPageAccess(p_enable) {
				
				// 1. Enable/disable access to the categorization page

				// A. Enable the nav item
				this.$store.dispatch("enablePageNavigation", { 
					pageName: "categorization",
					enable: p_enable
				});

				// B. Change the next step button's color
				this.nextPageButtonColor = ( p_enable ) ? "success" : "secondary";

				// 2. Create the new annotated table for categorization if access is enabled
				this.$store.dispatch("createColumnToCategoryMap");
			},

			saveDataTable(p_fileData) {

				// 0. Determine if a data dictionary file has been selected
				// NOTE: Defaults to tsv for now
				let newFileData = {
					
					data: ( null == p_fileData || 0 == p_fileData.length ) ? null : p_fileData,
					fileType: "tsv"
				};

				// 1. Update the store with tsv file data
				this.$store.dispatch("saveDataTable", newFileData);

				// 2. Determine page state from the new data contents and change to that new state
				this.changeToNewState();
			},

			saveDataDictionary(p_fileData) {

				// 0. Determine if a data dictionary file has been selected
				// NOTE: Defaults to json for now
				let newFileData = {

					data: ( "none" == p_fileData ) ? null : p_fileData,
					fileType: "json"
				};

				// 1. Update the store with json file data
				this.$store.dispatch("saveDataDictionary", newFileData);

				// 2. Determine page state from the new data contents and change to that new state
				this.changeToNewState();
			},					
		}
	}
</script>
