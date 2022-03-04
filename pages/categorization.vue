<template>

	<b-container fluid>

		<tool-navbar :navItemsState="navItemsState" :pageName="fullName"></tool-navbar>

		<b-row>

			<b-col cols="4">
				<coloring-listgroup
					:categories="$store.getters.categories"
					tag="recommended-column"
					title="Recommended Categories"
					instructions="Click category and then corresponding column from tsv file"
					v-on:category-select="setCurrentCategory($event)">
				</coloring-listgroup>
			</b-col>

			<b-col cols="8">
				<filedata-table
					:fields="columnMatchTableFields"
					:currentStyleClass="$store.getters.getStyleClass[$store.getters.categoryToColorMap[categorySelection.current]]"
					:defaultStyleClass="$store.getters.getStyleClass[$store.getters.categoryToColorMap[categorySelection.default]]"
					:tableData="tableDataFromTsvAndOrJson"
					:tableID="tableID"
					v-on:column-name-selected="tableClick($event)"
					ref="table">
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
					:to="'/' + pageData.annotation.location"
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

			//

			// NOTE: 'document' and 'window' are not yet defined until this hook.
			// This is why any piece of functionality that requires either must be placed
			// at this later stage of the Vue hook lifecycle			

			// Determine page state from data contents and change to that new state
			this.changeToNewState();
		},

		data() {

			return {

				// Category selection (default is index 0, no selection is -1)
				categorySelection: {

					current: 0,
					default: -1
				},

				// Columns for file data table	
				columnMatchTableFields: [

					{ key: "column" },
					{ key: "description" }
				],

				// Full text name of this page
				fullName: this.$store.getters.pageData.categorization.fullName, 

				// Status of the navbar item links for other pages
				navItemsState: [
					
					{
						enabled: true,
						pageInfo: this.$store.getters.pageData.home
					},
					{
						enabled: false,
						pageInfo: this.$store.getters.pageData.annotation
					},
					{
						enabled: false,
						pageInfo: this.$store.getters.pageData.download
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
				pageData: this.$store.getters.pageData,

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
				let tsvFile = this.$store.state.tsvDataOriginal;
				let jsonFile = this.$store.state.dataDictionaryOriginal;
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
					if ( this.pageData.annotation.pageName == this.navItemsState[index].pageInfo.pageName ) {
						
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
				let paintedRowsCount = this.countLinkedColumns();

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
				this.styleTable();

				// Enable access to the annotation page
				this.annotationPageAccess(true);
			},

			changeState_NoCategoriesPainted() {

				// 1. Paint the table with previously painted rows documented in the store
				this.styleTable();				

				// Disable access to the annotation page
				this.annotationPageAccess(false);
			},

			countLinkedColumns() {

				return Object.keys(this.$store.getters.categoryColumnMap).length;
			},

			setCurrentCategory(p_clickData) {

				// Save the listgroup item index of what has been clicked
				this.categorySelection.current = p_clickData.categoryIndex;
			},

			styleTable() {

				// Table styling should occur on page state change, but child table component should handle the styling
				this.$refs.table.styleTable();
			},					

			tableClick(p_clickData) {

				// 0. Coloring will be determined by previously defined category-column linkage in store
				let columnName = p_clickData.column;
				let categoryColumnMap = this.$store.getters.categoryColumnMap;

				// 1. Style or unstyle table row

				// A. Determine if category-column linking or unlinking has occurred

				// I. Unclicked columns will not be in the category column map
				let linking = !( columnName in categoryColumnMap );

				// B. Record the linking/unlinking in the data store
				let dataStoreFunction = ( linking ) ? "linkColumnWithCategory" : "unlinkColumnWithCategory";

				// I. Build a new object for passing to the store for category-column linking
				let dataForStore = {
					
					column: p_clickData["column"],
					primaryKey: p_clickData["primary-key"]
				};
				if ( linking ) {
					dataForStore.tsvCategory = this.categorySelection.current;
				}

				// II. Link or unlink the currently-selected category and the clicked column
				this.$store.dispatch(dataStoreFunction, dataForStore);

				// 2. Determine if page state should be changed and change it if necessary
				this.changeToNewState();
			},

			tableData() {

				return this.$store.getters.tsvDataTableFormatted;
			}
		}		
	}
</script>

<style scoped>

#category-painting-table {

	margin-bottom: 0;
}

</style>