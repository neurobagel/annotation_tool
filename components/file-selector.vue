<template>

	<div>

		<b-row class="file-selector-row">
			<b-form>
				<label class="file-selector-button btn">
					{{ uiText.instructions }}
					<input type="file" :accept="contentType" @change="onFileSelected"/>
				</label>
				<span>{{ fileName }}</span>
			</b-form>
		</b-row>

	</div>

</template>

<script>

	import Papa from "papaparse";	// Input file reading

	export default {

		props: {
			
			contentType: { type: String, required: true }
		},
		
		data() {

			return {
				
				knownContentTypes: {

					"json": "application/json",
					"tsv": "text/tab-separated-values"
				},

				fileInput: null,

				uiText: {

					instructions: "Choose file"
				}
			}
		},

		computed: {

			fileName() {

				return ( null === this.fileInput ) ? "" : this.fileInput.name;
			}
		},

		methods: {

			onFileSelected(p_event){

				// 1. Save the file name
				this.fileInput = p_event.target.files[0];

				// A. If no file selected, emit a no file selected message
				if ( "undefined" === typeof this.fileInput ) {
					this.$emit("file-selected", "none");
					return;
				}
				
				// 2. Parse the whole file and save the lines
				
				// A. TSV file parsing
				if ( this.knownContentTypes["tsv"] === this.contentType ) {

					Papa.parse(this.fileInput, {

						complete: results => {

							// I. Send the file data to the store to be processed and saved
							this.$emit("file-selected", results.data);
						},
					});
				} 
				// B. JSON file parsing
				else if ( this.knownContentTypes["json"] === this.contentType ) {

					// I. Reference to this json object in this component's data
					var myJson;

					// II. Create a file reader object for reading the json file contents
					const reader = new FileReader();

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
		}
	}

</script>

<style>

	input[type="file"] {

		display: none;
	}

	.custom-file-upload {

		border: 1px solid #ccc;
		cursor: pointer;
		display: inline-block;
		padding: 6px 12px;
	}

	.file-selector-button {

		background-color: #28a745;
		border-color: #28a745;
		border-radius: 5px;
		color: white;
		padding: 0.5em 0.75em 0.5em 0.75em;
	}

	.file-selector-button:hover {
		
		background-color: green;
		border-color: green;
		color: white;
	}

	.file-selector-button:active {

		background: #e5e5e5;
		box-shadow: inset 0px 0px 5px #c1c1c1;
		-moz-box-shadow: inset 0px 0px 5px #c1c1c1;
		-webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
		outline: none;
	}

	.file-selector-row {

		margin-left: 0 !important;
		padding-left: 0 !important;
	}

</style>