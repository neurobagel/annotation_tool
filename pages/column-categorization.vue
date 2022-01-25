<template>

	<b-container>
		
		<b-row>
			<h1>Column Categorization</h1>
		</b-row>

		<b-row>

			<b-col cols="4">
				<coloring-listgroup
					:columnData="recommendedColumns"
					tag="recommended-column"
					title="Recommended Columns"
					instructions="Click column type and then corresponding column from tsv file"
					v-on:listgroupitem-click="paintingColor = $event">
				</coloring-listgroup>
			</b-col>

			<b-col cols="8">
				<filedata-table 
					:clickColor="paintingColor"
					:tableData="tableDataFromTsvAndJson">
				</filedata-table>
			</b-col>

		</b-row>

	</b-container>

</template>

<script>

	export default {

		name: "ColumnCategorizationPage",

		data() {

			return {

				paintingColor: "white",

				recommendedColumns: {
					
					names: [
						"Subject ID",
						"Age",
						"Sex",
						"Diagnosis",
						"Assessment Tool"
					],
					backgroundColors: [
						"rgb(164,208,90)",
						"rgb(127,23,167)",
						"rgb(70,76,174)",
						"rgb(236,197,50)",
						"rgb(128,1,1)"
					],
					defaultBackgroundColor: "white",
					defaultForegroundColor: "black",
					foregroundColors: [
						"black",
						"white",
						"white",
						"black",
						"white"
					]
				},

				tableData: {}
			}
		},

		computed: {

			tableDataFromTsvAndJson() {

				// 0. Check that there is tsv and json data in the data store
				let tsvFile = this.$store.state.tsvFile;
				let jsonFile = this.$store.state.jsonFile;
				console.log("Before length check");
				console.log("Store: " + this.$store);
				console.log("tsvFile: " + tsvFile);
				console.log("jsonFile: " + jsonFile);
				if ( 0 == tsvFile.length || 0 == Object.keys(jsonFile).length )
					return [];

				console.log("After length check");

				// 1. Produce an array of dicts
				var tsvJsonDictArray = [];

				// A. Each dict has a header entry from the tsv file
				let headerFields = [];
				let tsvJsonIndex = 0;
				let tsvJsonIndexMap = {};
				for ( let headerField in tsvFile[0] ) {

					// I. Save the header field in a list
					headerFields.push(headerField);

					// II. Save an index map for quick location of column and description
					tsvJsonIndexMap.headerField = tsvJsonIndex;
					tsvJsonIndex += 1;

					// III. Save a new dict for this column and description
					tsvJsonDictArray.push({
						"column": headerField,
						"description": ""
					});
				}

				console.log("tsvJsonDictArray after initial population: " + tsvJsonDictArray);

				// B. and a corresponding "description" column that is (possibly) sourced from the json file
				for ( let json_column in Object.keys(jsonFile) ) {

					// I. Save a lowercase version of the current json key
					let jsonColumnLowercase = json_column.toLowerCase();

					console.log("jsonColumnLowercase: " + jsonColumnLowercase);

					// II. Try to match the json key with one in the tsv file
					if ( headerFields.includes(jsonColumnLowercase) ) {

						console.log("headerFields include " + jsonColumnLowercase);

						for ( let index = 0; index < tsvJsonDictArray.length; index++ ) {

							if ( jsonColumnLowercase == tsvJsonDictArray[index].column.toLowercase() ) {

								// a. Determine the description string for this json file column entry
								let descriptionStr = "";
								for ( let subkey in Object.keys(jsonFile.json_column) ) {

									if ( "description" == subkey.toLowercase() ) {
										descriptionStr = subkey;
										break;
									}
								}	
							
								// b. Save the description from the json file colum entry
								tsvJsonDictArray[index].description = jsonFile.json_column.subkey;
							}
						}
					}
				}

				// 2. Save the table in this component's data
				this.tableData = tsvJsonDictArray;

				return this.tableData;
			},

		}
	}
</script>

<!-- Page styles -->
<style scoped>


</style>