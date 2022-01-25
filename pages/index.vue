<template>

	<b-container>

		<h1>Origami Annotation Tool</h1>

		<!-- Selects participant.tsv file -->
		<file-selector v-on:file-selected="saveTsvFileData($event)"></file-selector>

		<!-- Selects participant.json file -->
		<file-selector v-on:file-selected="saveJsonFileData($event)"></file-selector>

		<b-row>
			<textarea rows="10" cols="200">{{ $store.state.tsvFile }}</textarea>
		</b-row>
		
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

				fileText: ["File text here..."]
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

				// Return whether fileText is a file with multiple lines or 
				// a file with one line but not the default text
				return (this.fileText.length == 1 && this.fileText[0] == "File text here...");
			}
		},

		methods: {

			saveTsvFileData(p_fileData) {
				
				// 1. Save the file data locally to the page
				this.fileText = p_fileData;

				// 2. Update the store with tsv file data
				this.$store.dispatch("saveTsvFile", p_fileData);
			},

			saveJsonFileData(p_fileData) {
				
				// 1. Save the file data locally to the page
				this.jsonFileData = p_fileData;

				// 2. Update the store with tsv file data
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
