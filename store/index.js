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

		// File type of the original data table file
		fileType: "",

		 // Participants.tsv file data
    	// For format see 'convertTsvLinesToDict' in index.js
		original: null,

		// Stores table data in format ready for Bootstrap table
    	// This is an array of objects. See the mutation
		// 'setupAnnotatedDataTable' for exact format
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

    // Hardcoded list of categories used on the categorization page
    // and possibly elsewhere in the tool
    categories: [

        "Subject ID",
        "Age",
        "Sex",
        "Diagnosis",
        "Assessment Tool"
    ],
	
	// This is a computed direct map between current categories and CSS classes
	// See getter 'categoryClasses'
	categoryClasses: null,

	// The following fields are only accessed by store methods

    // Maps our categories in 'categories' to colors in 'toolColorPalette'
    // (Final class names pending). This way colors can be swappable and
    // rearrangeable for categories.
    categoryToColorMap: {

        "0": "color1",
        "1": "color2",
        "2": "color3",
        "3": "color4",
        "4": "color5",
		"-1": "colorDefault"
    },

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
		
			if ( null != p_newFileData.data ) 
				p_newFileData.formattedData = convertTsvLinesToDict(p_newFileData.data);
		}

		// 2. Save either an empty array or array of tsv dictionaries to state data
		p_context.commit("setDataTable", p_newFileData);
	},

	// Categorization page actions

	createAnnotatedDataTable(p_context) {

		p_context.commit("setupAnnotatedDataTable");
	},

	linkColumnWithCategory(p_context, p_linkingData) {

		// Commit the new data to the store
		p_context.commit("addColumnCategorization", {

			column: p_linkingData.column,
			category: p_linkingData.category
		});
	},

	unlinkColumnWithCategory(p_context, p_linkingData) {

		p_context.commit("removeColumnCategorization", p_linkingData.column);
	}	
}

// Mutations - Change state data, as called by Actions
export const mutations = {

	// Tool navigation

	setPageNavigation(p_state, p_navData) {

		// Enable or disable access to this page
		p_state.pageData[p_navData.pageName].accessible = p_navData.enable;
	},

	// Landing page mutations

	setDataTable(p_state, p_newFileData) {

		// 1. Save the new tsv row dictionary list to state data
		p_state.dataTable.original = p_newFileData.formattedData;

		// 2. Save the file type of the new data table
		p_state.dataTable.fileType = p_newFileData.fileType;
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
		let dataTable = p_state.dataTable.annotated;
		for ( let index = 0; index < dataTable.length; index++ ) {
			if ( dataTable[index].column == p_data.column ) {
				dataTable[index].category = p_data.category;
				break;
			}
		}
	},

	setupAnnotatedDataTable(p_state) {

		// 0. Do not recreate the annotated table if already setup
		if ( null !== p_state.dataTable.annotated )
			return;

		// 0. Check that there is a data table and data dictionary in the data store
		let dataTable = p_state.dataTable.original;
		let dataDictionary = p_state.dataDictionary.original;
		if ( null == dataTable && null == dataDictionary )
			return;

		// Uses both data table and data dictionary
		if ( null != dataDictionary && null != dataTable ) {

			// 1. Produce an array of dicts
			p_state.dataTable.annotated = [];

			// A. Each dict has a header entry from the data table file
			let headerFields = [];
			let tsvJsonIndex = 0;
			let tsvJsonIndexMap = {};
			for ( let headerField in dataTable[0] ) {

				// I. Save the header field in a list
				headerFields.push(headerField);

				// II. Save an index map for quick location of column and description
				tsvJsonIndexMap.headerField = tsvJsonIndex;
				tsvJsonIndex += 1;

				// III. Save a new dict for this column and description
				p_state.dataTable.annotated.push({

					"category": null,
					"column": headerField,
					"description": ""
				});
			}

			// B. and a corresponding "description" column that is (possibly) sourced from the json file
			for ( let column in dataDictionary ) {

				// I. Save a lowercase version of the current json key
				let columnLowercase = column.toLowerCase();

				// II. Try to match the json key with one in the tsv file
				if ( headerFields.includes(columnLowercase) ) {

					for ( let index = 0; index < p_state.dataTable.annotated.length; index++ ) {

						// NOTE: Advanced column name matching here between tsv and json? J. Armoza 01/26/22
						if ( columnLowercase == p_state.dataTable.annotated[index].column.toLowerCase() ) {

							// a. Determine the description string for this json file column entry
							let descriptionStr = "";
							for ( let subkey in dataDictionary[column] ) {

								if ( "description" == subkey.toLowerCase() ) {
									descriptionStr = dataDictionary[column][subkey];
									break;
								}
							}	
						
							// b. Save the description from the json file colum entry
							p_state.dataTable.annotated[index].description = descriptionStr;
						}
					}
				}
			}
		}
		// Uses just data table data
		else {

			// 1. Produce an array of dicts
			p_state.dataTable.annotated = [];

			// A. Each dict has a header entry from the data table file
			for ( let headerField in dataTable[0] ) {

				// I. Save a new dict for this column and description
				p_state.dataTable.annotated.push({

					"category": null,
					"column": headerField,
					"description": ""
				});
			}
		}
	},

	removeColumnCategorization(p_state, p_columnName) {

		// Disassociate the column with the category in the annotated table
		let dataTable = p_state.dataTable.annotated;
		for ( let index = 0; index < dataTable.length; index++ ) {
			if ( dataTable[index].column == p_columnName ) {
				dataTable[index].category = null;
				break;
			}
		}
	}
}

// Getters - Give access to state data
export const getters = {

	categories(p_state) {

		return p_state.categories;
	},

	categoryClasses(p_state) {

		// NOTE: categoryClasses should be computed when an annotation type
		// is selected by future feature implementation on landing/instruction page

		// 1. Create a map between category names and color classes
		let mapArray = [];
		for ( let index = 0; index < p_state.categories.length; index++ ) {

			const category = p_state.categories[index];
			const colorID = p_state.categoryToColorMap[index.toString()];
			const colorClass = p_state.toolColorPalette[colorID];
			
			mapArray.push([category, colorClass]);
		}

		// 2. Return the new object
		return Object.fromEntries(mapArray);
	},

	isColumnLinkedToCategory: (p_state) => (p_matchData) => {

		// Check to see if the given column has been linked to the given category
		let dataTable = p_state.dataTable.annotated;
		let hasLink = false;
		for ( let index = 0; index < dataTable.length; index++ ) {
			if ( p_matchData.column == dataTable[index].column ) {
				hasLink = ( p_matchData.category == dataTable[index].category );
				break;
			}
		}

		return hasLink;
	},

	isDataDictionaryLoaded(p_state) {

		return ( null != p_state.dataDictionary.original );
	},

	isDataTableLoaded(p_state) {

		return ( null != p_state.dataTable.original );
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
