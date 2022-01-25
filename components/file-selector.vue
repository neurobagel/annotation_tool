<template>

	<b-container>

		<b-row>
			<textarea :rows="fileTextLineCount" :cols="minTextAreaCols">
				{{ this.fileText.join("\n") }}
			</textarea>
		</b-row>

		<b-row>
			<b-form>
				<input type="file" @change="onFileSelected">
				<!-- <b-form-input v-model="file" placeholder="Enter your name"></b-form-input> -->
			</b-form>
		</b-row>

	</b-container>

</template>

<script>

	import { BFormInput } from "bootstrap-vue"; // File selection
	import Papa from "papaparse";				// Input file reading

	export default {
		
		components: { 

			"b-form-input": BFormInput
		},

		computed: {
			
			fileTextLineCount() {

				// Return the number of lines of the file or the minimum number of lines for the text area
				return this.fileText.length > 1 ? this.fileText.length : this.minTextAreaRows;
			}
		},

		data() {

			return {

				minTextAreaCols: 300,
				fileInput: {},
				fileText: ["File text here..."],
				jsonObj: {},
				minTextAreaRows: 2
			}
		},

		methods: {

			onFileSelected(p_event){

				// 1. Save the file name
				this.fileInput = p_event.target.files[0];
				console.log("this.fileInput: " + this.fileInput);
				
				// 2. Parse the whole file and save the lines
				
				// A. CSV file parsing
				if ( this.fileInput.name.toLowerCase().endsWith(".csv") ) {

					Papa.parse(this.fileInput, {

						complete: results => {

							// A. Save the file data
							this.fileText = results.data;

							// B. Send the file data to any parent/listener
							this.$emit("file-selected", this.fileText);
						},
					});
				} 
				// B. JSON file parsing
				else if ( this.fileInput.name.toLowerCase().endsWith(".json") ) {

					this.jsonObj = this.fileInput.text().then(text => {
						 JSON.parse(text)
					});

					console.log("JSON OBJ RETURNED:\n" + Object.keys(this.jsonObj));

					this.$emit("file-selected", this.jsonObj);
				}

			}
		}
	}

</script>

<!-- Component styles -->
<style scoped>
</style>