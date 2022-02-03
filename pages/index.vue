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
		<tool-navbar :navItemsState="navbarState"></tool-navbar>

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
			<textarea rows="5" cols="200" v-model="stringifiedJsonFile" ></textarea>

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
					:variant="nextPageButtonColor"
					:disabled="nextPageButtonDisabled"
					to="/column-categorization">
					Categorize Columns
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
				
				jsonSelected: false,
				myModel: ["This is my text"],
				pageName: "index",
				tsvSelected: false,

				navbarState: {
					"index": true,
					"column-categorization": false,
					"annotation": false,
					"download": false
				}
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

				return [JSON.stringify(this.$store.state.jsonFile, null, 4)]
			},

			stringifiedTsvFile() {

				let storeTsv = this.$store.state.tsvFile;

				if ( 0 == storeTsv.length )
					return [""];

				let textAreaArray = [Object.keys(storeTsv[0]).join("\t")];
				for ( let index = 0; index < storeTsv.length; index++ ) {
					textAreaArray.push(Object.values(storeTsv[index]).join("\t"));
				}

				return [textAreaArray.join("\n")];
			}

		},

		methods: {

			changeState(p_state, p_data) {

				if ( "column-categorization" == p_state ) {

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
				this.navbarState["column-categorization"] = true;

				// 2. Indicate tsv file has been selected
				this.tsvSelected = true;
			},

			// pageAccessibility(p_routeName) {

			// 	let routeMatch = ( p_routeName == this.pageName );

			// 	console.log("index pageAccessibility");
			// 	console.log("Route match: " + routeMatch);

			// 	return ( routeMatch );
			// },

			saveTsvFileData(p_fileData) {

				// 1. Enable access to the column categorization page
				this.changeState("column-categorization", p_fileData); 

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
		},

		// mounted() {

		// 	// Insert page accessibility function into store here
		// 	this.$store.dispatch("newPageAccesibility", this.pageName, this.pageAccessibility);
		// }
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
