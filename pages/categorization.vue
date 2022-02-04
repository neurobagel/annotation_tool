<template>

	<b-container fluid>

		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>

		<b-row>

			<b-col cols="4">
				<coloring-listgroup
					:columnData="recommendedColumns"
					:defaultPalette="$store.state.columnCategorization.default"
					tag="recommended-column"
					title="Recommended Columns"
					instructions="Click column type and then corresponding column from tsv file"
					v-on:paint-action="$store.dispatch('saveCurrentPaintInfo', $event)"
					>
				</coloring-listgroup>
			</b-col>

			<b-col cols="8">
				<filedata-table
					:fields="columnMatchTableFields"
					:paintClass="getPaintClass"
					:currentPalette="$store.state.columnCategorization.current"
					:defaultPalette="$store.state.columnCategorization.default"
					:tableData="tableDataFromTsvAndOrJson"
					v-on:column-name-selected="changeState(pageNames.annotation.pageName, $event)">
				</filedata-table>
			</b-col>

		</b-row>

		<b-row>
			
			<b-col cols="9"></b-col>
			
			<b-col cols="3">
				<!-- Only enabled when at least one column has been categorized -->
				<b-button
					class="float-right"
					:disabled="nextPageButtonDisabled"
					:to="'/' + pageNames.annotation.location"
					:variant="nextPageButtonColor">
					Next step: Annotate columns
				</b-button>
			</b-col>
			
		</b-row>		

	</b-container>

</template>

<script>

	export default {

		name: "CategorizationPage",

		data() {

			return {
					
				columnMatchTableFields: [

					{ key: "column" },
					{ key: "description" }
				],

				// Initial status of the navbar items for other pages
				navItemsState: [
					
					{
						enabled: true,
						pageInfo: this.$store.state.pageNames.home
					},
					{
						enabled: false,
						pageInfo: this.$store.state.pageNames.annotation
					},
					{
						enabled: false,
						pageInfo: this.$store.state.pageNames.download
					}
				],
				
				fullName: this.$store.state.pageNames.categorization.fullName,
				pageNames: this.$store.state.pageNames,

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

			nextPageButtonColor() {

				// Return the next page button color (clickable is green, gray otherwise)
				return this.nextPageButtonDisabled ? "secondary" : "success";
			},		

			nextPageButtonDisabled() {

				// 0. Save a reference to the store table data set
				let tableDataSet = this.$store.state.columnCategorization.dataSet;

				// 0. Default row colors
				let defaultBackgroundColor = this.$store.state.columnCategorization.default.bColor;
				let defaultForegroundColor = this.$store.state.columnCategorization.default.fColor;

				// 1. Check to see if any of the records indicate a painted row
				console.log("HERE: " + JSON.stringify(tableDataSet));
				for ( let columnName in tableDataSet ) {

					if ( defaultBackgroundColor != tableDataSet[columnName].bColor || 
						 defaultForegroundColor != tableDataSet[columnName].fColor ) {

						console.log("Found non-default color");
						return false;
					}
				}

				console.log("All default colors");

				return true;
			},			

			tableDataFromTsvAndOrJson() {

				// 0. Check that there is tsv and json data in the data store
				let tsvFile = this.$store.state.tsvFile;
				let jsonFile = this.$store.state.jsonFile;
				if ( 0 == tsvFile.length && 0 == Object.keys(jsonFile).length )
					return [];

				// Uses both tsv and json data
				if ( Object.keys(jsonFile).length > 0 ) {

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
							"description": "",
							"primary-key": tsvJsonIndex - 1
							//"bColor": this.$store.state.columnCategorization.default.bColor,
							//"fColor": this.$store.state.columnCategorization.default.fColor,
						});
					}

					// B. and a corresponding "description" column that is (possibly) sourced from the json file
					for ( let json_column in jsonFile ) {

						// I. Save a lowercase version of the current json key
						let jsonColumnLowercase = json_column.toLowerCase();

						// II. Try to match the json key with one in the tsv file
						if ( headerFields.includes(jsonColumnLowercase) ) {

							for ( let index = 0; index < tsvJsonDictArray.length; index++ ) {

								// NOTE: Advanced column name matching here between tsv and json? J. Armoza 01/26/22
								if ( jsonColumnLowercase == tsvJsonDictArray[index].column.toLowerCase() ) {

									// a. Determine the description string for this json file column entry
									let descriptionStr = "";
									for ( let subkey in jsonFile[json_column] ) {

										if ( "description" == subkey.toLowerCase() ) {
											descriptionStr = jsonFile[json_column][subkey];
											break;
										}
									}	
								
									// b. Save the description from the json file colum entry
									tsvJsonDictArray[index].description = descriptionStr;
								}
							}
						}
					}

					// 2. Save the table in this component's data
					this.tableData = tsvJsonDictArray;
				}
				// Uses just tsv data
				else {

					// 1. Produce an array of dicts
					var tsvDictArray = [];

					// A. Each dict has a header entry from the tsv file
					let tsvIndex = 0;
					for ( let headerField in tsvFile[0] ) {

						tsvIndex += 1;

						// I. Save a new dict for this column and description
						tsvDictArray.push({
							"column": headerField,
							"description": "",
							"primary-key": tsvIndex - 1
						});
					}

					// 2. Save the table in this component's data
					this.tableData = tsvDictArray;
				}

				return this.tableData;
			},

		},

		methods: {

			changeState(p_state, p_data) {

				console.log("Change state");

				if ( this.pageNames.annotation.pageName == p_state ) {

					console.log("Attempt at changing to annotation access");

					// 1. Color or uncolor this table row
					this.$store.dispatch("linkColumnWithCategory", p_data);

					// 2. Record the color change on this row


					// 3. Open or close access to the annotation page
					let columnCategorization = this.$store.getters.columnCategorization;
					let enable = !this.nextPageButtonDisabled;
					
					this.annotationAccess(enable);

					// Return state has changed
					return true;
				}

				// Return state could not be changed
				return false;
			},

			annotationAccess(p_enable) {
				
				// 1. Column categorization is now available on navbar
				for ( let index = 0; index < this.navItemsState.length; index++ ) {
					if ( this.pageNames.annotation.pageName == this.navItemsState[index].pageInfo.pageName ) {
						this.navItemsState[index].enabled = p_enable;
						break;
					}
				}

				
			},			

			getPaintClass(p_item, p_type) {

				// Table row ID generation
				
				// When provided, the primary-key will generate a unique ID for
				// each item row <tr> element. The ID will be in the format of
				// {table-id}__row_{primary-key-value}, where {table-id} is the
				// unique ID of the <b-table> and {primary-key-value} is the value
				// of the item's field value for the field specified by primary-key.

				// 0. Get reference to this row element
				// ID guide: column-paint-table__row_0
				let itemID = "column-paint-table" + "__row_" + p_item["primary-key"];

				let tableRow = document.getElementById(itemID);	

				// 0. If table row doesn't exist, it means the element has not yet been created
				// and the default style should be used
				if ( !tableRow )
					return "column-paint-default";

				// 1. Determine the new class based on the table row's current background color
				let paintClass = "";
				
				// A. Check for current background color on item
				let tableRowBColor = this.$store.state.columnCategorization.default.bColor;
				if ( "style" in tableRow )
					tableRowBColor = tableRow.style.backgroundColor;

				// B. Determine new class
				switch ( tableRowBColor ) {

					case this.backgroundColors[0]:
						paintClass = "column-paint-0";
						break;
					case this.backgroundColors[1]:
						paintClass = "column-paint-1";
						break;
					case this.backgroundColors[2]:
						paintClass = "column-paint-2";
						break;
					case this.backgroundColors[3]:
						paintClass = "column-paint-3";
						break;
					case this.backgroundColors[4]:
						paintClass = "column-paint-4";
						break;
					default:
						paintClass = "column-paint-default";																
				}

				return paintClass;
			}
		},		
	}
</script>

<!-- Page styles -->
<style>

	.column-paint-default {

		background-color: white;
		color: black;
	}

	.column-paint-0 {

		background-color: "rgb(164,208,90)";
		color: "black";
	}
	.column-paint-1 {
		
		background-color: "rgb(127,23,167)";
		color: "white";
	}
	.column-paint-2 {
		
		background-color: "rgb(70,76,174)";
		color: "white";		
	}
	.column-paint-3 {
		
		background-color: "rgb(236,197,50)";
		color: "black";		
	}
	.column-paint-4 {
		
		background-color: "rgb(128,1,1)";
		color: "white";		
	}
				
</style>