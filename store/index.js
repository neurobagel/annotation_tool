// Root state - Stores state data
export const state = () => ({

	// index.vue data
	tsvFile: [],
	jsonFile: {},

	// column-categorization.vue data
	columnCategorization: {

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
		dataSet: {}
	}
})
  
// Actions - Call mutations to change state data in order to maintain trace of 
// what component changed state data and when
export const actions = { 

	linkColumnWithCategory(p_context, p_columnName) {

		// 1. Link this column with the current selected category in the data store
		let categorizationInfo = p_context.state.columnCategorization;
		p_context.commit("addColumnCategorization", {

			tsvCategory: categorizationInfo.current.category,
			sidecarColumn: p_columnName,
			bColor: categorizationInfo.current.bColor,
			fColor: categorizationInfo.current.fColor
		});
	},
	
	saveTsvFile(p_context, p_tsvLines) {
	
		// 0. Check for tsv data validity here
		if ( !p_tsvLines || 0 == p_tsvLines.length ) {
			alert("Invalid tsv file data!");
			return;
		}	

		// 1. Convert the tsv lines into a dict for each line
		var tsvRowDictArray = convertTsvLinesToDict(p_tsvLines);

		// 2. Save the tsv dict to state data
		p_context.commit("setTsvFile", tsvRowDictArray);
	},
	
	saveJsonFile(p_context, p_jsonStringData) {

		// 0. Check for json data validity here
		if ( !p_jsonStringData || 0 == Object.keys(p_jsonStringData).length ) {
			alert("Invalid json file data!");
			return;
		}

		// Transform the string data into JSON
		let jsonObj = JSON.parse(p_jsonStringData);

		// 1. Save the json dict to state data
		p_context.commit("setJsonFile", jsonObj);

	},

	saveCurrentPaintInfo(p_context, p_paintingInfo) {

		// 1. Save the category and paint color for future table painting on
		// the column categorization page
		p_context.commit("setCurrentPaintInfo", {
			category: p_paintingInfo.category,
			bColor: p_paintingInfo.bColor,
			fColor: p_paintingInfo.fColor
		});
	}
}

// Mutations - Change state data, as called by Actions
export const mutations = {

	addColumnCategorization(p_state, p_categorization) {

		// Save the categorization in the store using the column name as a key
		p_state.columnCategorization.dataSet[p_categorization.sidecarColumn] = {
			tsvCategory: p_categorization.tsvCategory,
			bColor: p_categorization.bColor,
			fColor: p_categorization.fColor
		}
	},

	setTsvFile(p_state, p_tsvRowDictArray) {

		// 1. Save the new tsv row dictionary list to state data
		p_state.tsvFile = p_tsvRowDictArray;
	},

	setJsonFile(p_state, p_jsonData) {

		// 1. Save the new json dictionary to state data
		p_state.jsonFile = p_jsonData;
	},

	setCurrentPaintInfo(p_state, p_newPaintingInfo) {

		// 1. Save the new paint category
		p_state.columnCategorization.current.category = p_newPaintingInfo.category;

		// 2. Save the new background and foreground colors
		p_state.columnCategorization.current.bColor = p_newPaintingInfo.bColor;
		p_state.columnCategorization.current.fColor = p_newPaintingInfo.fColor;
	}
}

// Getters - Give access to state data
export const getters = {

	tsvFile(p_state) {
		return state.tsvFile;
	},

	jsonFile(p_state) {
		return state.jsonFile;
	},

	currentPainting(p_state) {
		return state.painting.current;
	},

	columnCanvas(p_state) {

		return state.painting.columnCanvas;
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

			// I. Potential warning in case file is malformed.
			// NOTE: Graceful handling of this will be required
			if ( p_tsvLines[index].length != columnHeaders.length ){
				console.log("WARNING: tsv row " + parseInt(index) + " has different size than tsv header.");
			}

			// II. Save the field for this row, keyed by the current column header
			tsvRowDict[columnHeaders[index2]] = p_tsvLines[index][index2];
		}

		// B. Save the row dictionary
		tsvRowDictArray.push(tsvRowDict);
	}

	return tsvRowDictArray;
}