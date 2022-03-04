// Root state - Stores state data
export const state = () => ({

	// Page-related data

	pageData: {

        home: {
            
            accessibility: true,
            fullName: "Home",
            location: "/",
            pageName: "index",
        },

        categorization: {
            
            accessibility: false,
            fullName: "Categorization",
            location: "categorization",
            pageName: "categorization"
        },

        annotation: {
            
            accessibility: false,
            fullName: "Annotation",
            location: "annotation",
            pageName: "annotation"
        },

        download: {
            
            accessibility: false,
            fullName: "Download",
            location: "download",
            pageName: "download"
        }
    },

    // TSV file

    // Participants.tsv file data
    // For format see 'convertTsvLinesToDict' in index.js
    tsvDataOriginal: null,

    // Stores table data in format ready for Bootstrap table
    // This is an array of objects. See 'tableDataFromTsvAndOrJson' in
    // categorization.vue for exact format
    tsvDataTableFormatted: [],

    // Data dictionary

    // Original data dictionary file data
    // (formerly home.jsonFile)
    dataDictionaryOriginal: null,

    // User-amended data dictionary file data
    dataDictionaryAmended: {},	

    // Hardcoded list of categories used on the categorization page
    // and possibly elsewhere in the tool
    // formerly (categorization page's recommendedCategories)
    categoryList: [

        "Subject ID",
        "Age",
        "Sex",
        "Diagnosis",
        "Assessment Tool"
    ],	

    // Mapping showing user-applied mappings between our categories
    // and the columns in their tsv/data dictionary file(s)
    // Keyed on column. If a column is not a key, it has not yet been linked to
    // a category by the user
    // (formerly categorization.paintingData)
    categoryColumnMap: {},

    // Maps our categories in 'categoryList' to colors in 'toolColorPalette'
    // (Final class names pending). This way colors can be swappable and
    // rearrangeable for categories
    categoryToColorMap: {

        "0": "color1",
        "1": "color2",
        "2": "color3",
        "3": "color4",
        "4": "color5",
		"-1": "colorDefault"
    },

	cssStylePrefix: "category-style-",

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

	// Landing page actions
	
	saveJsonFile(p_context, p_jsonStringData) {

		// 1. Attempt to transform the string data into JSON if valid data given
		let newJsonData = {};
		if ( null != p_jsonStringData )
			newJsonData = JSON.parse(p_jsonStringData);

		// 2. Save either an empty object or the JSON dict to state data
		p_context.commit("setJsonFile", newJsonData);

	},

	saveTsvFile(p_context, p_tsvLines) {

		// 1. Attempt to convert the tsv lines into a dict for each line if valid data given
		let newTsvData = [];
		if ( null != p_tsvLines ) 
			newTsvData = convertTsvLinesToDict(p_tsvLines);

		// 2. Save either an empty array or array of tsv dictionaries to state data
		p_context.commit("setTsvFile", newTsvData);
	},

	
	// Categorization page actions

	linkColumnWithCategory(p_context, p_linkingData) {

		// Commit the new data to the store
		p_context.commit("addColumnCategorization", {

			dataDictionaryColumn: p_linkingData.column,
			primaryKey: p_linkingData.primaryKey,
			tsvCategory: p_linkingData.tsvCategory
		});
	},	

	saveTableData(p_context, p_newTableData) {

		// Store the given table data
		p_context.commit("setNewCategorizationTable", p_newTableData);
	},

	unlinkColumnWithCategory(p_context, p_linkingData) {

		p_context.commit("removeColumnCategorization", p_linkingData.column);
	}	
}

// Mutations - Change state data, as called by Actions
export const mutations = {

	// Landing page mutations

	setTsvFile(p_state, p_tsvRowDictArray) {

		// Save the new tsv row dictionary list to state data
		p_state.tsvDataOriginal = p_tsvRowDictArray;
	},

	setJsonFile(p_state, p_jsonData) {

		// Save the new json dictionary to state data
		p_state.dataDictionaryOriginal = p_jsonData;
	},	

	// Categorization page changes

	addColumnCategorization(p_state, p_data) {

		// Save the categorization in the store using the column name as a key
		p_state.categoryColumnMap[p_data.dataDictionaryColumn] = {

			primaryKey: p_data.primaryKey,
			tsvCategory: p_data.tsvCategory,
		}
	},

	removeColumnCategorization(p_state, p_columnName) {

		if ( p_columnName in p_state.categoryColumnMap ) {
			
			delete p_state.categoryColumnMap[p_columnName];
		}
	},	

	setNewCategorizationTable(p_state, p_newTableData) {

		// Store the new table data
		p_state.tsvDataTableFormatted = p_newTableData;
	}
}

// Getters - Give access to state data
export const getters = {

	categories(p_state) {

		return p_state.categoryList;
	},

	categoryColumnMap(p_state) {

		return p_state.categoryColumnMap;
	},

	categoryToColorMap(p_state) {
		
		return p_state.categoryToColorMap;
	},

	cssStylePrefix(p_state) {
		
		return p_state.cssStylePrefix;
	},

	getStyleClass(p_state) {

		return p_state.toolColorPalette;
	},

	pageData(p_state) {

		return p_state.pageData;
	},	

	tsvDataOriginal(p_state) {
		
		return p_state.tsvDataOriginal;
	},

	tsvDataTableFormatted(p_state) {

		return p_state.tsvDataTableFormatted;
	}
}

function printArray(p_array, p_arrayName, p_stringify=false) {

	for ( let index = 0; index < p_array.length; index++ ) {
		console.log(p_arrayName + "[" + parseInt(index) + "]: " + ((p_stringify) ? JSON.stringify(p_array[index]): p_array[index]));
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

		let tsvRowDict = {}

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
