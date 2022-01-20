// Root state - Stores state data
export const state = () => ({

	// index.vue data
	tsvFile: [],
	jsonFile: {},

	// column-annotation.vue data
	currentPaintColor: "white"
})
  
// Actions - Call mutations to change state data in order to maintain trace of 
// what component changed state data and when
export const actions = {
	
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
	}	
}

// Mutations - Change state data, as called by Actions
export const mutations = {

	setTsvFile(p_state, p_tsvRowDictArray) {

		// 3. Save the new tsv row dictionary list to state data
		p_state.tsvFile = p_tsvRowDictArray;
	}
}

// Getters - Give access to state data
export const getters = {

	tsvFile(p_state) {
		return state.tsvFile;
	},

	jsonFile(p_state) {
		return state.jsonFile;
	}
}

// Action helpers
function convertTsvLinesToDict(p_tsvLines){

	// 1. Get column header values
	let headerFields = p_tsvLines[0];

	// 2. Create a dictionary based on the header values for each row
	let rowDict = null;
	let tsvFields = null;
	var tsvRowDictArray = [];
	for ( let index = 1; index < p_tsvLines.length; index++ ) {

		// A. Split the tsv line into its fields
		tsvFields = p_tsvLines[index];

		// B. Fill out a new dictionary for each row
		rowDict = {};
		for ( let headerIndex = 0; headerIndex < headerFields.length; headerIndex++ ) {
			rowDict[headerFields[headerIndex]] = tsvFields[headerIndex];
		}

		// C. Save the row dictionary to the tsv file line collection
		tsvRowDictArray.push(rowDict);
	}

	return tsvRowDictArray;
}