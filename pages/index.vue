<template>

	<b-container>

		<h1>Origami Annotation Tool</h1>

		<!-- Debug component - shows file contents -->
		<b-row>
			<h2>TSV File</h2>
			<textarea rows="5" cols="200" v-model="stringifiedTsvFile"></textarea>
		</b-row>		

		<!-- Selects participant.tsv file -->
		<file-selector 
			content-type="text/tab-separated-values"
			v-on:file-selected="saveTsvFileData($event)">
		</file-selector>

		<!-- Debug component - shows file contents -->
		<b-row>
			<h2>JSON File</h2>
			<textarea rows="5" cols="200" v-model="stringifiedJsonFile" ></textarea>
		</b-row>

		<!-- Selects participant.json file -->
		<file-selector 
			content-type="application/json"
			v-on:file-selected="saveJsonFileData($event)">
		</file-selector>
		
		<b-row>
			<!-- Moves to column annotation page.
					Only enabled when file content has been loaded -->
			<b-button 
				:variant="nextPageButtonColor"
				:disabled="nextPageButtonDisabled"
				to="/column-categorization" nuxt>
				Annotate Columns
			</b-button>
		</b-row>

	</b-container>

</template>

<script>

	import { BButton } from "bootstrap-vue";

	export default {
		
		name: "IndexPage",

		data() {

			return {
				
				myModel: ["This is my text"],
				jsonSelected: false,
				tsvSelected: false
			}
		},
		
		components: {

			"b-button": BButton
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

			saveTsvFileData(p_fileData) {

				// 0. Make sure a file has been selected
				this.tsvSelected = ( "none" != p_fileData );
				if ( !this.tsvSelected )
					return;

				// 1. Update the store with tsv file data
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

	.row {
		margin: 1em;
	}
</style>
