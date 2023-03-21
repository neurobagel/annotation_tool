// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import { Set } from "core-js";
import Vue from "vue";

export const state = () => ({

    appSetting: {

        // The string label applied to values designated as "missing values" when the data are annotated.
        missingValueLabel: "missing value"
    },

    categoricalOptions: {

        "Sex": [

            { label: "male", identifier: "bids:male" },
            { label: "female", identifier: "bids:female" },
            { label: "other", identifier: "bids:other" }
        ]
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

        // "annot-continuous-values": [
        //     "", "float", "bounded", "euro", "range", "int", "string", "isoyear"
        // ]
        "annot-continuous-values": [
            "", "float", "bounded", "euro", "range", "int", "string"
        ]
    }
});

export const getters = {

    getAnnotationComponent: (p_state) => (p_category) => {

        return p_state.categories[p_category].componentName;
    },

    getCategoricalOptions: (p_state) => (p_column) => {

        // Return the options for this column listed in the current (hardcoded)
        // options for each categorical data-based category
        return p_state.categoricalOptions[p_state.columnToCategoryMapping[p_column]] ?? [];
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

    getHarmonizedPreview: (p_state) => (p_column, p_originalValue) => {

        const transformationHeuristic = p_state.dataDictionary.annotated[p_column].transformationHeuristic ?? "";

        let convertedValue = "";

        switch ( transformationHeuristic ) {

            case "float":

                convertedValue = parseFloat(p_originalValue);
                break;

            case "bounded":

                convertedValue = parseInt(p_originalValue.replace("+", ""));
                break;

            case "euro":

                convertedValue = parseFloat(p_originalValue.replace(",", "."));
                break;

            case "range": {

                const [lower, upper] = p_originalValue.split("-").map(val => parseFloat(val.trim()));
                convertedValue = (lower + upper) / 2;
                break;
            }

            case "int":

                convertedValue = parseInt(p_originalValue);
                break;

            case "string":

                convertedValue = p_state.appSetting.missingValueLabel;
                break;

            // case "isoyear": {

            //     // Returns an Object array where keys are the format(s) of the age value and values are the portion of the
            //     // age value that matches this format (in some cases, only a substring may match, or there may be several substrings)
            //     // If no capture group matches, return "undefined"
            //     const regularExpressions = ['(?<isoyear>\\d+Y)?(?<isomonth>\\d+M)?'];
            //     const ageRegex = new RegExp(regularExpressions.join("|"));
            //     const regexHits = ageRegex.exec(p_originalValue);
            //     const matchingKeys = Object.keys(regexHits.groups).filter(key => undefined !== regexHits.groups[key]);
            //     const ageFormats = ( null !== regexHits ) ? Object.fromEntries(matchingKeys.map(key => [key, regexHits.groups[key]])) : "";

            //     const yearValue = parseInt(ageFormats.isoyear.replace("Y", ""));
            //     const monthValue = Object.keys(ageFormats).includes("isomonth") ? parseInt(ageFormats.isomonth.replace("M", "")) / 12 : 0;

            //     convertedValue = `${yearValue + monthValue}`;
            //     break;
            // }

            default:
                break;
        }

        return convertedValue;
    },

    getHeuristic: (p_state) => (p_columnName) => {

        return ( "transformationHeuristic" in p_state.dataDictionary.annotated[p_columnName] ) ?
            p_state.dataDictionary.annotated[p_columnName].transformationHeuristic : "";
    },

    getMappedCategories: (p_state) => (p_categorySkipList=[]) => {

        // 1. Remove unmapped (null) columns and skipped categories
        const currentCategories = Object.values(p_state.columnToCategoryMapping)
            .filter(category => null !== category && !p_categorySkipList.includes(category));

        // 2. Create a set of the unique mapped categories
        const categorySet = new Set(currentCategories);

        // Return the categories in array form
        return [...categorySet];
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

    getMissingValues: (p_state) => (p_category) => {

        // 0. Retrieve all columns linked with the given category
        const mappedColumns = [];
        for ( const column in p_state.columnToCategoryMapping ) {

            if ( p_category === p_state.columnToCategoryMapping[column] ) {

                mappedColumns.push(column);
            }
        }

        // 1. Build a map of missing values by column
        let missingValues = {};
        for ( const column of mappedColumns ) {

            // A. Starts out as a blank list
            missingValues[column] = [];

            // B. Save a list of missing values for this column if,
            // 1) the column has an entry in the data dictionary and,
            // 2) if a missing values list for the column has already been made

            // NOTE: commenting out condition checks because all columns should be in data dictionary and all have missing values lists
            // if ( column in p_state.dataDictionary.annotated &&
            //    "missingValues" in p_state.dataDictionary.annotated[column] ) {

               missingValues[column] = p_state.dataDictionary.annotated[column].missingValues;
           // }
        }

        return missingValues;
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

    getSelectedCategoricalOption: (p_state) => (p_column, p_rawValue) => {

        return p_state.dataDictionary.annotated?.[p_column]?.valueMap?.[p_rawValue] ?? "";
    },

    getTransformOptions: (p_state) => (p_category) => {

        // 0. Get the data type of the given category
        const columnDataType = p_state.categories[p_category].componentName;

        // Return the set of transformation heuristics for this data type
        return p_state.transformationHeuristics[columnDataType];
    },

    getUniqueValues: (p_state) => (p_category, p_maxValues="None") => {

        // 1. Construct an object containing a list of unique values for each column
        const uniqueValues = {};
        for ( const columnName in p_state.columnToCategoryMapping ) {

            // A. Create a new list for values for each column linked to the given category
            if ( p_category === p_state.columnToCategoryMapping[columnName] ) {

                // I. Save unique values for each column
                uniqueValues[columnName] = new Set();
                for ( let index = 0; index < p_state.dataTable.length; index++ ) {

                    // a. Check to see if this value is marked as 'missing' for this column
                    let value = p_state.dataTable[index][columnName];
                    if ( !p_state.dataDictionary?.annotated[columnName].missingValues.includes(value) ) {

                        uniqueValues[columnName].add(value);
                    }
                }

                // II. Convert the unique values list for this column from a set to an array
                uniqueValues[columnName] = [...uniqueValues[columnName]];

                // III. Trim the value list if a maximum value amount was given
                // NOTE: Trimming is done here instead of only looking at p_maxValues rows
                // just in case there are blank entries for columns in the data table
                if ( "None" !== p_maxValues ) {

                    uniqueValues[columnName] = uniqueValues[columnName].slice(0, p_maxValues);
                }
            }
        }

        // Return an object containing a list of unique values for each column
        return uniqueValues;
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

                // 1. Make sure one (and only one) column has been categorized as 'Subject ID'
                const singleSubjectIDColumn = ( 1 === Object.values(p_state.columnToCategoryMapping)
                                                            .filter(category => "Subject ID" === category)
                                                            .length );

                // 2. Make sure at least one other category other than 'Subject ID' has been linked to a column
                const notOnlySubjectIDCategorized = ( Object.values(p_state.columnToCategoryMapping)
                                                            .filter(category => "Subject ID" !== category &&
                                                                    null !== category)
                                                            .length >= 1 );

                // Annotation page is only accessible if one (and only one)
                // column has been categorized as 'Subject ID' and if at least
                // one category other than Subject ID has been categorized
                pageAccessible = singleSubjectIDColumn && notOnlySubjectIDCategorized;

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

        if ( category === p_state.columnToCategoryMapping[column] ) {

            // 1. Unlink the column from the category
            p_state.columnToCategoryMapping[column] = null;
        }
        else {

            // 1. Link the column to the category
            p_state.columnToCategoryMapping[column] = category;
        }

        // 2. Re-initialize the annotated data dictionary column
        p_state.dataDictionary.annotated[column] = Object.assign(
            {},
            p_state.dataDictionary.userProvided[column],
            { missingValues: [] }
        );
    },

    changeMissingStatus(p_state, { column, value, markAsMissing }) {

        if ( markAsMissing ) {

            // 1. Only add unique values to the missing value list
            if ( !p_state.dataDictionary.annotated[column].missingValues.includes(value) ) {

                p_state.dataDictionary.annotated[column].missingValues.push(value);
            }
        } else {

            // 1. Remove value from the missing value list
            p_state.dataDictionary.annotated[column].missingValues.splice(
                p_state.dataDictionary.annotated[column].missingValues.indexOf(value), 1);
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
        p_state.dataDictionary.annotated = Object.assign({}, JSON.parse(JSON.stringify(p_state.dataDictionary.userProvided)));

        // 3. Add fields required for annotation
        Object.keys(p_state.dataDictionary.annotated).forEach(columnName => {

            p_state.dataDictionary.annotated[columnName].missingValues = [];
        });
    },

    selectCategoricalOption(p_state, { optionValue, columnName, rawValue }) {

        // 0. Create an categorical value map for this column, if it does not yet exist
        if ( !("valueMap" in p_state.dataDictionary.annotated[columnName]) ) {

            p_state.dataDictionary.annotated[columnName].valueMap = {};
        }

        // 1. Assign the option value to a raw value for this column
        p_state.dataDictionary.annotated[columnName].valueMap[rawValue] = optionValue;
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
