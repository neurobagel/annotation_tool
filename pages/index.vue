<template>

	<b-container fluid>

		<!-- Navigation bar -->
		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>

		<!-- TSV file loading area -->
		<b-row>
			<h2>TSV File</h2>

			<!-- Debug component - shows file contents -->			
			<textarea rows="5" cols="200" v-model="stringifiedTsvFile" :key="currentState"></textarea>
			
			<!-- Selects participant.tsv file -->
			<file-selector 
				content-type="text/tab-separated-values"
				v-on:file-selected="saveTsvFileData($event)">
			</file-selector>			
		</b-row>		

		<!-- JSON file loading area -->
		<b-row>
			<h2>Data dictionary</h2>

			<!-- Debug component - shows file contents -->			
			<textarea rows="5" cols="200" v-model="stringifiedJsonFile" :key="currentState"></textarea>

			<!-- Selects participant.json file -->
			<file-selector 
				content-type="application/json"
				v-on:file-selected="saveJsonFileData($event)">
			</file-selector>			
		</b-row>
		
		<b-row>
			
			<b-col cols="9"></b-col>
			
			<b-col cols="3">
				<!-- Only enabled when file content has been loaded -->
				<b-button 
					class="float-right"
					:disabled="!readyForNextStepFlag"
					:to="'/' + pageNames.categorization.location"
					:variant="nextPageButtonColor">
					Next step: Categorize columns
				</b-button>
			</b-col>

		</b-row>

	</b-container>

</template>

<script>

	export default {
		
		name: "IndexPage",

		created() {

			// Determine page state from data contents and change to that new state
			this.changeToNewState();
		},

		data() {

			return {

				// Current state of the page
				currentState: 0,

				// Full text name of this page
				fullName: this.$store.getters.pageNames.home.fullName, 

				// Status of the navbar item links for other pages
				navItemsState: [

					{
						enabled: false,
						pageInfo: this.$store.getters.pageNames.categorization,
					},
					{ 
						enabled: false,
						pageInfo: this.$store.getters.pageNames.annotation,
					},
					{
						enabled: false,
						pageInfo: this.$store.getters.pageNames.download,
					}
				],

				// Bootstrap variant color of the button leading to the categorization page
				nextPageButtonColor: "secondary",

				// Local reference to the page names in the store
				pageNames: this.$store.getters.pageNames,

				// Possible states of this page
				possibleStates: {

					STATE_NOFILES_LOADED: 0,
					STATE_TSVFILE_LOADED: 1 << 1,
					STATE_JSONFILE_LOADED: 1 << 2,
					STATE_BOTHFILES_LOADED: (1 << 1) | (1 << 2)
				},

				// Whether or not page has enabled access to the categorization page
				readyForNextStepFlag: false,
			}
		},

		computed: {

			stringifiedJsonFile() {

				// 0. Return a blank string if there is no loaded json file
				if ( null == this.$store.state.pageData.home.jsonFile ) {
					return "";
				}

				// 1. Return a string version of the json file
				return JSON.stringify(this.jsonFile(), null, 4);
			},

			stringifiedTsvFile() {

				// 0. Return a blank string is there is no loaded tsv file
				if ( null == this.$store.state.pageData.home.tsvFile ) {
					return "";
				}

				// 1. Convert the tsv file data into a list of strings
				let storeTsv = this.tsvFile();
				let textAreaArray = [Object.keys(storeTsv[0]).join("\t")];
				for ( let index = 0; index < storeTsv.length; index++ ) {
					textAreaArray.push(Object.values(storeTsv[index]).join("\t"));
				}

				// 2. Return the tsv file data joined as one string
				return textAreaArray.join("\n");
			}
		},

		methods: {		

			categorizationPageAccess(p_enable) {
				
				// 1. Enable/disable access to the categorization page
				for ( let index = 0; index < this.navItemsState.length; index++ ) {

					// A. Look for the categorization nav item
					if ( this.pageNames.categorization.pageName == this.navItemsState[index].pageInfo.pageName ) {

						// i. Enable/disable the categorization nav item
						this.navItemsState[index].enabled = p_enable;

						break;
					}
				}

				// 2. Enable/disable the next step button
				this.readyForNextStepFlag = p_enable;

				// 3. Change the next step button's color
				this.nextPageButtonColor = ( p_enable ) ? "success" : "secondary";
			},			

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
				this.categorizationPageAccess(false);
			},

			changeState_TsvFileLoaded(p_data) {

				// Enable access to the categorization page
				this.categorizationPageAccess(true);
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
				if ( this.tsvFileLoaded() )
					newState |= this.possibleStates.STATE_TSVFILE_LOADED;
				if ( this.jsonFileLoaded() )
					newState |= this.possibleStates.STATE_JSONFILE_LOADED;

				return newState;
			},

			jsonFile() {

				// Return the object currently saved as the json file in the data store
				return this.$store.getters.pageData.home.jsonFile;
			},

			jsonFileLoaded() {

				// Return whether or not a json file has been loaded in the data store
				return ( null != this.$store.getters.pageData.home.jsonFile );
			},				

			saveTsvFileData(p_fileData) {

				// 0. Determine if a tsv file has been selected
				let newFileData = ( null == p_fileData || 0 == p_fileData.length ) ? null : p_fileData;

				// 1. Update the store with tsv file data
				this.$store.dispatch("saveTsvFile", newFileData);

				// 2. Determine page state from the new data contents and change to that new state
				this.changeToNewState();
			},

			saveJsonFileData(p_fileData) {

				// 0. Determine if a json file has been selected
				let newFileData = ( "none" == p_fileData ) ? null : p_fileData;

				// 1. Update the store with json file data
				this.$store.dispatch("saveJsonFile", newFileData);

				// 2. Determine page state from the new data contents and change to that new state
				this.changeToNewState();
			},

			tsvFile() {

				// Return the list currently saved as the tsv file in the data store
				return this.$store.getters.pageData.home.tsvFile;
			},

			tsvFileLoaded() {

				// Return whether or not a tsv file has been loaded in the data store
				return ( null != this.$store.getters.pageData.home.tsvFile );
			},						
		}
	}
</script>

<!-- App styles -->
<style>

	.container-fluid {
		
		padding: 0;
	}

	.row {
	
		margin: 1em;
		padding-left: 2em;
		padding-right: 2em;
	}
</style>
