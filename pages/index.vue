<!-- 

Starting on the landing page we,

1) Select a tsv file
	A) Change the state to enable access to the column categorization page
		I) This change in state triggers several actions on the interface
			a) Categorization nav enabled
			b) Categorize button enabled
		II) This requires a general change state function that
			a) Gets flags depicting what state changes are to be made
				i) Example of this would be triggering column-categorization enable page actions
				or triggering annotation enable page actions
2) Optionally select a JSON file

Description of the in-code events

1) User selects TSV file
2) In select function, calls 'changeState' function in index page's methods
	A) Change state function triggers interface changes and opens access to next page
		I) nextPageAccess(enable=true)
			a) Enable access
			b) Relevant interface changes to enable UI access


-->

<!-- 

Navitem stats

1) Disable - grey
2) Active page - green pill
3) Enabled but not active page - black

-->

<template>

	<b-container fluid>

		<!-- Navigation bar -->
		<tool-navbar :pageName="fullName" :navItemsState="navItemsState"></tool-navbar>

		<!-- TSV file loading area -->
		<b-row>
			<h2>TSV File</h2>

			<!-- Debug component - shows file contents -->			
			<textarea rows="5" cols="200" v-model="stringifiedTsvFile"></textarea>
			
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
			<textarea rows="5" cols="200" v-model="stringifiedJsonFile"></textarea>

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
					:disabled="nextPageButtonDisabled"
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

		data() {

			return {
				
				// File selected flags
				jsonSelected: false,
				tsvSelected: false,

				// Initial status of the navbar items for other pages
				navItemsState: [

					{
					  	enabled: false,
						pageInfo: this.$store.state.pageNames.categorization,
					},
					{ 
						enabled: false,
						pageInfo: this.$store.state.pageNames.annotation,
					},
					{
						enabled: false,
						pageInfo: this.$store.state.pageNames.download,
					}
				],

				fullName: this.$store.state.pageNames.home.fullName,
				pageNames: this.$store.state.pageNames
			}
		},

		computed: {

			nextPageButtonColor() {

				// Return the next page button color (clickable is green, gray otherwise)
				return this.nextPageButtonDisabled ? "secondary" : "success";
			},		

			nextPageButtonDisabled() {

				// Return if at least a tsv file has been selected
				// Json file is not required
				return ( !this.tsvSelected );
			},

			stringifiedJsonFile() {

				// 0. Return a blank string if there is no loaded json file
				if ( typeof this.$store.state.jsonFile === "undefined" ||
					 0 == Object.keys(this.$store.state.jsonFile).length )
					return "";
				
				// 1. Return a string version of the json file
				return JSON.stringify(this.$store.state.jsonFile, null, 4);
			},

			stringifiedTsvFile() {

				// 0. Return a blank string is there is no loaded tsv file
				if ( 0 == this.$store.state.tsvFile.length )
					return "";

				// 1. Convert the tsv file data into a list of strings
				let storeTsv = this.$store.state.tsvFile;
				let textAreaArray = [Object.keys(storeTsv[0]).join("\t")];
				for ( let index = 0; index < storeTsv.length; index++ ) {
					textAreaArray.push(Object.values(storeTsv[index]).join("\t"));
				}

				// 2. Return the tsv file data joined as one string
				return textAreaArray.join("\n");
			}

		},

		methods: {

			changeState(p_state, p_data) {

				if ( this.pageNames.categorization.pageName == p_state ) {

					// 1. Check if tsv file has been selected
					if ( "none" == p_data )
						return false;

					// 2. Open access to the column categorization page
					this.columnCategorizationAccess(true);

					// Return state has changed
					return true;
				}

				// Return state could not be changed
				return false;
			},

			columnCategorizationAccess(p_enable) {
				
				// 1. Column categorization is now available on navbar
				for ( let index = 0; index < this.navItemsState.length; index++ ) {
					if ( this.pageNames.categorization.pageName == this.navItemsState[index].pageInfo.pageName ) {
						this.navItemsState[index].enabled = true;
						break;
					}
				}

				// 2. Indicate tsv file has been selected
				this.tsvSelected = true;
			},

			saveTsvFileData(p_fileData) {

				// 1. Enable access to the column categorization page
				this.changeState(this.pageNames.categorization.pageName, p_fileData); 

				// 2. Update the store with tsv file data
				this.$store.dispatch("saveTsvFile", p_fileData);
			},

			saveJsonFileData(p_fileData) {

				// 0. Make sure a file has been selected
				this.jsonSelected = ( "none" != p_fileData );
				if ( !this.jsonSelected )
					return;				

				// 1. Update the store with tsv file data
				this.$store.dispatch("saveJsonFile", p_fileData);
			}			
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
