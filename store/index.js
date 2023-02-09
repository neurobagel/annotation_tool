// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import Vue from "vue";

export const state = () => ({

    categoricalOptions: {

        "Sex": ["male", "female", "other"]
    },

    categories: {

        "Subject ID": {},
        "Age": {

            componentName: "annot-continuous-values",
            explanation: "This is an explanation for how to annotate age."
        },
        "Sex": {

            componentName: "annot-categorical",
            explanation: "This is an explanation for how to annotate sex."
        },
        "Diagnosis": {

            componentName: "annot-categorical",
            explanation: "This is an explanation for how to annotate diagnosis."
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

            "Subject ID": "color1",
            "Age": "color2",
            "Sex": "color3",
            "Diagnosis": "color4",
            "Assessment Tool": "color5"
        },

        categoryClasses: {

            "Subject ID": "category-style-1",
            "Age": "category-style-2",
            "Sex": "category-style-3",
            "Diagnosis": "category-style-4",
            "Assessment Tool": "category-style-5"
        }
    },

    columnToCategoryMapping: {},

    currentPage: "home",

    dataDictionary: {

        // stores the data dictionary loaded by the user (if available) in userProvided
        // and stores the extended version created during annotation in annotated.
        // We use this both as a state object and as the template for the downloadable data dictionary
        userProvided: {},
        annotated: {}
    },

    dataTable: [],

    pageData: {

        home: {

            fullName: "Home",
            location: "/",
            pageName: "home"
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

    // TODO: Assess whether this is the best place and configuration for storing
    // transformation heuristics
    transformationHeuristics: {

        "annot-continuous-values": [
            "float", "bounded", "euro", "range", "int", "string", "isoyear"
        ]
    }
});

export const getters = {

    getAnnotationComponent: (p_state) => (p_category) => {

        return p_state.categories[p_category].componentName;
    },

    getCategoryNames (p_state) {


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

        return ( 0 === p_state.dataTable.length) ? [] : Object.keys(p_state.dataTable[0] );
    },

    getExplanation: (p_state) => (p_category) => {

        return ( "explanation" in p_state.categories[p_category] ) ?
            p_state.categories[p_category].explanation : null;
    },

    getHeuristic: (p_state) => (p_columnName) => {

        return ( "transformationHeuristic" in p_state.dataDictionary.annotated[p_columnName] ) ?
            p_state.dataDictionary.annotated[p_columnName].transformationHeuristic : "";
    },

    getMappedColumns: (p_state) => (p_category) => {

        const mappedColumns = [];
        for ( const column in p_state.columnToCategoryMapping ) {

            if ( p_category === p_state.columnToCategoryMapping[column] ) {

                mappedColumns.push(column);
            }
        }
        return mappedColumns;
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

    getCategoricalOptions: (p_state) => (p_column) => {

        // Return the options for this column listed in the current (hardcoded)
        // options for each categorical data-based category
        return p_state.categoricalOptions[p_state.columnToCategoryMapping[p_column]] ?? [];
    },

    getTransformOptions: (p_state) => (p_category) => {

        // 0. Get the data type of the given category
        const columnDataType = p_state.categories[p_category].componentName;

        // Return the set of transformation heuristics for this data type
        return p_state.transformationHeuristics[columnDataType];
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
                const categorizationStatus = Object.values(p_state.columnToCategoryMapping)
                                                   .some(category =>  null !== category );

                // 2. Make sure one (and only one) column has been categorized as 'Subject ID'
                const singleSubjectIDColumn = ( 1 === Object.values(p_state.columnToCategoryMapping)
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

    processDataDictionary( { state, commit, getters }, { data, filename }) {

        commit("setDataDictionary", { newDataDictionary: JSON.parse(data), storeColumns: getters.getColumnNames });
    },

    processDataTable( { state, commit, getters }, { data, filename }) {

        // This action is dispatched when a new dataTable is loaded by the user.
        // This indicates to us that the user wants to reset the app and begin a new
        // annotation procedure from scratch. The needed steps are handled by this action.

        commit("setDataTable", data);
        commit("initializeColumnToCategoryMap", getters.getColumnNames);
        commit("initializeDataDictionary");
    }
};

export const mutations = {

    /**
     * Change the mapping between a column and a category
     * If the two are already mapped, the column should be unlinked
     * Otherwise the column is mapped to a different category
     *
     * @param {string} category Category the column should be mapped to
     * @param {string} column Column that will be mapped to the category
     */
    alterColumnCategoryMapping(p_state, { category, column }) {

        if (p_state.columnToCategoryMapping[column] === category) {
            p_state.columnToCategoryMapping[column] = null;
        }
        else {
            p_state.columnToCategoryMapping[column] = category;
        }

    },

    initializeColumnToCategoryMap(p_state, p_columns) {

        // Column to category map lists all columns as keys with default value of null
        p_state.columnToCategoryMapping =
            Object.fromEntries(p_columns.map((column) => [column, null]));
    },

    initializeDataDictionary(p_state) {

        // 0. Wipe the current provided data dictionary
        p_state.dataDictionary.userProvided = {};

        // 1. Create a skeleton data dictionary based on the data table's columns
        for ( const columnName of Object.keys(p_state.dataTable[0]) ) {

            p_state.dataDictionary.userProvided[columnName] = { "description": "" };
        }

        // 2. Make a copy of the newly provided skeleton dictionary for annotation
        p_state.dataDictionary.annotated = JSON.parse(JSON.stringify(p_state.dataDictionary.userProvided));
    },

    setCurrentPage(p_state, p_pageName) {

        p_state.currentPage = p_pageName;
    },

    setDataDictionary(p_state, { newDataDictionary, storeColumns }) {

        // 1. Update values to existing columns in the data dictionary, but ignore any new columns
        for ( const column of storeColumns ) {

            // A. Provided data dictionary is updated with new keys/values
            p_state.dataDictionary.userProvided[column] =
                Object.assign({},
                              p_state.dataDictionary.userProvided[column],
                              newDataDictionary[column]);

            // B. Annotated data dictionary is similarly update with new keys/values,
            // but ensuring no annotations are removed (unless bashed by the new data dictionary)
            p_state.dataDictionary.annotated[column] =
                Object.assign({},
                              p_state.dataDictionary.annotated[column],
                              newDataDictionary[column]);
        }

        // 2. Create a new object in case additions/deletions to the data
        // dictionary object in order to maintain Vue reactivity
        p_state.dataDictionary = Object.assign({}, p_state.dataDictionary);
    },

    setDataTable(p_state, p_dataTable) {

        const columnNames = p_dataTable[0];
        let dataTable = [];

        for ( const [rowIndex, row] of p_dataTable.slice(1).entries() ) {
            // If the row is empty, we don't want it in our dataTable
            if ( "" === row.join("").trim() ) {
                continue;
            } else if ( row.length < columnNames.length ) {
                console.warn("WARNING: tsv row " + parseInt(rowIndex) + " has fewer columns than the tsv header!");
            }

            let rowArray = [];
            for ( const [colIndex, value] of row.entries() ) {
                // Rows that are longer than the header should be truncated
                if ( colIndex >= columnNames.length ) {
                    console.warn("WARNING: tsv row " + parseInt(rowIndex) + " has more columns than the tsv header!");
                    continue;
                }

                rowArray.push([columnNames[colIndex], value]);
            }
            dataTable.push(Object.fromEntries(rowArray));
        }

        p_state.dataTable = dataTable;
    },

    setHeuristic(p_state, { column, heuristic }) {

        // Set a new transformation heuristic for this column
        Vue.set(p_state.dataDictionary.annotated[column], "transformationHeuristic", heuristic);
    }
};
