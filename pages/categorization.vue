<template>

	<b-container fluid>

		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>

		<b-row>

			<b-col cols="4">
				<coloring-listgroup
					:categories="recommendedCategories"
					:defaultPalette="$store.state.pageData.categorization.default"
					tag="recommended-column"
					title="Recommended Categories"
					instructions="Click category and then corresponding column from tsv file"
					v-on:paint-action="$store.dispatch('saveCurrentPaintInfo', $event)"
					>
				</coloring-listgroup>
			</b-col>

			<b-col cols="8">
				<filedata-table
					:fields="columnMatchTableFields"
					:currentPalette="$store.getters.currentPaintBrush"
					:defaultPalette="$store.getters.defaultPaintBrush"
					:tableData="tableDataFromTsvAndOrJson"
					:tableID="tableID"
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

		mounted() {

			// NOTE: 'document' and 'window' are not yet defined until this hook.
			// This is why any piece of functionality that requires either must be placed
			// at this later stage of the Vue hook lifecycle

			// 1. Check to see if the palette has been retrieved from the stylesheet
			if ( !this.$store.getters.hasPalette )
				this.$store.dispatch("retrievePalette");			
			
			// 2. Set the default painting color to the colors of the first painting class
			this.setCurrentPaintClass(0);

			// 3. Determine page state from data contents and change to that new state
			this.changeToNewState();
		},

		data() {

			return {

				// Columns for file data table	
				columnMatchTableFields: [

					{ key: "column" },
					{ key: "description" }
				],

				// Default table background and foreground color
				defaultBackgroundColor: this.$store.getters.defaultPaintBrush.bColor,
				defaultForegroundColor: this.$store.getters.defaultPaintBrush.fColor,

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
					STATE_ATLEASTONE_CATEGORY_PAINTED: 1 << 0
				},								
				
				// Local reference to the page names in the store
				pageNames: this.$store.getters.pageNames,

				// Whether or not page has enabled access to the annotation page
				readyForNextStepFlag: false,

				// Data for the coloring listgroup
				recommendedCategories: [

					"Subject ID",
					"Age",
					"Sex",
					"Diagnosis",
					"Assessment Tool"
				],

				tableID: "category-painting-table"
			}
		},

		computed: {	

			tableDataFromTsvAndOrJson() {

				// 0. Check that there is tsv and json data in the data store
				let tsvFile = this.$store.state.pageData.home.tsvFile;
				let jsonFile = this.$store.state.pageData.home.jsonFile;
				if ( null == tsvFile && null == jsonFile )
					return [];

				// Uses both tsv and json data
				if ( null != jsonFile && null != tsvFile ) {

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
					this.$store.dispatch("saveTableData", tsvJsonDictArray);
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
					this.$store.dispatch("saveTableData", tsvDictArray);
				}

				return this.tableData();
			}
		},

		methods: {	

			annotationPageAccess(p_enable) {
				
				// 1. Enable/disable access to the annotation page on the nav bar
				for ( let index = 0; index < this.navItemsState.length; index++ ) {
					
					// A. Look for the annotation nav item
					if ( this.pageNames.annotation.pageName == this.navItemsState[index].pageInfo.pageName ) {
						
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

				// 1. Paint the table with previously painted rows documented in the store
				this.paintTable();

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

				// 0. Counts number of painted columns
				let columnCount = 0;

				for ( let columnName in paintingData ) {

					if ( this.defaultBackgroundColor != paintingData[columnName].bColor || 
						 this.defaultForegroundColor != paintingData[columnName].fColor ) {

						columnCount += 1;
					}
				}

				return columnCount;
			},

			paintTable() {

				// 1. Attempt to repaint all the table rows that have been previously painted
				let paintingData = this.$store.getters.paintingData;
				for ( let columnID in paintingData ) {

					// A. Look for records indicating a table row has been painted
					if ( paintingData[columnID].bColor != 
						 this.$store.getters.defaultPaintBrush.bColor ) {

						// I. Retrieve the row from a reconstructed key
						let rowKey = this.tableID + "__row_" + paintingData[columnID].primaryKey;
						let row = document.getElementById(rowKey);
						
						// II. Repaint the row the corresponding colors
						row.style.backgroundColor = paintingData[columnID].bColor;
						row.style.color = paintingData[columnID].fColor;
					}
				}
			},

			setCurrentPaintClass(p_index) {

				// Set background color, foreground color, and category from the built in values
				this.$store.dispatch("saveCurrentPaintInfo", {

					bColor: this.$store.getters.palette.backgroundColors[p_index],
					category: this.recommendedCategories[p_index],
					fColor: this.$store.getters.palette.foregroundColors[p_index]
				});
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
				this.$store.dispatch(dataStoreFunction, p_clickData);

				// 2. Determine if page state should be changed and change it if necessary
				this.changeToNewState();
			},

			tableData() {

				return this.$store.getters.pageData.categorization.tableData;
			}
		},		
	}
</script>