<template>

	<b-container fluid>

		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>

		<b-row>

			<b-col cols="4">
				<coloring-listgroup
					:columnData="recommendedColumns"
					:defaultPalette="$store.state.pageData.categorization.default"
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
					:currentPalette="$store.state.pageData.categorization.current"
					:defaultPalette="$store.state.pageData.categorization.default"
					:tableData="tableDataFromTsvAndOrJson"
					v-on:column-name-selected="tableClick($event)">
				</filedata-table>
			</b-col>

		</b-row>

		<b-row>
			
			<b-col cols="9"></b-col>
			
			<b-col cols="3">
				<!-- Only enabled when at least one column has been categorized -->
				<b-button
					class="float-right"
					:disabled="!readyForNextStepFlag"
					:to="'/' + pageNames.annotation.location"
					:variant="nextPageButtonColor">
					Next step: Annotate columns
				</b-button>
			</b-col>
			
		</b-row>		

	</b-container>

</template>

<script>

	// String literals

	export default {

		name: "CategorizationPage",

		created() {

			// Determine page state from data contents and change to that new state
			this.changeToNewState();
		},		

		data() {

			return {

				// Columns for file data table	
				columnMatchTableFields: [

					{ key: "column" },
					{ key: "description" }
				],

				// Current state of the page
				currentState: 0,

				// Default table background color
				defaultBackgroundColor: this.$store.getters.pageData.categorization.default.bColor,

				// Full text name of this page
				fullName: this.$store.getters.pageNames.categorization.fullName, 

				// Status of the navbar item links for other pages
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

				// Bootstrap variant color of the button leading to the categorization page
				nextPageButtonColor: "secondary",

				// Possible states of this page
				possibleStates: {

					STATE_NOCATEGORIES_PAINTED: 0,
					STATE_ATLEASTONE_CATEGORY_PAINTED: 1 << 1
				},								
				
				// Local reference to the page names in the store
				pageNames: this.$store.getters.pageNames,

				paintClasses: {

					paint0: "column-paint-0",
					paint1: "column-paint-1",
					paint2: "column-paint-2",
					paint3: "column-paint-3",
					paint4: "column-paint-4",
					paintDefault: "column-paint-default"
				},

				// Whether or not page has enabled access to the annotation page
				readyForNextStepFlag: false,

				// Data for the coloring listgroup
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
				}
			}
		},

		computed: {	

			tableDataFromTsvAndOrJson() {

				// 0. Check that there is tsv and json data in the data store
				let tsvFile = this.$store.state.pageData.home.tsvFile;
				let jsonFile = this.$store.state.pageData.home.jsonFile;
				if ( null == tsvFile && null == jsonFile )
					return [];

				console.log("Point 1");
				console.log("tsvFile: " + tsvFile);
				console.log("jsonFile: " + jsonFile);

				// Uses both tsv and json data
				if ( null != jsonFile ) {

					console.log("Point 2a");

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

					console.log("Point 2b");

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

					console.log("Point 2c");

					// 2. Save the table in this component's data
					this.$store.dispatch("saveTableData", tsvJsonDictArray);
				}
				// Uses just tsv data
				else {

					console.log("Point 3a");

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

					console.log("Point 3b");

					// 2. Save the table in this component's data
					this.$store.dispatch("saveTableData", tsvDictArray);
				}

				return this.tableData();
			}
		},

		methods: {

			annotationPageAccess(p_enable) {

				console.log("Annotation page access with p_enable: " + p_enable);
				
				// 1. Enable/disable access to the annotation page on the nav bar
				for ( let index = 0; index < this.navItemsState.length; index++ ) {
					
					// A. Look for the annotation nav item
					if ( this.pageNames.annotation.pageName == this.navItemsState[index].pageInfo.pageName ) {

						console.log("Found annotation pagename");
						
						// i. Enable/disable the annotation nav item
						this.navItemsState[index].enabled = p_enable;
						
						break;
					}
				}

				// 2. Enable/disable the next step button
				this.readyForNextStepFlag = p_enable;

				// 3. Change the next step button's color
				this.nextPageButtonColor = ( p_enable ) ? "success" : "secondary";
			},			

			changeToNewState() {

				// 1. Determine page state from data contents
				let newState = this.determineState();

				// 2. Change the page to the determined state
				this.changeState(newState);
			},

			determineState() {

				// 1. Reset the state to default
				let newState = this.possibleStates.STATE_NOCATEGORIES_PAINTED;

				// 2. Count the number of painted rows in the table
				let paintedRowsCount = this.countPaintedColumns();

				// 3. Add appropriate state flags based on data contents
				if ( paintedRowsCount > 0 )
					newState |= this.possibleStates.STATE_ATLEASTONE_CATEGORY_PAINTED;

				return newState;
			},

			changeState(p_state) {

				// 1. Trigger the behavior for the requested state change
				switch ( p_state ) {

					// A. Handle changes for when at least one category is painted
					case this.possibleStates.STATE_ATLEASTONE_CATEGORY_PAINTED:
						this.changeState_AtLeastOneCategoryPainted();
						break;

					// B. Handle changes for no categories are painted
					default:
						this.changeState_NoCategoriesPainted();
						break;
				}
			},

			changeState_AtLeastOneCategoryPainted() {

				// Enable access to the annotation page
				this.annotationPageAccess(true);
			},

			changeState_NoCategoriesPainted() {

				// Disable access to the annotation page
				this.annotationPageAccess(false);
			},

			countPaintedColumns() {

				// 0. Save a reference to the store table data set
				let paintingData = this.$store.getters.paintingData;

				// 0. Default row colors
				let defaultBackgroundColor = this.$store.state.pageData.categorization.default.bColor;
				let defaultForegroundColor = this.$store.state.pageData.categorization.default.fColor;

				// 0. Counts number of painted columns
				let columnCount = 0;

				for ( let columnName in paintingData ) {

					if ( defaultBackgroundColor != paintingData[columnName].bColor || 
						 defaultForegroundColor != paintingData[columnName].fColor ) {

						columnCount += 1;
					}
				}

				console.log("Column count: " + columnCount);

				return columnCount;
			},

			getPaintClass(p_item, p_type) {

				// 0. Get reference to this row element
				let itemID = this.paintTableKey(p_item["primary-key"]);
				let tableRow = document.getElementById(itemID);	

				// 0. If table row doesn't exist, it means the element has not yet been created
				// and the default style should be used
				if ( !tableRow )
					return this.paintClasses.paintDefault;

				// 1. Determine the new class based on the table row's current background color
				let paintClass = "";
				
				// A. Check for current background color on item
				let tableRowBColor = this.defaultBackgroundColor;
				if ( "style" in tableRow )
					tableRowBColor = tableRow.style.backgroundColor;

				// B. Determine new class
				switch ( tableRowBColor ) {

					case this.recommendedColumns.backgroundColors[0]:
						console.log("Class zero");
						paintClass = this.paintClasses.paint0;
						break;
					case this.recommendedColumns.backgroundColors[1]:
						console.log("Class one");
						paintClass = this.paintClasses.paint1;
						break;
					case this.recommendedColumns.backgroundColors[2]:
						console.log("Class two");
						paintClass = this.paintClasses.paint2;
						break;
					case this.recommendedColumns.backgroundColors[3]:
						console.log("Class four");
						paintClass = this.paintClasses.paint3;
						break;
					case this.recommendedColumns.backgroundColors[4]:
						console.log("Class five");
						paintClass = this.paintClasses.paint4;
						break;
					default:
						console.log("Class default");
						paintClass = this.paintClasses.paintDefault;
						break;
				}

				return paintClass;
			},

			paintTableKey(p_primaryKey) {

				// Table row ID generation
				//
				// When provided, the primary-key will generate a unique ID for
				// each item row <tr> element. The ID will be in the format of
				// {table-id}__row_{primary-key-value}, where {table-id} is the
				// unique ID of the <b-table> and {primary-key-value} is the value
				// of the item's field value for the field specified by primary-key.
				//
				// ID example: column-paint-table__row_0

				return "column-paint-table" + "__row_" + p_primaryKey;
			},						

			tableClick(p_clickData) {

				// 0. Coloring will be determined by previously defined category-column linkage in store
				let columnName = p_clickData.column;
				let paintingData = this.$store.getters.paintingData;

				// 1. Color or uncolor table row

				// A. Determine if coloring or uncoloring has occurred

				// I. Unclicked columns will be colored by default
				let coloring = !( columnName in paintingData );

				// II. Look for the column in the painting data to decide
				if ( columnName in paintingData ) {
					coloring = ( this.defaultBackgroundColor == paintingData[columnName].bColor );
				}

				// B. Record the color/uncolor in the data store
				let dataStoreFunction = ( coloring ) ? "linkColumnWithCategory" : "unlinkColumnWithCategory";
				this.$store.dispatch(dataStoreFunction, p_clickData.column);

				// 2. Determine if page state should be changed and change it if necessary
				this.changeToNewState();
			},

			tableData() {

				return this.$store.getters.pageData.categorization.tableData;
			}	
		},		
	}
</script>

<!-- Page styles -->
<style scoped>

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