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
    		
			...mapState([

				"categories",
				"categoryClasses",
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

    columnToCategoryTable() {
      // 0. Check that there is a data table and data dictionary in the data store
      if (null == this.dataTable.original && null === this.dataDictionary.original )
        return

      // Take the first row ot the datatable to extract the column names
      let columnTable = Object.keys(this.dataTable.original[0]).map(columnName => ({
        "column": columnName,
        "description": ""
      }))

      // If a data dictionary was provided, try to use it to add descriptions for each row
      if (this.dataDictionary.original !== null) {

        columnTable = columnTable.map(row => {

          let description = ""
          for (const dictColumn of Object.keys(this.dataDictionary.original)) {

            // We don't know if the columns are the same case inside the data dictionary so we match case insensitive
            if ( dictColumn.toLowerCase() === row.column.toLowerCase() ) {

              const columnDict = this.dataDictionary.original[dictColumn]
              // We assign the description with case insensitive keys if it exists, otherwise this will be "undefined"
              description = columnDict[Object.keys(columnDict).find(key => key.toLowerCase() === "description")]
              break
            }
          }

          return ({
            "column": row.column,
            "description": description !== undefined ? description : "" // make sure we are not passing undefined here
          })
        })
      }
      return columnTable
    },
  },
  methods: {

          })
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