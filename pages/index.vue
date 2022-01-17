<template>

  	<b-container>

		<h1>Origami Annotation Tool</h1>
		<b-row>
		    <textarea :rows="fileTextLines" cols="300">
				{{ this.fileText.join("\n") }}
			</textarea>
		</b-row>
		<b-row>
			<b-form>
				<input type="file" @change="onFileSelected">
			</b-form>
		</b-row>

	</b-container>

</template>

<script>

import Vue from "vue";
import Papa from "papaparse";

export default {
  	
	name: "IndexPage",

	data() {
		return {

			fileInput: {},
			fileText: ["File text here..."],
			minimumTextLines: 2,
			sourceList: []
		}
	},
	
	components: {

	},

	computed: {

		fileTextLines() {

			let numLines = this.fileText.length;
			return numLines > 0 ? numLines : this.minimumTextLines;
		}
	},

	methods: {

		onFileSelected(p_event){

			this.fileInput = p_event.target.files[0];
			
			// eslint-disable-next-line
			// console.log(116, this.fileInput.name.split('.')[0]);

			Papa.parse(this.fileInput, {
				complete: results => {
					this.sourceList = results.data[0];
					console.log(results.data);
					this.fileText = results.data;
				},
			});
		}
	},

	// props: {
    //     selectedTerm: String,
    //     init: Object,
    //     searchResults: Array,
    //     selectedConcepts: Array
    // },
}
</script>
