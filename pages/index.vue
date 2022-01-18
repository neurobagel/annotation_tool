<template>

	<b-container>

		<h1>Origami Annotation Tool</h1>

		<!-- Selects participant.tsv file -->
		<file-selector v-on:file-selected="fileText += $event"></file-selector>

		<!-- Moves to column annotation page.
				Only enabled when file content has been loaded -->
		<b-button 
			:variant="nextPageButtonColor"
			:disabled="nextPageButtonDisabled"
			to="/column-annotation" nuxt>
			Annotate Columns
		</b-button>

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
	}
}
</script>
