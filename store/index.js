// Root state - Stores state data
export const state = () => ({

	pageNames: {
		
		home: {
			fullName: "Home",
			location: "/",
			pageName: "index",
		},

		categorization: {
			fullName: "Categorization",
			location: "categorization",
			pageName: "categorization"
		},

		annotation: {
			fullName: "Annotation",
			location: "annotation",
			pageName: "annotation"
		},

		download: {
			fullName: "Download",
			location: "download",
			pageName: "download"
		}
	},

	pageData: {

		// index.vue
		home: {

			// Participants.tsv file data
			tsvFile: null,

			// Data dictionary file data
			jsonFile: null
		},

		// categorization.vue
		categorization: {

			// Category paint brushes
			current: {
	
				bColor: "white",
				category: "",
				fColor: "black"
			},
			default: {
	
				bColor: "white",
				category: "",
				fColor: "black"			
			},

			// Stores currently painted items
			paintingData: {},

			// Stores currently loaded table data
			tableData: {}
		},

		// annotation.vue
		annotation: {

		},

		// download.vue
		download: {

		}
	},

	painting: {
		
		classes: {

			paint0: "category-style-0",
			paint1: "category-style-1",
			paint2: "category-style-2",
			paint3: "category-style-3",
			paint4: "category-style-4"
		},

		palette: {
			backgroundColors: [],
			foregroundColors: []
		}
	}
})
  
// Actions - Call mutations to change state data in order to maintain trace of 
// what component changed state data and when
export const actions = {

	// Landing page actions

	saveTsvFile(p_context, p_tsvLines) {

		// 1. Attempt to convert the tsv lines into a dict for each line if valid data given
		let newTsvData = [];
		if ( null != p_tsvLines ) 
			newTsvData = convertTsvLinesToDict(p_tsvLines);

		// 2. Save either an empty array or array of tsv dictionaries to state data
		p_context.commit("setTsvFile", newTsvData);
	},
	
	saveJsonFile(p_context, p_jsonStringData) {

		// 1. Attempt to transform the string data into JSON if valid data given
		let newJsonData = {};
		if ( null != p_jsonStringData )
			newJsonData = JSON.parse(p_jsonStringData);

		// 2. Save either an empty object or the JSON dict to state data
		p_context.commit("setJsonFile", newJsonData);

	},
	
	// Categorization page actions

	linkColumnWithCategory(p_context, p_clickData) {

		// 1. Link this column with the current selected category in the data store
		let categorizationInfo = p_context.state.pageData.categorization;

		// 2. Commit the new data to the store
		p_context.commit("addColumnCategorization", {

			bColor: categorizationInfo.current.bColor,
			dataDictionaryColumn: p_clickData.column,
			fColor: categorizationInfo.current.fColor,
			primaryKey: p_clickData["primary-key"],
			tsvCategory: categorizationInfo.current.category
		});
	},

	retrievePalette(p_context) {

		// 0. New color lists
		let backgroundColors = [];
		let foregroundColors = [];

		// 1. Wipe the palette
		p_context.commit("clearPalette");

		// 2. Go through global stylesheets until we find the paintClasses
		for ( let sheetID in document.styleSheets ) {

			for ( let ruleID in document.styleSheets[sheetID].cssRules ) {

				let paintClasses = p_context.state.painting.classes;
				for ( let paintClass in paintClasses ) {

					// A. Make sure the CSS ruleset is an object containing a CSS string with the desired paint class
					if ( typeof (document.styleSheets[sheetID].cssRules[ruleID]) === "object" &&
						 "cssText" in document.styleSheets[sheetID].cssRules[ruleID] &&
						 -1 != document.styleSheets[sheetID].cssRules[ruleID].cssText.indexOf(paintClasses[paintClass]) ) {

						// I. Parse the CSS string for this class into an object
						let cssProperties = parseCssString(
							document.styleSheets[sheetID].cssRules[ruleID].cssText);

						// II. Retrieve the background-color and color from the css object
						let backgroundColor = getCssValue(
							cssProperties,
							"background-color"
						);
						let foregroundColor = getCssValue(
							cssProperties,
							"color"
						);

						// III. Save the background and foreground colors
						backgroundColors.push(backgroundColor);
						foregroundColors.push(foregroundColor);
					}
				}
			}
		}

		// 3. Set the new palette
		p_context.commit("setPalette", {
			backgroundColors: backgroundColors,
			foregroundColors: foregroundColors
		});
	},	

	saveCurrentPaintInfo(p_context, p_paintingInfo) {

		// Save the category and paint color for future table painting on
		// the column categorization page
		p_context.commit("setCurrentPaintInfo", {
			category: p_paintingInfo.category,
			bColor: p_paintingInfo.bColor,
			fColor: p_paintingInfo.fColor
		});
	},

	saveTableData(p_context, p_newTableData) {

		// Store the given table data
		p_context.commit("setNewCategorizationTable", p_newTableData);
	},

	unlinkColumnWithCategory(p_context, p_clickData) {

		p_context.commit("removeColumnCategorization", p_clickData.column);
	}	
}

// Mutations - Change state data, as called by Actions
export const mutations = {

	// General mutations

	clearPalette(p_state) {

		// Wipe the background and foreground color lists of the palette
		p_state.painting.palette.backgroundColors = [];
		p_state.painting.palette.foregroundColors = [];

	},

	setPalette(p_state, p_newPalette) {
		
		// Save the new background and foreground colors of the palette
		p_state.painting.palette = p_newPalette;
	},

	// Landing page mutations

	setTsvFile(p_state, p_tsvRowDictArray) {

		// Save the new tsv row dictionary list to state data
		p_state.pageData.home.tsvFile = p_tsvRowDictArray;
	},

	setJsonFile(p_state, p_jsonData) {

		// Save the new json dictionary to state data
		p_state.pageData.home.jsonFile = p_jsonData;
	},	

	// Categorization page changes

	addColumnCategorization(p_state, p_categorization) {

		// Save the categorization in the store using the column name as a key
		p_state.pageData.categorization.paintingData[p_categorization.dataDictionaryColumn] = {
			tsvCategory: p_categorization.tsvCategory,
			bColor: p_categorization.bColor,
			fColor: p_categorization.fColor,
			primaryKey: p_categorization.primaryKey
		}
	},

	setCurrentPaintInfo(p_state, p_newPaintingInfo) {

		// 1. Save the new paint category
		p_state.pageData.categorization.current.category = p_newPaintingInfo.category;

		// 2. Save the new background and foreground colors
		p_state.pageData.categorization.current.bColor = p_newPaintingInfo.bColor;
		p_state.pageData.categorization.current.fColor = p_newPaintingInfo.fColor;
	},

	setNewCategorizationTable(p_state, p_newTableData) {

		// Store the new table data
		p_state.pageData.categorization.tableData = p_newTableData;
	},

	removeColumnCategorization(p_state, p_columnName) {

		if ( p_columnName in p_state.pageData.categorization.paintingData ) {
			delete p_state.pageData.categorization.paintingData[p_columnName];
		}
	}	
}

// Getters - Give access to state data
export const getters = {

	currentPaintBrush(p_state) {
		return p_state.pageData.categorization.current;
	},

	defaultPaintBrush(p_state) {
		return p_state.pageData.categorization.default;
	},
	
	hasPalette(p_state) {

		return ( p_state.painting.palette.backgroundColors.length > 0 );
	},

	pageNames(p_state) {
		return p_state.pageNames;
	},

	pageData(p_state) {
		return p_state.pageData;
	},

	paintingData(p_state) {
		return p_state.pageData.categorization.paintingData;
	},

	palette(p_state) {
		return p_state.painting.palette;
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

function getCssValue(p_cssObject, p_cssKey) {
				
	// Return the CSS value of the given key if it exists, otherwise blank string
	return ( p_cssKey in p_cssObject ) ? p_cssObject[p_cssKey] : "";
}

function parseCssString(p_cssString) {

	// Produce object based on the CSS string via regular expression parsing
	let regex = /([\w-]*)\s*:\s*([^;]*)/g;
	let match, cssProperties={};
	while ( match = regex.exec(p_cssString) ) {

		cssProperties[match[1]] = match[2].trim();
	}

	return cssProperties;
}
