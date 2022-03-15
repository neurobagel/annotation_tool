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
					:fields="columnLinkingTable.fields"
					:needsRefresh="columnLinkingTable.needsRefresh"
					:selectedCategory="selectedCategory"
					:tableData="dataTable.annotated"
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

			// 1. Try to create the data table for annotation
			this.$store.dispatch("createAnnotatedDataTable");

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
				"dataTable",
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
				for ( let index = 0; index < this.dataTable.annotated.length; index++ ) {
					if ( null != this.dataTable.annotated[index].category )
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

			tableClick(p_clickData) {

				// 1. Style or unstyle table row

				// A. Determine if category-column linking or unlinking has occurred
				let linking = !this.$store.getters.isColumnLinkedToCategory({
					column: p_clickData.column,
					category: this.selectedCategory
				});

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