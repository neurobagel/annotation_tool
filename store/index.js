// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import Vue from "vue";

export const state = () => ({

    categories: {

        "Subject ID": {

        },
        "Age": {

        },
        "Sex": {

        },
        "Diagnosis": {

        }
    },

    colorInfo: {

        colorPalette: {

            color1: "category-style-1",
            color2: "category-style-2",
            color3: "category-style-3",
            color4: "category-style-4",
            color5: "category-style-5",
            colorDefault: "category-style-default"
        },

        categoryToColorMap: {

        },

        categoryClasses: {

        }
    },

    columnToCategoryMap: {},

    currentPage: "home",

    dataDictionary: {

        // Stores the data dictionary loaded by the user (if available) in userProvided
        // and stores the extended version created during annotation in annotated.
        // We use this both as a state object and as the template for the downloadable data dictionary
        userProvided: {},
        annotated: {}
    },

    dataTable: [],

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
    }
});

export const getters = {

    getCategoryNames(p_state) {

        return Object.keys(p_state.categories);
    },

    getColumnDescription: (p_state) => (p_columnName) => {

        if ( Object.hasOwn(p_state.dataDictionary.annotated[p_columnName], "description") ) {

            return p_state.dataDictionary.annotated[p_columnName].description;
        }
        else {

            return "";
        }
    },

    getColumnNames(p_state) {

        return ( 0 === p_state.dataTable.length) ? [] : Object.keys(p_state.dataTable[0]);
    },

    getNextPage(p_state) {

        let nextPage = "";

        switch ( p_state.currentPage ) {

            case "home":
                nextPage = "categorization";
                break;
            case "categorization":
                nextPage = "annotation";
                break;
            case "annotation":
                nextPage = "download";
                break;
        }

        return nextPage;
    },

    getValueDescription: (p_state) => (p_columnName, p_value) => {

        // Returns the description of a value in a column, if that description exists
        // Otherwise it returns an empty string
        const description = p_state.dataDictionary.annotated[p_columnName].levels?.[p_value]?.description;
        if ( typeof description  === "undefined" ) {
            return "";
        }

        return description;
    },

    isPageAccessible: (p_state) => (p_pageName) => {

        let pageAccessible = false;

        switch ( p_pageName ) {

            case "home":

                // Landing page is always accessible
                pageAccessible = true;
                break;

            case "categorization":

                // Categorization page is accessible if a data table has been uploaded
                pageAccessible = p_state.dataTable.length > 0;

                break;

            case "annotation": {

                // 1. Determine if at least one column has been linked to a category
                const categorizationStatus = Object.values(p_state.columnToCategoryMap)
                                                   .some(category =>  null !== category );

                // 2. Make sure one (and only one) column has been categorized as 'Subject ID'
                const singleSubjectIDColumn = ( 1 === Object.values(p_state.columnToCategoryMap)
                                                            .filter(category => "Subject ID" === category)
                                                            .length );

                // Annotation page is only accessible if at least one column has
                // been categorized and if one (and only one) column has been categorized as 'Subject ID'
                pageAccessible = categorizationStatus && singleSubjectIDColumn;

                break;
            }

            case "download":

                pageAccessible = p_state.annotationCount > 0;

                break;
        }

        return pageAccessible;
    }
};


export const actions = {

    nuxtServerInit({ commit }) {

        commit("setupCategoryColorMaps");
    },

    processDataDictionary( { state, commit, getters }, p_payload) {

        commit("setDataDictionary", {

            newDataDictionary: JSON.parse(p_payload.data),
            columnNames: getters.getColumnNames
        });
    },

    processDataTable( { state, commit, getters }, { data, filename }) {

        // This action is dispatched when a new dataTable is loaded by the user.
        // This indicates to us that the user wants to reset the app and begin a new
        // annotation procedure from scratch. The needed steps are handled by this action.

        commit("setDataTable", data);
        commit("initializeColumnToCategoryMap", getters.getColumnNames);
        commit("initializeDataDictionary");
    },

    updatePageDataAccessibility({ state, commit, getters }) {

        for ( const pageName in state.pageData ) {

            commit("setPageAccessible", {

                pageName: pageName,
                accessible: getters.isPageAccessible(pageName)
            });
        }
    }
};

export const mutations = {

    /**
     * Change the mapping between a column and a category
     * If the two are already mapped, the column should be unlinked
     * Otherwise the column is mapped to a different category
     *
     * @param {string} targetCategory Category the column should be mapped to
     * @param {string} columnName Column that will be mapped to the category
     */
    alterColumnCategoryMap(p_state, p_payload) {

        p_state.columnToCategoryMap[p_payload.column] = ( p_payload.category === p_state.columnToCategoryMap[p_payload.column] ) ? null : p_payload.category;
    },

    initializeColumnToCategoryMap(p_state, p_columns) {

        // Column to category map lists all columns as keys with default value of null
        p_state.columnToCategoryMap =
            Object.fromEntries(p_columns.map((column) => [column, null]));
    },

    initializeDataDictionary(p_state) {

        // 0. Wipe the current provided data dictionary
        p_state.dataDictionary.userProvided = {};

        // 1. Create a skeleton data dictionary based on the data table's columns
        for ( const columnName of Object.keys(p_state.dataTable[0]) ) {

            p_state.dataDictionary.userProvided[columnName] = { "Description": "" };
        }

        // 2. Make a copy of the newly provided skeleton dictionary for annotation
        p_state.dataDictionary.annotated = JSON.parse(JSON.stringify(p_state.dataDictionary.userProvided));
    },

    setCurrentPage(p_state, p_pageName) {

        p_state.currentPage = p_pageName;
    },

    setDataDictionary(p_state, p_payload) {

        let p_newDataDictionary = p_payload.newDataDictionary;
        let p_storeColumns = p_payload.columnNames;

        // 1. Update values to existing columns in the data dictionary, but ignore any new columns
        for ( const column of p_storeColumns ) {

            // A. Provided data dictionary is updated with new keys/values
            p_state.dataDictionary.userProvided[column] =
                Object.assign(p_state.dataDictionary.userProvided[column],
                              p_newDataDictionary[column]);

            // B. Annotated data dictionary is similarly update with new keys/values,
            // but ensuring no annotations are removed (unless bashed by the new data dictionary)
            p_state.dataDictionary.annotated[column] =
                Object.assign(p_state.dataDictionary.annotated[column],
                              p_newDataDictionary[column]);
        }
    },

    setDataTable(p_state, p_inputTable) {

        // 0. Get column names from the input file data
        const columnNames = p_inputTable[0];

        // 1. Reformat the table data into an array of objects
        const transformedTable = [];
        for ( let rowIndex = 1; rowIndex < p_inputTable.length; rowIndex++ ) {

            // A. If the row is empty, we don't want it in our dataTable
            if ( "" === p_inputTable[rowIndex].join("").trim() ) {
                continue;
            } else if ( p_inputTable[rowIndex].length < columnNames.length ) {
                console.warn(`WARNING: tsv row ${rowIndex} has fewer columns than the tsv header!`);
            }

            // B. Create a list of row values, each in a tuple with their associated column name
            let rowArray = [];
            for ( let colIndex = 0; colIndex < p_inputTable[rowIndex].length; colIndex++ ) {

                // Rows that are longer than the header should be truncated
                if ( colIndex >= columnNames.length ) {

                    console.warn(`WARNING: tsv row " + ${rowIndex} + " has more columns than the tsv header!`);
                    continue;
                }

                rowArray.push([columnNames[colIndex], p_inputTable[rowIndex][colIndex]]);
            }

            // C. Save the reformatted row
            transformedTable.push(Object.fromEntries(rowArray));
        }

        // 2. Save a reference to the newly created data table in the store
        p_state.dataTable = transformedTable;
    },

    setPageAccessible(p_state, p_payload) {

        p_state.pageData[p_payload.pageName].accessible = p_payload.accessible;
    },

    setupCategoryColorMaps(p_state) {

        // 0. Create a simple list of the categories
        const categories = Object.keys(p_state.categories);

        // 1. Get color keys from tool color palette
        const colorKeys = Object.keys(p_state.colorInfo.colorPalette);

        // 2. Create the category to color map
        let assignedCategories = 0;
        for ( let index = 0; index < categories.length && index < colorKeys.length; index++ ) {

            // A. Stop when the default color key has been reached
            if ( "colorDefault" === colorKeys[index] )
                break;

            // B. Map this category to color key
            p_state.colorInfo.categoryToColorMap[categories[index]] = colorKeys[index];

            // C. Keep track of how many categories have been assigned color keys
            assignedCategories += 1;
        }

        // D. Issue warning if there are not enough color keys for the given category set
        if ( categories.length > assignedCategories ) {

            console.log("WARNING: Not all categories have been assigned color keys!");
        }

        // 3. Set up the category to CSS class map

        // A. Create a map between category names and color classes
        const mapArray = [];
        for ( const category of categories ) {

            const colorID = p_state.colorInfo.categoryToColorMap[category];
            const colorClass = p_state.colorInfo.colorPalette[colorID];

            mapArray.push([category, colorClass]);
        }

        // B. Save the new category to class map
        p_state.colorInfo.categoryClasses = Object.fromEntries(mapArray);
    }
};
