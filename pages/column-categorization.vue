<template>

	<b-container fluid>

		<tool-navbar :navItemsState="navbarState"></tool-navbar>
		
		<b-row>
			<h2>Column Categorization</h2>
		</b-row>

		<b-row>

			<b-col cols="4">
				<coloring-listgroup
					:columnData="recommendedColumns"
					:defaultPalette="$store.state.columnCategorization.default"
					tag="recommended-column"
					title="Recommended Columns"
					instructions="Click column type and then corresponding column from tsv file"
					v-on:listgroupitem-click="paintingColor = $event"
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
					v-on:column-name-selected="changeState('annotation', $event)">
				</filedata-table>
			</b-col>

		</b-row>

		<b-row>
			
			<b-col cols="10"></b-col>
			
			<b-col cols="2">
				<!-- Only enabled when at least one column has been categorized -->
				<b-button 
					:variant="nextPageButtonColor"
					:disabled="nextPageButtonDisabled"
					to="/annotation">
					Annotate Columns
				</b-button>
			</b-col>
			
		</b-row>		

	</b-container>

</template>

<script>

	export default {

		name: "ColumnCategorizationPage",

		data() {

			return {
					
				columnMatchTableFields: [

					{ key: "column" },
					{ key: "description" }
				],

				navbarState: {

					"index": true,
					"column-categorization": true,
					"annotation": false,
					"download": false
				},
				
				paintingColor: "white",

				pageName: "column-categorization",

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

				// 0. Get column categorization dataset from the store
				let columnCategorization = this.$store.getters.columnCategorization;

				// 1. Return if at least one column has been categorized (painted)

				// A. Get a list of the column names for traversing the table
				let sidecarColumns = Object.keys(columnCategorization.dataSet);

				// B. Get the default colors
				let defaultBackgroundColor = columnCategorization.default.bColor;
				let defaultForegroundColor = columnCategorization.default.fColor;

				console.log("defaultBackgroundColor: " + defaultBackgroundColor);
				console.log("defaultForegroundColor: " + defaultForegroundColor);

				// C. Check the table for painted rows
				for ( let index = 0; index < sidecarColumns.length; index++ ) {

					let key = sidecarColumns[index];
					console.log("Looking at sidecar column " + key + "...");
					console.log("Current painted color: " + columnCategorization.dataSet[key].bColor);

					// I. Is row painted?
					if ( defaultBackgroundColor != columnCategorization.dataSet[key].bColor )
						return false;
				}			

				// No columns have been painted
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

				if ( "annotation" == p_state ) {

					console.log("Request to change to annotation state...");

					// 1. Color or uncolor this table row
					this.$store.dispatch("linkColumnWithCategory", p_data)

					// 2. Open or close access to the annotation page
					let columnCategorization = this.$store.getters.columnCategorization;
					let disable = ( columnCategorization.default.bColor == columnCategorization.current.bColor );
					this.annotationAccess(disable);

					// Return state has changed
					return true;
				}

				// Return state could not be changed
				return false;
			},

			annotationAccess(p_enable) {
				
				// 1. Column categorization is now available on navbar
				this.navbarState["annotation"] = true;
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
			},

			// pageAccessibility(p_routeName) {

			// 	let routeMatch = ( p_routeName == this.pageName );
			// 	let hasTableData = ( this.tableData.length > 0 );

			// 	console.log("column-categorization pageAccessibility");
			// 	console.log("Route match: " + routeMatch);
			// 	console.log("Has table data: " + hasTableData);

			// 	return ( routeMatch && hasTableData );
			// }
		},

		// mounted() {

		// 	// Insert page accessibility function into store here
		// 	this.$store.dispatch("newPageAccesibility", this.pageName, this.pageAccessibility);
		// }		
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