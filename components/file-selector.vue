<template>

	<b-container>

		<b-row>
			<b-form>
				<input type="file" :accept="contentType" @change="onFileSelected">
			</b-form>
		</b-row>

	</b-container>

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

							// II. Convert data to array of strings
							var fileStringArray = [];
							let cleanedString = "";
							for ( let numericKey in this.fileText ){

								// a. Skip blank lines
								if ( 0 == this.fileText[numericKey][0].length )
									continue;

								// b. Replace multiple spaces with just one
								cleanedString = this.fileText[numericKey][0].replace(/\s+/g, " ");

								// b. Save the tsv line
								fileStringArray.push(cleanedString);
							}

							// III. Send the file data to any parent/listener
							this.$emit("file-selected", fileStringArray);
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