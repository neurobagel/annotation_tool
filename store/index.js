
// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import Vue from "vue";

// Root state - Stores state data
export const state = () => ({

    // Page-related data

    currentPage: "home",

    pageData: {

        home: {

            accessible: true,
            fullName: "Home",
            location: "/",
            pageName: "index"
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
        // For format see 'convertTsvLinesToTableData' in index.js
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
        amended: {}
    },

    // Stores table data in format ready for Bootstrap table
    // This is an array of objects. See the mutation
    // 'setupColumnToCategoryMap' for exact format
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
    },

    // Annotation page-specific fields

    // The string label applied to values designated as "missing values" when the data are annotated.
    missingValueLabel: "missing value",

    // Keeps track of textual- and component-related information for the annotation of each category
    // See action nuxtServerInit() for initialization code
    annotationDetails: [],

      // Stores a list of (potentially) missing values for each column. This is determined in the missing-values
      // components on the annotation page, and then amended by the user as they see fit
      missingColumnValues: {},

    // Keeps track of named assessment tool groups and their associated tools (e.g. columns in the data table)
    toolGroups: {}
});

// Actions - Call mutations to change state data in order to maintain trace of
// what component changed state data and when
export const actions = {

    // Initializations

    createColumnToCategoryMap(p_context) {

        p_context.commit("setupColumnToCategoryMap");
    },

    initializeAnnotationDetails(p_context, p_details) {

        p_context.commit("setupAnnotationDetails", p_details);
    },

    initializeCategories(p_context, p_categories) {

        p_context.commit("setupCategories", p_categories);
    },

    nuxtServerInit({ commit }) {

        // This function is called on Nuxt server startup

        // 0. This list is default but we can swap out and reinitialize category
        // data structures by calling store action 'initializeCategories' with
        // a new list of categories
        const categories = [

            "Subject ID",
            "Age",
            "Sex",
            "Diagnosis",
            "Assessment Tool"
        ];

        // 0. This annotation information is default but we can swap out and reinitialize
        // annotation data structures by calling 'initializeAnnotationDetails' with a new
        // object containing annotation information for each category
        const annotationDetails = [

            {
                id: 0,
                category: "Age",
                dataType: "continuous",
                explanation: "This is an explanation for how to annotate age.",
                options: {},
                specializedComponent: "annot-age-values"
            },
            {
                id: 1,
                category: "Sex",
                dataType: "categorical",
                explanation: "This is an explanation for how to annotate sex.",
                options: ["male", "female", "other"],
                specializedComponent: "annot-discrete-choices"
            },
            {
                id: 2,
                category: "Diagnosis",
                dataType: "string",
                explanation: "This is an explanation for how to annotate diagnosis.",
                options: { mode: "row" },
                specializedComponent: "annot-vocabulary-row"
            }

            // NOTE: Assessment tools are now only added to annotationDetails when grouped
        ];

        // 1. Setup category-related data structures based on the given categories
        commit("setupCategories", categories);

        // 2. Setup annotation-related data structures based on the given categories\
        commit("setupAnnotationDetails", annotationDetails);
    },

    // Tool navigation

    enablePageNavigation(p_context, p_navData) {

        p_context.commit("setPageNavigationAccess", p_navData);
    },

    initializePage(p_context, p_navData) {

        // 1. Unlock the given page
        p_context.dispatch("enablePageNavigation", p_navData);

        // 2. Perform the setup actions for the given page
        switch ( p_navData.pageName ) {

            case "categorization":

                // Create the new annotated table for categorization now that access is enabled
                p_context.dispatch("createColumnToCategoryMap");
                break;

            case "annotation":
                break;

            case "download":
                break;
        }
    },

    setCurrentPage(p_context, p_pageDataKey) {

        p_context.commit("setCurrentPageNav", p_pageDataKey);
    },

    // Landing page actions

    saveDataDictionary(p_context, p_newFileData) {

        // 1. Attempt to transform the string data into JSON if valid data given
        if ( "json" === p_newFileData.fileType ) {

            if ( null !== p_newFileData.data )
                p_newFileData.formattedData = JSON.parse(p_newFileData.data);
        }

        // 2. Save either an empty object or the JSON dict to state data
        p_context.commit("setDataDictionary", p_newFileData);
    },

    saveDataTable(p_context, p_newFileData) {

        // 1. Attempt to convert the tsv lines into a dict for each line if valid data given
        if ( "tsv"  === p_newFileData.fileType ) {

            // 1. Save new table data, formatted for the Vue table element
            if ( null !== p_newFileData.data )
                p_newFileData.formattedData = convertTsvLinesToTableData(p_newFileData.data);

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

    createToolGroup(p_context, p_toolGroupData) {

        p_context.commit("saveToolGroup", p_toolGroupData);
    },

    modifyToolGroup(p_context, p_toolGroupData) {

        p_context.commit("changeToolGroup", p_toolGroupData);
    },

    removeToolFromGroup(p_context, p_data) {

        p_context.commit("deleteToolFromGroup", p_data);
    },

    removeToolGroup(p_context, p_toolGroupData) {

        p_context.commit("deleteToolGroup", p_toolGroupData);
    },

    unlinkColumnFromCategory(p_context, p_linkingData) {

        p_context.commit("removeColumnCategorization", p_linkingData.column);
    },

    // Annotation page actions

    revertColumnToOriginal(p_context, p_columnName) {

        // NOTE: Reverts a column of annotated data to its original set of values
        // Currently used when a user decouples a column from a category,
        // but could also have use if an 'Undo Annotation' button is implemented
        // on the annotation page.

        // Gather original table column values in row-order
        const originalValues = [];
        for ( let index = 0; index < p_context.state.dataTable.original.length; index++ ){
            originalValues.push(p_context.state.dataTable.original[index][p_columnName]);
        }

        p_context.commit("changeColumnValues", {

            columnName: p_columnName,
            tableToChange: p_context.state.dataTable.annotated,
            newValues: originalValues
        });
    },

    saveAnnotatedDataTable(p_context, p_newTable) {

        p_context.commit("setAnnotatedDataTable", p_newTable);
    },

    saveMissingColumnValues(p_context, p_missingColumnValues) {

        p_context.commit("setMissingColumnValues", p_missingColumnValues);
    }
};

// Mutations - Change state data, as called by Actions
export const mutations = {

    // Initialization

    setupAnnotationDetails(p_state, p_details) {

        p_state.annotationDetails = p_details;
    },

    setupCategories(p_state, p_categories) {

        // 1. Save the given category list
        p_state.categories = p_categories;

        // 2. Get color keys from tool color palette
        const colorKeys = Object.keys(p_state.toolColorPalette);

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
        const mapArray = [];
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
        if ( Object.keys(p_state.columnToCategoryMap).length !== 0 )
            return;

        // Column to category map lists all columns as keys with default value of null
        p_state.columnToCategoryMap =
            Object.fromEntries(p_state.dataTable.columns.map((columnName) => [columnName, null]));
    },

    // Tool navigation

    setPageNavigationAccess(p_state, p_navData) {

        // Enable or disable access to this page
        p_state.pageData[p_navData.pageName].accessible = p_navData.enable;
    },

    setCurrentPageNav(p_state, p_pageDataKey) {

        // Set the current page for the layout navbar
        p_state.currentPage = p_pageDataKey;
    },

    // Landing page

    setDataDictionary(p_state, p_newFileData) {

        // 1. Save the new data dictionary to state data
        p_state.dataDictionary.original = p_newFileData.formattedData;

        // 2. Save the file type of the new data dictionary
        p_state.dataDictionary.fileType = p_newFileData.fileType;
    },

    setDataTable(p_state, p_newFileData) {

        // 1. Save the new tsv row dictionary list to state data
        p_state.dataTable.original = p_newFileData.formattedData;

        // 2. Save the file type of the new data table
        p_state.dataTable.fileType = p_newFileData.fileType;

        // 3. Save a list of the columns of this data table
        p_state.dataTable.columns = p_newFileData.columns;

        // 4. Make the annotated data a copy of the original
        p_state.dataTable.annotated = structuredClone(p_state.dataTable.original);
    },

    // Categorization page

    addColumnCategorization(p_state, p_data) {

        // Save the categorization-column link in the annotated table
        p_state.columnToCategoryMap[p_data.column] = p_data.category;
    },

    changeToolGroup(p_state, p_toolGroupData) {

        // 1. Remove the old group from the tool group object
        Vue.delete(p_state.toolGroups, p_toolGroupData.previousName);

        // 2. Add the new group to the tool group object
        Vue.set(p_state.toolGroups, p_toolGroupData.name, p_toolGroupData.tools);

        // 3. Alter the annotation details to reflect this change
        const detailIndex = p_state.annotationDetails.findIndex(
            detail => p_toolGroupData.previousName === detail.groupName);
        p_state.annotationDetails[detailIndex].groupName = p_toolGroupData.name;
        p_state.annotationDetails[detailIndex].tools = p_toolGroupData.tools;
    },

    deleteToolGroup(p_state, p_toolGroupData) {

        // 1. Remove this tool group from the list
        Vue.delete(p_state.toolGroups, p_toolGroupData.name);

        // 2. Remove the toolgroup from the annotation details
        const groupIndex = p_state.annotationDetails.findIndex(detail =>
            p_toolGroupData.name === detail?.groupName);
        p_state.annotationDetails.splice(groupIndex, 1);
    },

    removeColumnCategorization(p_state, p_columnName) {

        // Disassociate the column with this category it was linked to
        p_state.columnToCategoryMap[p_columnName] = null;
    },

    deleteToolFromGroup(p_state, p_data) {

        // Remove the tool from the given tool group
        p_state.toolGroups[p_data.group].splice(
            p_state.toolGroups[p_data.group].findIndex(element => element === p_data.tool), 1);
    },

    saveToolGroup(p_state, p_toolGroupData) {

        // 1. Save this group to the tool group map
        // p_state.set(p_state.toolGroups, p_toolGroupData.name, p_toolGroupData.tools);
        Vue.set(p_state.toolGroups, p_toolGroupData.name, [...p_toolGroupData.tools]);

        // 2. Add a new assessment tool item to the annotation details list for this tool group
        p_state.annotationDetails.push({

            id: p_state.annotationDetails.length,
            category: "Assessment Tool",
            dataType: "string",
            explanation: "This is an explanation for how to annotate assessments.",
            groupName: p_toolGroupData.name,
            options: { mode: "column" },
            specializedComponent: "annot-vocabulary",
            tools: p_state.toolGroups[p_toolGroupData.name]
        });
    },

    // Annotation page

    changeColumnValues(p_state, p_changeInfo) {

        // Change the values in the given table's column
        for ( let index = 0; index < p_changeInfo.tableToChange.length; index++ ) {
            p_changeInfo.tableToChange[index][p_changeInfo.columnName] = p_changeInfo.newValues[index];
        }
    },

    setAnnotatedDataTable(p_state, p_newTable) {

        p_state.dataTable.annotated = p_newTable;
    },

    setMissingColumnValues(p_state, p_missingColumnValues) {

        // This method merges incoming updated missingColumnValues records with the missingColumnValues
        // object in the store. Because the incoming changes can be incomplete (e.g. only contain updated
        // records of a single column), we cannot just overwrite the store object with them.
        // However, because of how reactivity in Vue works, we can also not simply overwrite the affected columns
        // (i.e. keys) in the object, because that will break reactivity.
        // The below pattern via assign sovles this problem. See here: https://v2.vuejs.org/v2/guide/reactivity.html

        const missingColumnKey = Object.keys(p_missingColumnValues)[0];
        if ( 0 === p_missingColumnValues[missingColumnKey].length ) {
            Vue.delete(p_state.missingColumnValues, missingColumnKey);
        } else {
            p_state.missingColumnValues = Object.assign({}, p_state.missingColumnValues, p_missingColumnValues);
        }
    }
};

// Getters - Give access to state data
export const getters = {

    categories(p_state) {

        return p_state.categories;
    },

    columnDescription: (p_state) => (p_columnName) => {

        // 0. If we do not have a data dictionary then the column description is undefined (e.g. 'null')
        let columnDescription = null;

        // 1. Find the description for this column in the data dictionary
        if ( null !== p_state.dataDictionary.original && Object.keys(p_state.dataDictionary.original).includes(p_columnName) ) {

            // A. Get dictionary's description string for this column
            const dictionaryDescStr = Object.keys(p_state.dataDictionary.original[p_columnName]).find(
                (key) => key.toLowerCase() === "description");

            // B. Get the column description if the description key was found
            if ( dictionaryDescStr ) {
                columnDescription = p_state.dataDictionary.original[p_columnName][dictionaryDescStr];
            }
        }

        return columnDescription;
    },

    getGroupOfTool: (p_state) => (p_tool) => {

        // Look for the group of the given tool
        let toolGroup = null;
        for ( const groupName in p_state.toolGroups ) {
            if ( p_state.toolGroups[groupName].includes(p_tool) ) {
                toolGroup = groupName;
            }
        }

        return toolGroup;
    },

    isColumnLinkedToCategory: (p_state) => (p_matchData) => {

        // Check to see if the given column has been linked to the given category
        return ( p_matchData.category === p_state.columnToCategoryMap[p_matchData.column] );
    },

    isDataAnnotated(p_state) {

        // Check to see if the annotated data table is different from the original data table
        const tablesAreEqual = p_state.dataTable.original.every((originalTableRow, index) => {

            let allValuesEqual = true;
            for ( const column in originalTableRow ) {
                if ( originalTableRow[column] !== p_state.dataTable.annotated[index][column] ) {
                    allValuesEqual = false;
                    break;
                }
            }

            return allValuesEqual;
        });

        // Annotation has not occurred if both tables are equal
        return !tablesAreEqual;
    },

    isDataDictionaryLoaded(p_state) {

        return ( null !== p_state.dataDictionary.original );
    },

    isDataTableLoaded(p_state) {

        return ( null !== p_state.dataTable.original );
    },

    isMissingValue: (p_state) => (p_columnName, p_value) => {

        // Checks if a column-value combination is stored in the missingColumnValues object
        // and returns true if it is, false otherwise
        // if no records are stored for the entire p_columnName, then also returns false

        if ( !Object.keys(p_state.missingColumnValues).includes(p_columnName) ) {

            return false;
        }

        return ( p_state.missingColumnValues[p_columnName].includes(p_value) );
    },

    isToolGrouped: (p_state) => (p_columnName) => {

        let foundTool = false;

        // Look for tool name in the saved tool groups
        for ( const groupName in p_state.toolGroups ) {

            if ( p_state.toolGroups[groupName].includes(p_columnName) ) {
                foundTool = true;
                break;
            }
        }

        return foundTool;
    },

    getMissingValuesColumn: (p_state) => (p_columnName) => {

        // For a given column name returns the array of missing values the state knows about
        // or returns null if no missing values are stored for this column name

        if ( !Object.keys(p_state.missingColumnValues).includes(p_columnName) ) {
            return null;
        } else {
            return p_state.missingColumnValues[p_columnName];
        }
    },


    valueDescription: (p_state) => (p_columnName, p_value) => {

        // 0. If we do not have a data dictionary then the value description is undefined (e.g. "")
        let valueDescription = "";

        // 1. Find the description for this column's value in the data dictionary
        if ( null !== p_state.dataDictionary.original && Object.keys(p_state.dataDictionary.original).includes(p_columnName) ) {

            // A. Get dictionary's levels string for this column
            const dictionaryLevelsStr = Object.keys(p_state.dataDictionary.original[p_columnName]).find((key) => key.toLowerCase() === "levels");

            // B. Attempt to get the value string in this 'levels' object
            if ( dictionaryLevelsStr ) {

                // I. Get the dictionary's value string for this column's value
                const dictionaryValueStr = Object.keys(p_state.dataDictionary.original[p_columnName][dictionaryLevelsStr]).find(
                    (key) => key.toLowerCase() === p_value.toLowerCase());

                // II. Get the value description
                if ( dictionaryValueStr ) {
                    valueDescription = p_state.dataDictionary.original[p_columnName][dictionaryLevelsStr][dictionaryValueStr];
                }
            }
        }

        return valueDescription;
    }
};


// Action helpers
function convertTsvLinesToTableData(p_tsvLines){

    // 0. Data structure for table will be stored here
    const tsvRowDictArray = [];

    // 1. First tsv line contains column headers
    const columnHeaders = p_tsvLines[0];

    // 2. Create dictionaries for each tsv row keyed on the column headers
    for ( let index = 1; index < p_tsvLines.length; index++ ){

        const tsvRowDict = {};

        // A. Loop through the tsv row, matching entries with the tsv column headers
        for ( let index2 = 0; index2 < columnHeaders.length; index2++ ) {

            // Skip blank lines
            if ( "" === p_tsvLines[index].join().trim() )
                continue;

            // I. Potential warning in case file is malformed.
            // NOTE: Graceful handling of this will be required
            if ( p_tsvLines[index].length !== columnHeaders.length ){
                console.log("WARNING: tsv row " + parseInt(index) + " has different size than tsv header.");
                console.log("Row size: " + parseInt(p_tsvLines[index].length));
                console.log("Row: '" + p_tsvLines[index] + "'");
                console.log("Header fields: " + columnHeaders.length);
            }

            // II. Save the field for this row, keyed by the current column header
            tsvRowDict[columnHeaders[index2]] = p_tsvLines[index][index2];
        }

        // B. Save the row dictionary
        // NOTE: Conditional here is to account for the possibility of a blank line
        // among the tsv lines input to this function. We may want to readdress this
        // via the Papa parse file input method or just leave as is
        if ( Object.keys(tsvRowDict).length > 0 ) {
            tsvRowDictArray.push(tsvRowDict);
        }
    }

    return tsvRowDictArray;
}