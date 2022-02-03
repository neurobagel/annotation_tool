<template>

	<div>

		<b-row class="file-selector-row">
			<b-form>
				<input type="file" :accept="contentType" @change="onFileSelected">
			</b-form>
		</b-row>

	</div>

</template>

<script>

	import Papa from "papaparse";				// Input file reading

	export default {
		
		data() {

			return {

				fileInput: {},
				fileText: ["File text here..."],
			}
		},

		methods: {

			onFileSelected(p_event){

				// 1. Save the file name
				this.fileInput = p_event.target.files[0];

				// A. If no file selected, emit a no file selected message
				if ( "undefined" == typeof this.fileInput ) {
					this.$emit("file-selected", "none");
					return;
				}
				
				// 2. Parse the whole file and save the lines
				
				// A. TSV file parsing
				if ( this.fileInput.name.toLowerCase().endsWith(".tsv") ) {			

					Papa.parse(this.fileInput, {

						complete: results => {

							// I. Save the file data
							this.fileText = results.data;

							// II. Send the file data to the store to be processed and saved
							this.$emit("file-selected", this.fileText);
						},
					});
				} 
				// B. JSON file parsing
				else if ( this.fileInput.name.toLowerCase().endsWith(".json") ) {

					// I. Reference to this json object in this component's data
					var myJson;

					// II. Create a file reader object for reading the json file contents
					let reader = new FileReader();

					// III. On loading the file contents:
					reader.onload = e => {

						// a. Save a reference to the loaded contents
						myJson = e.target.result;

						// b. Send the file data to any parent/listener
						this.$emit("file-selected", myJson);
					};

					// IV. Read the json file contents as text
					reader.readAsText(this.fileInput);
				}

			}		
		},

		props: ["contentType"]
	}

</script>

<style>

.file-selector-row {

	margin-left: 0 !important;
	padding-left: 0 !important;
}

</style>