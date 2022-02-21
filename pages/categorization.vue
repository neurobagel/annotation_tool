<template>

	<b-container fluid>

		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>

		<b-row>

			<b-col cols="4">
				<coloring-listgroup
					:categoryData="recommendedCategories"
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
					:paintClass="getPaintClass"
					:currentPalette="$store.state.pageData.categorization.current"
					:defaultPalette="$store.state.pageData.categorization.default"
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

		created() {

			// Determine page state from data contents and change to that new state
			this.changeToNewState();
		},

		mounted() {

			// 1. Pull background and foreground colors from paint classes in the global stylesheet
			this.retrievePaletteFromGlobalStyle();

			// 2. Set the default painting color to the colors of the first painting class
			this.setCurrentPaintClass(0);
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
					STATE_ATLEASTONE_CATEGORY_PAINTED: 1 << 0
				},								
				
				// Local reference to the page names in the store
				pageNames: this.$store.getters.pageNames,

				paintClasses: {

					paint0: "category-style-0",
					paint1: "category-style-1",
					paint2: "category-style-2",
					paint3: "category-style-3",
					paint4: "category-style-4"
				},

				// Whether or not page has enabled access to the annotation page
				readyForNextStepFlag: false,

				// Data for the coloring listgroup
				recommendedCategories: {
					
					backgroundColors: [],
					foregroundColors: [],

					names: [

						"Subject ID",
						"Age",
						"Sex",
						"Diagnosis",
						"Assessment Tool"
					]
				},

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

				return columnCount;
			},

			getCssValue(p_cssObject, p_cssKey) {
				
				// Return the CSS value of the given key if it exists, otherwise blank string
				return ( p_cssKey in p_cssObject ) ? p_cssObject[p_cssKey] : "";
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

					case this.recommendedCategories.backgroundColors[0]:
						paintClass = this.paintClasses.paint0;
						break;
					case this.recommendedCategories.backgroundColors[1]:
						paintClass = this.paintClasses.paint1;
						break;
					case this.recommendedCategories.backgroundColors[2]:
						paintClass = this.paintClasses.paint2;
						break;
					case this.recommendedCategories.backgroundColors[3]:
						paintClass = this.paintClasses.paint3;
						break;
					case this.recommendedCategories.backgroundColors[4]:
						paintClass = this.paintClasses.paint4;
						break;
					default:
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
				// ID example: category-style-table__row_0

				return "category-style-table" + "__row_" + p_primaryKey;
			},

			parseCssString(p_cssString) {

				// Produce object based on the CSS string via regular expression parsing
				let regex = /([\w-]*)\s*:\s*([^;]*)/g;
				let match, cssProperties={};
				while ( match = regex.exec(p_cssString) ) {

					cssProperties[match[1]] = match[2].trim();
				}

				return cssProperties;
			},

			retrievePaletteFromGlobalStyle() {

				// 1. Go through stylesheets until we find the paintClasses
				for ( let sheetID in document.styleSheets ) {

					for ( let ruleID in document.styleSheets[sheetID].cssRules ) {

						for ( let paintClass in this.paintClasses ) {

							// A. Make sure the CSS ruleset is an object containing a CSS string with the desired paint class
							if ( typeof (document.styleSheets[sheetID].cssRules[ruleID]) === "object" &&
								 "cssText" in document.styleSheets[sheetID].cssRules[ruleID] &&
								 -1 != document.styleSheets[sheetID].cssRules[ruleID].cssText.indexOf(this.paintClasses[paintClass]) ) {

								// I. Parse the CSS string for this class into an object
								let cssProperties = this.parseCssString(
									document.styleSheets[sheetID].cssRules[ruleID].cssText);

								// II. Retrieve the background-color and color from the css object
								let backgroundColor = this.getCssValue(
									cssProperties,
									"background-color"
								);
								let foregroundColor = this.getCssValue(
									cssProperties,
									"color"
								);

								// III. Save the background and foreground colors
								this.recommendedCategories.backgroundColors.push(backgroundColor);
								this.recommendedCategories.foregroundColors.push(foregroundColor);
							}
						}
					}
				}
			},

			setCurrentPaintClass(p_index) {

				// Set background color, foreground color, and category from the built in values
				this.$store.dispatch("saveCurrentPaintInfo", {

					bColor: this.recommendedCategories.backgroundColors[p_index],
					category: this.recommendedCategories.names[p_index],
					fColor: this.recommendedCategories.foregroundColors[p_index]
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