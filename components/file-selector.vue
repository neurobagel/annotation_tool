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
				minTextAreaRows: 2
			}
		},

		methods: {

			onFileSelected(p_event){

				// 1. Save the file name
				this.fileInput = p_event.target.files[0];
				
				// 2. Parse the whole file and save the lines
				Papa.parse(this.fileInput, {

					complete: results => {

						// A. Save the file data
						this.fileText = results.data;

						// B. Send the file data to any parent/listener
						this.$emit("file-selected", this.fileText);
					},
				});
			}
		}
	}

</script>