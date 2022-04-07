<template>

	<b-container fluid>

		<b-row>

			<!-- Category selection table -->
			<b-col cols="4">
				<category-select-table
					:categories="categories"
					:categoryClasses="categoryClasses"
					:instructions="categorySelectText.instructions"
					:title="categorySelectText.title"
					@category-select="setSelectedCategory($event)">
				</category-select-table>
			</b-col>

			<!-- Category to column linking table -->
			<b-col cols="8">
				<column-linking-table
					:categoryClasses="categoryClasses"
					:columnToCategoryMap="columnToCategoryMap"
					:fields="columnLinkingTable.fields"
					:selectedCategory="selectedCategory"
					:tableData="columnToCategoryTable"
					@column-name-selected="tableClick($event)">
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
					{{ buttonText }}
				</b-button>
			</b-col>
			
		</b-row>		

	</b-container>

</template>

<script>

	// Allows for reference to store data by creating simple, implicit getters
	// Fields listed in mapState below can be found in the store (index.js)
	import { mapState } from "vuex";

export default {

  name: "CategorizationPage",

		data() {

			return {

				// Next button text
				buttonText: "Next step: Annotate columns",

				// Instructions for column-category linking
                categorySelectText: {

                    instructions: "Click category and then corresponding column from tsv file",
                    title: "Recommended Categories"
                },

				// Columns for file data table	
				columnLinkingTable: {
					
					fields: [

						{ key: "column" },
						{ key: "description" }
					]
				},

				columnToCategoryTable: [],

				// Category selection (default is index 0, no selection is -1)
				selectedCategory: ""
			}
		},

		computed: {
    		
			...mapState([

				"categories",
				"categoryClasses",
				"columnToCategoryMap",
				"dataTable",
				"dataDictionary",
				"pageData"
    		]),

            nextPageButtonColor() {
            
                // Bootstrap variant color of the button leading to the annotation page
                return this.pageData.annotation.accessible ? "success" : "secondary";
            }
  		},

		mounted() {

            // 1. Set the current page name
            this.$store.dispatch("setCurrentPage", "categorization");

			// 2. Create the data structure for the category to column linking table
			this.setupColumnToCategoryTable();

			// 3. Set selected category to the first category by default
			this.setSelectedCategory({ category: this.categories[0]});

			// 4. Determine if the annotation page is available yet and if so, enable it and perform setup actions
			this.$store.dispatch("enablePage", {

				pageName: "annotation",
				enable: this.countLinkedColumns() > 0
			});
		},		  

		methods: {

			countLinkedColumns() {

				// Count the number of columns that have had categories linked to them
				let links = 0;
				for ( let column in this.columnToCategoryMap ) {
					if ( null != this.columnToCategoryMap[column] )
						links += 1;
				}

				return links;
			},

			setSelectedCategory(p_clickData) {

				// Save the name of the selected category
				this.selectedCategory = p_clickData.category;
			},

			setupColumnToCategoryTable() {

				// 0. Check that there is at least a data table and data dictionary in the data store
				if ( null == this.dataTable.original )
					return;

				// 1. Produce an array of dicts
				this.columnToCategoryTable = [];

				// A. Each dict has a header entry from the data table file
				let headerFields = [];
				for ( let headerField in this.dataTable.original[0] ) {

					// I. Save the header field in a list
					headerFields.push(headerField);

					// II. Save a new dict for this column and description
					this.columnToCategoryTable.push({

						"category": null,
						"column": headerField,
						"description": ""
					});
				}

				// 2. Add in descriptions if a data dictionary has been supplied
				if ( null != this.dataDictionary.original ) {

					// A. and a corresponding "description" column that is (possibly) sourced from the json file
					for ( let column in this.dataDictionary.original ) {

						// I. Save a lowercase version of the current json key
						let columnLowercase = column.toLowerCase();

						// II. Try to match the json key with one in the tsv file
						if ( headerFields.includes(columnLowercase) ) {

							for ( let index = 0; index < this.columnToCategoryTable.length; index++ ) {

								// NOTE: Advanced column name matching here between tsv and json? J. Armoza 01/26/22
								if ( columnLowercase == this.columnToCategoryTable[index].column.toLowerCase() ) {

									// a. Determine the description string for this json file column entry
									let descriptionStr = "";
									for ( let subkey in this.dataDictionary.original[column] ) {

										if ( "description" == subkey.toLowerCase() ) {
											descriptionStr = this.dataDictionary.original[column][subkey];
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

				// 2. If at least one column has been categorized,
				// and if so enable the annotation page and perform setup actions
				this.$store.dispatch("enablePage", {

					pageName: "annotation",
					enable: this.countLinkedColumns() > 0
				});
			}
		}		
	};

</script>
