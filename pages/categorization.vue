<template>

	<b-container fluid>

		<!-- Navigation bar -->
		<tool-navbar 
			:navItems="pageData"
			:navOrder="pageOrder"
			:pageName="pageData.categorization.fullName">
		</tool-navbar>

		<b-row>

			<!-- Category selection table -->
			<b-col cols="4">
				<category-select-table
					:categories="categories"
					:categoryClasses="categoryClasses"
					:instructions="categorySelectText.instructions"
					:title="categorySelectText.title"
					v-on:category-select="setSelectedCategory($event)">
				</category-select-table>
			</b-col>

			<!-- Category to column linking table -->
			<b-col cols="8">
				<column-linking-table
					:categoryClasses="categoryClasses"
					:columnToCategoryMap="columnToCategoryMap"
					:fields="columnLinkingTable.fields"
					:needsRefresh="columnLinkingTable.needsRefresh"
					:selectedCategory="selectedCategory"
					:tableData="columnToCategoryTable"
					v-on:column-name-selected="tableClick($event)"
					v-on:done-redraw="resetTableRefresh()">
				</column-linking-table>
			</b-col>

		</b-row>

		<b-row>
			
			<b-col cols="9"></b-col>
			
			<!-- Button to proceed to the next page -->
			<!-- Only enabled when at least one column has been categorized -->
			<b-col cols="3">
				<b-button
					class="float-right"
					:disabled="!pageData.annotation.accessible"
					:to="'/' + pageData.annotation.location"
					:variant="nextPageButtonColor">
					Next step: Annotate columns
				</b-button>
			</b-col>
			
		</b-row>		

	</b-container>

</template>

<script>

	// Allows for simple reference to getters in the store
	import { mapGetters } from "vuex";

	// Allows for reference to store data by creating simple, implicit getters
	import { mapState } from "vuex";

	export default {

		name: "CategorizationPage",

		mounted() {

			// 1. Create the data structure for the category to column linking table
			this.setupColumnToCategoryTable();

			// 2. Determine page state from data contents and change to that new state
			this.changeToNewState();
		},

		data() {

			return {

                categorySelectText: {

                    instructions: "Click category and then corresponding column from tsv file",
                    title: "Recommended Categories"
                },

				// Columns for file data table	
				columnLinkingTable: {
					
					fields: [

						{ key: "column" },
						{ key: "description" }
					],

					needsRefresh: false
				},

				columnToCategoryTable: [],

				// Bootstrap variant color of the button leading to the categorization page
				nextPageButtonColor: "secondary",

				// Possible states of this page
				possibleStates: {

					STATE_NOCATEGORIES_PAINTED: 0,
					STATE_ATLEASTONE_CATEGORY_PAINTED: 1 << 0
				},

				// Category selection (default is index 0, no selection is -1)
				selectedCategory: this.$store.getters.categories[0]
			}
		},

		computed: {

			...mapGetters([

				"categoryClasses"
			]),
    		
			...mapState([

				"categories",
				"columnToCategoryMap",
				"dataTable",
				"dataDictionary",
				"pageData",
				"pageOrder"
    		])
  		},

		methods: {			

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
				this.columnLinkingTable.needsRefresh = true;

				// Enable access to the annotation page
				this.nextPageAccess(true);
			},

			changeState_NoCategoriesPainted() {

				// 1. Paint the table with previously painted rows documented in the store
				this.columnLinkingTable.needsRefresh = true;
				// this.$refs.table.$forceUpdate();

				// Disable access to the annotation page
				this.nextPageAccess(false);
			},

			changeToNewState() {

				// 1. Determine page state from data contents
				let newState = this.determineState();

				// 2. Change the page to the determined state
				this.changeState(newState);
			},

			countLinkedColumns() {

				// Count the number of columns that have had categories linked to them
				let links = 0;
				for ( let column in this.columnToCategoryMap ) {
					if ( null != this.columnToCategoryMap[column] )
						links += 1;
				}

				return links;
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

			nextPageAccess(p_enable) {
				
				// 1. Enable/disable access to the annotation page on the nav bar

				// A. Enable the nav item
				this.$store.dispatch("enablePageNavigation", { 
					pageName: "annotation",
					enable: p_enable
				});

				// B. Change the next step button's color
				this.nextPageButtonColor = ( p_enable ) ? "success" : "secondary";
			},			

			resetTableRefresh() {

				this.needsRefresh = false;
			},

			setSelectedCategory(p_clickData) {

				// Save the name of the selected category
				this.selectedCategory = p_clickData.category;
			},
			
			setupColumnToCategoryTable() {

				// 0. Check that there is a data table and data dictionary in the data store
				if ( null == this.dataTable.original && null == this.dataDictionary )
					return;

				// Uses both data table and data dictionary
				if ( null != this.dataDictionary && null != this.dataTable.original ) {

					// 1. Produce an array of dicts
					this.columnToCategoryTable = [];

					// A. Each dict has a header entry from the data table file
					let headerFields = [];
					let tsvJsonIndex = 0;
					let tsvJsonIndexMap = {};
					for ( let headerField in this.dataTable.original[0] ) {

						// I. Save the header field in a list
						headerFields.push(headerField);

						// II. Save an index map for quick location of column and description
						tsvJsonIndexMap.headerField = tsvJsonIndex;
						tsvJsonIndex += 1;

						// III. Save a new dict for this column and description
						this.columnToCategoryTable.push({

							"category": null,
							"column": headerField,
							"description": ""
						});
					}

					// B. and a corresponding "description" column that is (possibly) sourced from the json file
					for ( let column in this.dataDictionary ) {

						// I. Save a lowercase version of the current json key
						let columnLowercase = column.toLowerCase();

						// II. Try to match the json key with one in the tsv file
						if ( headerFields.includes(columnLowercase) ) {

							for ( let index = 0; index < this.columnToCategoryTable.length; index++ ) {

								// NOTE: Advanced column name matching here between tsv and json? J. Armoza 01/26/22
								if ( columnLowercase == this.columnToCategoryTable[index].column.toLowerCase() ) {

									// a. Determine the description string for this json file column entry
									let descriptionStr = "";
									for ( let subkey in this.dataDictionary[column] ) {

										if ( "description" == subkey.toLowerCase() ) {
											descriptionStr = this.dataDictionary[column][subkey];
											break;
										}
									}	
								
									// b. Save the description from the json file colum entry
									this.columnToCategoryTable[index].description = descriptionStr;
								}
							}
						}
					}
				}
				// Uses just data table data
				else {

					// 1. Produce an array of dicts
					this.columnToCategoryTable = [];

					// A. Each dict has a header entry from the data table file
					for ( let headerField in this.dataTable.original[0] ) {

						// I. Save a new dict for this column and description
						this.columnToCategoryTable.push({

							"category": null,
							"column": headerField,
							"description": ""
						});
					}
				}
			},

			tableClick(p_clickData) {

				// 1. Style or unstyle table row

				// A. Determine if category-column linking or unlinking has occurred
				let linking = !( this.selectedCategory == this.columnToCategoryMap[p_clickData.column] );

				// B. Record the linking/unlinking in the data store
				let dataStoreFunction = ( linking ) ? "linkColumnWithCategory" : "unlinkColumnWithCategory";

				// I. Build a new object for passing to the store for category-column linking
				let dataForStore = { column: p_clickData["column"] };
				if ( linking ) {
					dataForStore.category = this.selectedCategory;
				}

				// II. Link or unlink the currently-selected category and the clicked column
				this.$store.dispatch(dataStoreFunction, dataForStore);

				// 2. Determine if page state should be changed and change it if necessary
				this.changeToNewState();
			}
		}		
	}
</script>