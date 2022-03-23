// Root state - Stores state data
export const state = () => ({

	// Page-related data

	pageData: {

        home: {
            
            accessible: true,
            fullName: "Home",
            location: "/",
            pageName: "index",
        },

        categorization: {
            
            accessible: false,
            fullName: "Categorization",
            location: "categorization",
            pageName: "categorization"
        },

        annotation: {
            
            accessible: false,
            fullName: "Annotation",
            location: "annotation",
            pageName: "annotation"
        },

        download: {
            
            accessible: false,
            fullName: "Download",
            location: "download",
            pageName: "download"
        }
    },

	pageOrder: [

		"home",
		"categorization",
		"annotation",
		"download"
	],

    // Data table (i.e. participants.tsv file)

	dataTable: {

		// List of data table's columns
		columns: [],

		// File type of the original data table file
		fileType: "",

		// Participants.tsv file data
    	// For format see 'convertTsvLinesToDict' in index.js
		original: null,

		// Version of table data for annotation page 
		annotated: null
	},

    // Data dictionary (i.e. participants.json)

	dataDictionary: {

		// File type of the original data dictionary file
		fileType: "",		

		// Original data dictionary file data
		original: null,

		// User-amended data dictionary file data
		amended: {},	
	},

	// Stores table data in format ready for Bootstrap table
	// This is an array of objects. See the mutation
	// 'setupColumnToCategoryTable' for exact format
	columnToCategoryMap: {

	},

    // Hardcoded list of categories used on the categorization page
    // and possibly elsewhere in the tool
    categories: [],
	
	// This is a computed direct map between current categories and CSS classes
	// See getter 'categoryClasses'
	categoryClasses: null,

	// The following fields are only accessed by store methods

    // Maps our categories in 'categories' to colors in 'toolColorPalette'
    // (Final class names pending). This way colors can be swappable and
    // rearrangeable for categories.
    categoryToColorMap: {},

    // Map of the tools colors to CSS classes containing color (and possibly
    // other style) values. More palettes could be defined here, either out of
    // user preference or if we ever decided to code a light/dark mode feature
    toolColorPalette: {

        color1: "category-style-0",
        color2: "category-style-1",
        color3: "category-style-2",
        color4: "category-style-3",
        color5: "category-style-4",
		colorDefault: "category-style-default"
    }
})
  
// Actions - Call mutations to change state data in order to maintain trace of 
// what component changed state data and when
export const actions = {

	// Initializations

	createColumnToCategoryMap(p_context) {

		p_context.commit("setupColumnToCategoryMap");
	},

	initializeCategories(p_context, p_categories) {

		p_context.commit("setupCategories", p_categories);
	},

	nuxtServerInit({ commit }) {

		// This function is called on Nuxt server startup
		
		// 0. This list is default but we can swap out and reinitialize category
		// data structures by calling store action 'initializeCategories' with
		// a new list of categories
		let categories = [

			"Subject ID",
        	"Age",
        	"Sex",
        	"Diagnosis",
        	"Assessment Tool"
		];

		// 1. Setup category-related data structures based on the given categories
		commit("setupCategories", categories);
	},

	// Tool navigation
	
	enablePageNavigation(p_context, p_navData) {

		p_context.commit("setPageNavigation", p_navData);
	},

	// Landing page actions
	
	saveDataDictionary(p_context, p_newFileData) {

		// 1. Attempt to transform the string data into JSON if valid data given
		if ( "json" == p_newFileData.fileType ) {

			if ( null != p_newFileData.data )
				p_newFileData.formattedData = JSON.parse(p_newFileData.data);
		}

		// 2. Save either an empty object or the JSON dict to state data
		p_context.commit("setDataDictionary", p_newFileData);
	},

	saveDataTable(p_context, p_newFileData) {

		// 1. Attempt to convert the tsv lines into a dict for each line if valid data given
		if ( "tsv"  == p_newFileData.fileType ) {
		
			// 1. Save new table data, formatted for the Vue table element
			if ( null != p_newFileData.data ) 
				p_newFileData.formattedData = convertTsvLinesToDict(p_newFileData.data);

			// 2. Save a list of the columns of this new table data
			if ( p_newFileData.formattedData.length > 0 )
				p_newFileData.columns = Object.keys(p_newFileData.formattedData[0]);
		}

		// 2. Save either an empty array or array of tsv dictionaries to state data
		p_context.commit("setDataTable", p_newFileData);
	},

	// Categorization page actions

	linkColumnWithCategory(p_context, p_linkingData) {

		// Commit the new data to the store
		p_context.commit("addColumnCategorization", {

			column: p_linkingData.column,
			category: p_linkingData.category
		});
	},

	unlinkColumnWithCategory(p_context, p_linkingData) {

		p_context.commit("removeColumnCategorization", p_linkingData.column);
	},

	// Annotation page actions

	saveAnnotatedDataTable(p_context, p_newTable) {

		p_context.commit("setAnnotatedDataTable", p_newTable);
	}
}

// Mutations - Change state data, as called by Actions
export const mutations = {

	// Initialization

	setupCategories(p_state, p_categories) {

		// 1. Save the given category list
		p_state.categories = p_categories;

		// 2. Get color keys from tool color palette
		let colorKeys = Object.keys(p_state.toolColorPalette);
		
		// 3. Create the category to color map
		let assignedCategories = 0;
		for ( let index = 0; index < p_categories.length &&
				index < colorKeys.length; index++ ) {

			// A. Stop when the default color key has been reached
			if ( "colorDefault" === colorKeys[index] )
				break;

			// B. Map this category to color key
			p_state.categoryToColorMap[p_categories[index]] = colorKeys[index];

			// C. Keep track of how many categories have been assigned color keys
			assignedCategories += 1;
		}
		// D. Issue warning if there are not enough color keys for the given category set
		if ( p_categories.length > assignedCategories ) {
			console.log("WARNING: Not all categories have been assigned color keys!");
		}

		// 4. Set up the category to CSS class map

		// A. Create a map between category names and color classes
		let mapArray = [];
		for ( let index = 0; index < p_state.categories.length; index++ ) {

			const category = p_state.categories[index];
			const colorID = p_state.categoryToColorMap[category];
			const colorClass = p_state.toolColorPalette[colorID];
			
			mapArray.push([category, colorClass]);
		}

		// B. Save the new category to class map
		p_state.categoryClasses = Object.fromEntries(mapArray);
	},

	setupColumnToCategoryMap(p_state) {

		// NOTE: Map will be wiped if ever category data structures are re-initialized

		// Only proceed if map is not yet created.
		if ( Object.keys(p_state.columnToCategoryMap).length != 0 )
			return;

		// Column to category map lists all columns as keys with default value of null
		p_state.columnToCategoryMap = 
			Object.fromEntries(p_state.dataTable.columns.map((columnName) => [columnName, null]));
	},

	// Tool navigation

	setPageNavigation(p_state, p_navData) {

		// Enable or disable access to this page
		p_state.pageData[p_navData.pageName].accessible = p_navData.enable;
	},

	// Landing pages

	setDataTable(p_state, p_newFileData) {

		// 1. Save the new tsv row dictionary list to state data
		p_state.dataTable.original = p_newFileData.formattedData;

		// 2. Save the file type of the new data table
		p_state.dataTable.fileType = p_newFileData.fileType;

		// 3. Save a list of the columns of this data table
		p_state.dataTable.columns = p_newFileData.columns;
	},

	setDataDictionary(p_state, p_newFileData) {

		// 1. Save the new data dictionary to state data
		p_state.dataDictionary.original = p_newFileData.formattedData;

		// 2. Save the file type of the new data dictionary
		p_state.dataDictionary.fileType = p_newFileData.fileType;
	},	

	// Categorization page changes

	addColumnCategorization(p_state, p_data) {

		// Save the categorization-column link in the annotated table
		p_state.columnToCategoryMap[p_data.column] = p_data.category;
	},

	removeColumnCategorization(p_state, p_columnName) {

		// Disassociate the column with this category it was linked to
		p_state.columnToCategoryMap[p_columnName] = null;
	},

	// Annotation page changes

	setAnnotatedDataTable(p_state, p_newTable) {

		p_state.dataTable.annotated = p_newTable;
	}
}

// Getters - Give access to state data
export const getters = {

	categories(p_state) {

		return p_state.categories;
	},

	isColumnLinkedToCategory: (p_state) => (p_matchData) => {

		// Check to see if the given column has been linked to the given category
		return ( p_matchData.category === p_state.columnToCategoryMap[p_matchData.column] );
	},

	isDataDictionaryLoaded(p_state) {

		return ( null != p_state.dataDictionary.original );
	},

	isDataTableLoaded(p_state) {

		return ( null != p_state.dataTable.original );
	}
}

// Action helpers
function convertTsvLinesToDict(p_tsvLines){

	// 0. Data structure for table will be stored here
	var tsvRowDictArray = [];

	// 1. First tsv line contains column headers
	let columnHeaders = p_tsvLines[0];

	// 2. Create dictionaries for each tsv row keyed on the column headers 
	for ( let index = 1; index < p_tsvLines.length; index++ ){

		let tsvRowDict = {};

		// A. Loop through the tsv row, matching entries with the tsv column headers
		for ( let index2 = 0; index2 < columnHeaders.length; index2++ ) {

			// Skip blank lines
			if ( "" == p_tsvLines[index] )
				continue;

			// I. Potential warning in case file is malformed.
			// NOTE: Graceful handling of this will be required
			if ( p_tsvLines[index].length != columnHeaders.length ){
				console.log("WARNING: tsv row " + parseInt(index) + " has different size than tsv header.");
				console.log("Row size: " + parseInt(p_tsvLines[index].length));
				console.log("Row: \'" + p_tsvLines[index] + "\'");
				console.log("Header fields: " + columnHeaders.length);
			}

			// II. Save the field for this row, keyed by the current column header
			tsvRowDict[columnHeaders[index2]] = p_tsvLines[index][index2];
		}

		// B. Save the row dictionary
		tsvRowDictArray.push(tsvRowDict);
	}

	return tsvRowDictArray;
}
