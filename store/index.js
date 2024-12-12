// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import { Set } from "core-js";
import Vue from "vue";
import toolTerms from "~/static/toolTerms.json";
import diagnosisTerms from "~/static/diagnosisTerms.json";

// The default state of the store
function getDefaultState() {
    return {

    // Keeps track of number of annotations made in current run;
    // > 0 annotations allows access to the download page
    annotationCount: 0,

    appSetting: {

        // The string label applied to values designated as "missing values" when the data are annotated.
        missingValueLabel: "missing value"
    },

    categoricalOptions: {

        "Sex": [

            { label: "Male", identifier: "snomed:248153007" },
            { label: "Female", identifier: "snomed:248152002" },
            { label: "Other", identifier: "snomed:32570681000036106" }
        ],
        "Diagnosis": diagnosisTerms
    },

    // The explanation strings for each category, will be split by '.' and turned into bullet points in the annot-explanation component
    categories: {

        "Subject ID": {
            // Added to be used as a case inside the switch statement of getJSONOutput
            componentName: "participantID"
        },
        "Session ID": {
            // Added to be used as a case inside the switch statement of getJSONOutput
            componentName: "sessionID"
        },
        "Age": {

            componentName: "annot-continuous-values",
            explanation: "Review the annotated columns for Age. Mark missing values. Select a transformation heuristic, check the preview, and finalize the harmonization",
            identifier: "nb:Age"
        },
        "Sex": {

            componentName: "annot-categorical",
            explanation: "Review the annotated columns for Sex. Mark missing values. Annotate each unique value from the dropdown, and finalize the harmonization",
            identifier: "nb:Sex"
        },
        "Diagnosis": {

            componentName: "annot-categorical",
            explanation: "Review the annotated columns for Diagnosis. Mark missing values. Annotate each unique value from the dropdown, and finalize the harmonization",
            identifier: "nb:Diagnosis"
        },
        "Assessment Tool": {

            componentName: "annot-tool-groups",
            explanation: "Review the annotated columns for Assessment Tool. Mark missing values for each tool",
            identifier: "nb:AssessmentTool"
        }
    },

    colorInfo: {

        colorPalette: {

            color1: "category-style-1",
            color2: "category-style-2",
            color3: "category-style-3",
            color4: "category-style-4",
            color5: "category-style-5",
            color6: "category-style-6",
            colorDefault: "category-style-default"
        },

        categoryToColorMap: {

            "Subject ID": "color1",
            "Session ID": "color6",
            "Age": "color2",
            "Sex": "color3",
            "Diagnosis": "color4",
            "Assessment Tool": "color5"
        },

        categoryClasses: {

            "Subject ID": "category-style-1",
            "Session ID": "category-style-6",
            "Age": "category-style-2",
            "Sex": "category-style-3",
            "Diagnosis": "category-style-4",
            "Assessment Tool": "category-style-5"
        }
    },

    columnToCategoryMap: {},

    dataDictionary: {

        // stores the data dictionary loaded by the user (if available) in userProvided
        // and stores the extended version created during annotation in annotated.
        // We use this both as a state object and as the template for the downloadable data dictionary
        userProvided: {},
        annotated: {},

        filename: "default"
    },

    dataTable: [],

    pageOrder: ['home', 'categorization', 'annotation', 'download'],

    // TODO: Assess whether this is the best place and configuration for storing
    // transformation heuristics
    transformationHeuristics: {

        bounded: {

            Label: "bounded value",
            TermURL: "nb:FromBounded"
        },

        euro: {

            Label: "european decimal value",
            TermURL: "nb:FromEuro"
        },

        float: {

            Label: "float value",
            TermURL: "nb:FromFloat"
        },

        iso8601: {

            Label: "period of time defined according to the ISO8601 standard",
            TermURL: "nb:FromISO8601"
        }
    },

    toolTerms: Object.entries(toolTerms).map(([key, value]) => ({
        label: value,
        identifier: "cogatlas:" + key,
        selected: false
      })),

    columnToToolMap: {}
};
}

export const state = () => getDefaultState();

export const getters = {

    getAnnotationComponent: (p_state) => (p_category) => {

        return p_state.categories[p_category].componentName;
    },

    getAssessmentToolJSONOutput: (p_state) => (p_columnName) => {
        const annotatedDictColumn = p_state.dataDictionary.annotated[p_columnName];
        const formattedOutput = {
            Annotations: {
                IsAbout: {
                    TermURL: "nb:Assessment",
                    Label: "Assessment tool"
                },
                IsPartOf: {
                    TermURL: "",
                    Label: ""
                },
                MissingValues: []
            }
        };
        const tool = p_state.columnToToolMap[p_columnName];

        p_state.toolTerms.forEach(term => {
            if ( term.identifier === tool ) {
                formattedOutput.Annotations.IsPartOf.Label = term.label;
                formattedOutput.Annotations.IsPartOf.TermURL = term.identifier;
            }
        });

        // Add existing keys from user provided dictionary
        Object.keys(annotatedDictColumn).forEach(columnEntry => {

            if ( "missingValues" !== columnEntry && "valueMap" !== columnEntry ) {

                formattedOutput[columnEntry] = annotatedDictColumn[columnEntry];
            }
        });

        formattedOutput.Annotations.MissingValues = annotatedDictColumn.missingValues;

        return formattedOutput;
    },

    getCategoricalJsonOutput: (p_state) => (p_columnName) => {

        // 0. Initialize output object
        const annotatedDictColumn = p_state.dataDictionary.annotated[p_columnName];
        const category = p_state.columnToCategoryMap[p_columnName];
        const formattedOutput = {

            Annotations: {

                IsAbout: {

                    Label: "",
                    TermURL: ""
                },
                Levels: {},
                MissingValues: []
            }
        };

        // 1. Fill out Annotations 'IsAbout' section

        // A. Label matches the assigned category
        formattedOutput.Annotations.IsAbout.Label = category;

        // B. Term matches the category identifier
        formattedOutput.Annotations.IsAbout.TermURL = p_state.categories[category].identifier;

        // 2. Fill out Annotations 'Levels' section
        Object.keys(annotatedDictColumn.valueMap).forEach(rawValue => {

            formattedOutput.Annotations.Levels[rawValue] = {};

            // A. Save value map via labels and identifiers
            p_state.categoricalOptions[category].forEach(option => {

                if ( annotatedDictColumn.valueMap[rawValue] === option.identifier ) {

                    formattedOutput.Annotations.Levels[rawValue].Label = option.label;
                    formattedOutput.Annotations.Levels[rawValue].TermURL = option.identifier;
                }
            });
        });

        // 3. Save any other keys from data dictionary
        Object.keys(annotatedDictColumn).forEach(columnEntry => {

            if ( "missingValues" !== columnEntry && "valueMap" !== columnEntry ) {

                formattedOutput[columnEntry] = annotatedDictColumn[columnEntry];
            }
        });

        // 4. Save missing values
        formattedOutput.Annotations.MissingValues = annotatedDictColumn.missingValues;

        return formattedOutput;
    },

    getCategoricalOptions: (p_state) => (p_column) => {

        // Return the options for this column listed in the current (hardcoded)
        // options for each categorical data-based category
        return p_state.categoricalOptions[p_state.columnToCategoryMap[p_column]] ?? [];
    },

    getCategoryNames (p_state) {

        return Object.keys(p_state.categories);
    },

    getColumnDescription: (p_state) => (p_columnName) => {

        let columnDescription = "";
        if ( Object.hasOwn(p_state.dataDictionary.annotated[p_columnName], "Description") ) {

            columnDescription = p_state.dataDictionary.annotated[p_columnName].Description;
        }

        return columnDescription;
    },

    getColumnDataType: (p_state) => (p_columnName) => {

        // Determine the category for this column
        const category = p_state.columnToCategoryMap[p_columnName];

        // Return the component type from the categories object
        return ( null === category ) ? null : p_state.categories[category].componentName;
    },

    getColumnNames(p_state) {

        return ( 0 === p_state.dataTable.length ) ? [] : Object.keys(p_state.dataTable[0]);
    },

    getContinuousJsonOutput: (p_state) => (p_columnName) => {

        // 0. Initialize output object
        const annotatedDictColumn = p_state.dataDictionary.annotated[p_columnName];
        const category = p_state.columnToCategoryMap[p_columnName];
        const formattedOutput = {

            Annotations: {

                IsAbout: {
                    Label: "",
                    TermURL: ""
                },
                Transformation: {
                    Label: "",
                    TermURL: ""
                }
            }
        };

        // 1. Fill out Annotations 'IsAbout' section

        // A. Label matches the assigned category
        formattedOutput.Annotations.IsAbout.Label = category;

        // B. Term matches the category identifier
        formattedOutput.Annotations.IsAbout.TermURL = p_state.categories[category].identifier;

        // 2. Save the transformation heuristic from the list of possible heuristics
        formattedOutput.Annotations.Transformation = p_state.transformationHeuristics[annotatedDictColumn.transformationHeuristic];

        // 3. Save the missing values
        formattedOutput.Annotations.MissingValues = annotatedDictColumn.missingValues;

        // 4. Save any other keys from data dictionary
        Object.keys(annotatedDictColumn).forEach(columnEntry => {

            if ( "missingValues" !== columnEntry && "transformationHeuristic" !== columnEntry ) {

                formattedOutput[columnEntry] = annotatedDictColumn[columnEntry];
            }
        });

        return formattedOutput;
    },

    getExplanation: (p_state) => (p_category) => {

        return ( "explanation" in p_state.categories[p_category] ) ?
            p_state.categories[p_category].explanation : null;
    },

    getHarmonizedPreview: (p_state) => (p_column, p_originalValue) => {

        let convertedValue = "";

        switch ( p_state.dataDictionary.annotated[p_column].transformationHeuristic ) {

            case "float":

                convertedValue = parseFloat(p_originalValue);
                break;

            case "bounded":

                convertedValue = parseInt(p_originalValue.replace("+", ""));
                break;

            case "euro":

                convertedValue = parseFloat(p_originalValue.replace(",", "."));
                break;

            case "int":

                convertedValue = parseInt(p_originalValue);
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

        return p_state.dataDictionary.annotated[p_columnName].transformationHeuristic;
    },

    getJsonOutput(p_state, p_getters) {

        let jsonOutput = {};

        // 1. Create a JSON output that contains annotations made thus far
        Object.keys(p_state.dataDictionary.annotated).forEach(columnName => {

            let columnOutput;

            // A. If a column has been categorized/annotated, transform its annotations to json output format
            if ( null !== p_state.columnToCategoryMap[columnName] ) {

                // I. Columns with different data types yield different json outputs
                switch ( p_getters.getColumnDataType(columnName) ) {

                    case "annot-categorical":

                        columnOutput = p_getters.getCategoricalJsonOutput(columnName);
                        break;

                    case "annot-continuous-values":

                        columnOutput = p_getters.getContinuousJsonOutput(columnName);
                        break;

                    case "participantID":
                        columnOutput = {
                            "Description": "A participant ID",
                            Annotations: {

                                IsAbout: {
                                    Label: "Subject Unique Identifier",
                                    TermURL: "nb:ParticipantID"
                                },
                                Identifies: "participant"
                            }
                        };
                        break;

                    case "sessionID":
                        columnOutput = {
                            "Description": "A session ID",
                            Annotations: {

                                IsAbout: {
                                    Label: "Session Unique Identifier",
                                    TermURL: "nb:SessionID"
                                },
                                Identifies: "session"
                            }
                        };
                        break;

                    case "annot-tool-groups":
                        columnOutput = p_getters.getAssessmentToolJSONOutput(columnName);
                        break;
                }

            }
            // B. Transfer unannotated data from the user provided data dictionary
            else {

                // Transfer unannotated data from the user provided data dictionary to the output
                columnOutput = p_state.dataDictionary.annotated[columnName];
                delete columnOutput.missingValues;
            }

            jsonOutput[columnName] = columnOutput;
        });

        return jsonOutput;
    },

    getMappedCategories: (p_state) => (p_categorySkipList=[]) => {

        // 1. Remove unmapped (null) columns and skipped categories
        const currentCategories = Object.values(p_state.columnToCategoryMap)
            .filter(category => null !== category && !p_categorySkipList.includes(category));

        // 2. Create a set of the unique mapped categories
        const categorySet = new Set(currentCategories);

        // Return the categories in array form
        return [...categorySet];
    },

    getMissingValues: (p_state) => (p_category) => {

        // 1. Retrieve all columns linked with the given category
        const mappedColumns = [];
        for ( const columnName in p_state.columnToCategoryMap ) {

            if ( p_category === p_state.columnToCategoryMap[columnName] ) {

                mappedColumns.push(columnName);
            }
        }

        // 2. Build a map of missing values by column
        // NOTE: Every column in the annotated dictionary has at least a blank missing values list
        const missingValues = {};
        for ( const columnName of mappedColumns ) {

            missingValues[columnName] = p_state.dataDictionary.annotated[columnName].missingValues;
        }

        return missingValues;
    },

    getSelectedCategoricalOption: (p_state) => (p_columnName, p_rawValue) => {

        // 0. If raw value does not exist in the value map, returns ""
        let selectedCategoricalOption = "";

        // 1. Look for raw value in the value map
        if ( p_rawValue in p_state.dataDictionary.annotated[p_columnName].valueMap ) {

            // A. Get the annotated value of the raw value
            const annotatedValue = p_state.dataDictionary.annotated[p_columnName].valueMap[p_rawValue];

            // B. Get the category for the given column
            const activeCategory = p_state.columnToCategoryMap[p_columnName];

            // C. Try to find the label for the given annotated value (identifier)
            // in the store's option objects for this category
            for ( const optionObject of p_state.categoricalOptions[activeCategory] ) {

                if ( annotatedValue === optionObject.identifier ) {

                    selectedCategoricalOption = optionObject.label;
                    break;
                }
            }
        }

        return selectedCategoricalOption;
    },

    getSelectedTools: (p_state) =>  {
        return p_state.toolTerms.filter(term => term.selected);
    },

    getTransformOptions: (p_state) => (p_category) => {

        return Object.keys(p_state.transformationHeuristics);
    },

    getColumnsForCategory: (p_state) => (p_category) => {
        const columns = [];
        for ( const columnName in p_state.columnToCategoryMap ) {

            if ( p_category === p_state.columnToCategoryMap[columnName] ) {

                columns.push(columnName);
            }
        }

        return columns;
    },

    getColumnsForTool: (p_state) => (p_tool) => {

        return Object.keys(p_state.columnToToolMap)
        .filter(key => p_state.columnToToolMap[key] === p_tool);
    },

    getUniqueColumnValues: (p_state) => (columnName, p_maxValues="None") => {
            let uniqueColumnValues = new Set();
            for ( let index = 0; index < p_state.dataTable.length; index++ ) {

                // a. Check to see if this value is marked as 'missing' for this column
                let value = p_state.dataTable[index][columnName];
                if ( !p_state.dataDictionary?.annotated[columnName].missingValues.includes(value) ) {

                    uniqueColumnValues.add(value);
                }
            }

            // II. Convert the unique values list for this column from a set to an array
            uniqueColumnValues = [...uniqueColumnValues];

            // III. Trim the value list if a maximum value amount was given
            // NOTE: Trimming is done here instead of only looking at p_maxValues rows
            // just in case there are blank entries for columns in the data table
            if ( "None" !== p_maxValues ) {

                uniqueColumnValues = uniqueColumnValues.slice(0, p_maxValues);
            }

        // Return an object containing a list of unique values for each column
        return uniqueColumnValues;
    },

    getUniqueValues: (p_state, p_getters) => (p_category, p_maxValues="None") => {
        const columns = p_getters.getColumnsForCategory(p_category);
        const uniqueValues = {};
        for (const column of columns) {
            uniqueValues[column] = p_getters.getUniqueColumnValues(column, p_maxValues);
        }
        return uniqueValues;
    },

    getValueDescription: (p_state) => (p_columnName, p_value) => {
        // Returns the description of a value in a column, if that description exists
        // Otherwise it returns an empty string
        const description = p_state.dataDictionary.annotated[p_columnName].Levels?.[p_value];
        if ( typeof description  === "undefined" ) {
            return "no description available";
        }
        return description;
    },

    isPageAccessible: (p_state, p_getters) => (p_pageName) => {
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
                const singleSubjectIDColumn = ( 1 === Object.values(p_state.columnToCategoryMap)
                                                            .filter(category => "Subject ID" === category)
                                                            .length );

                // 2. Make sure at least one other category other than 'Subject ID' has been linked to a column
                const notOnlySubjectIDCategorized = ( Object.values(p_state.columnToCategoryMap)
                                                            .filter(category => "Subject ID" !== category &&
                                                                    "Session ID" !== category &&
                                                                    null !== category)
                                                            .length >= 1 );

// 3. Make sure all columns about assessment tools are mapped to something
                const allAssessmentColumnsAreMapped = p_getters.getColumnsForCategory("Assessment Tool")
                    .every(column => p_state.columnToToolMap[column] !== null);
                // Annotation page is only accessible if one (and only one)
                // column has been categorized as 'Subject ID' and if at least
                // one category other than Subject ID has been categorized
                pageAccessible = singleSubjectIDColumn && notOnlySubjectIDCategorized && allAssessmentColumnsAreMapped;

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

    navigateToPage( _, pageName) {
        const targetRoute = this.$router.options.routes.filter((route) => route.name === pageName)[0];
        this.$router.push(targetRoute.path);
    },

    processDataDictionary({ state, commit, getters }, { data, filename }) {

        // If annotations exist in the provided data, remove them first
        const userDataDictionary = JSON.parse(data);

        Object.keys(userDataDictionary).forEach(key => {
            delete userDataDictionary[key].Annotations;
        });

        commit("setDataDictionary", { newDataDictionary: userDataDictionary, storeColumns: getters.getColumnNames });
        commit("setDataDictionaryFilename", filename);
    },

    processDataTable({ state, commit, getters }, { data, filename }) {

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
     * @param {string} columnName Column that will be mapped to the category
     */
    alterColumnCategoryMapping(p_state, { category, columnName }) {

        if ( category === p_state.columnToCategoryMap[columnName] ) {

            // 1. Unlink the column from the category
            p_state.columnToCategoryMap[columnName] = null;
        }
        else {

            // 1. Link the column to the category
            p_state.columnToCategoryMap[columnName] = category;
        }

        // 2. Re-initialize the annotated data dictionary column,
        // also checking data type of new category for specialized structures
        // NOTE: The latter are initialized here to eliminate checks for their
        // nullness in other store functions
        switch ( p_state.columnToCategoryMap[columnName] ) {
            case "Subject ID":
                p_state.dataDictionary.annotated[columnName] = Object.assign(
                    {},
                    p_state.dataDictionary.userProvided[columnName]
                );
                break;

            case "Age":

                p_state.dataDictionary.annotated[columnName] = Object.assign(
                    {},
                    p_state.dataDictionary.userProvided[columnName],
                    { missingValues: [], transformationHeuristic: "" }
                );
                break;

            case "Diagnosis":
            case "Assessment Tool":
            case "Sex":

                p_state.dataDictionary.annotated[columnName] = Object.assign(
                    {},
                    p_state.dataDictionary.userProvided[columnName],
                    { missingValues: [], valueMap: {} }
                );
                break;
        }
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

    alterColumnToToolMapping(p_state, {columnName, toolIdentifier}) {
        if ( p_state.columnToToolMap[columnName] === toolIdentifier ) {
            p_state.columnToToolMap[columnName] = null;
        } else {
            p_state.columnToToolMap[columnName] = toolIdentifier;
        }
    },

    createAssessmentTool(p_state, newTool) {
        const toolIndex = p_state.toolTerms.findIndex(tool => tool.identifier === newTool.identifier);
        p_state.toolTerms.splice(toolIndex, 1, Object.assign(p_state.toolTerms[toolIndex], { selected: true }));
    },

    initializeColumnToCategoryMap(p_state, p_columns) {

        // Column to category map lists all columns as keys with default value of null
        p_state.columnToCategoryMap =
            Object.fromEntries(p_columns.map((column) => [column, null]));
        // TODO: consider refactoring this so we don't initialize all columns
        // but only the ones that are assigned to assessment tool
        p_state.columnToToolMap =
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
        p_state.dataDictionary.annotated = Object.assign({}, JSON.parse(JSON.stringify(p_state.dataDictionary.userProvided)));

        // 3. Add fields required for annotation
        Object.keys(p_state.dataDictionary.annotated).forEach(columnName => {

            // A. Every column can have missing values
            p_state.dataDictionary.annotated[columnName].missingValues = [];
        });
    },

    selectCategoricalOption(p_state, { optionValue, columnName, rawValue }) {

        // If the empty (null) option from v-select dropdown is selected remove
        // the rawValue from the valueMap
        if ( null === optionValue ) {

            Vue.delete(p_state.dataDictionary.annotated[columnName].valueMap, rawValue);
        }
        // Otherwise, assign the option value to a raw value for this column
        else {

            Vue.set(p_state.dataDictionary.annotated[columnName].valueMap, rawValue, optionValue);
        }
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

    setDataDictionaryFilename(p_state, p_filename) {

        // Save the filename of the user-provided data dictionary
        p_state.dataDictionary.filename = p_filename;
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

    setHeuristic(p_state, { columnName, heuristic }) {

        // Set a new transformation heuristic for this column
        Vue.set(p_state.dataDictionary.annotated[columnName], "transformationHeuristic", heuristic ?? "");
    },

    updateAnnotationCount(p_state) {

        let count = 0;

        // 1. Check each column in the data dictionary for annotations
        Object.keys(p_state.dataDictionary.annotated).forEach(columnName => {

            // A. Get the annotated column object for this column
            const column = p_state.dataDictionary.annotated[columnName];

            // B. Get the mapped category for this column
            const category = p_state.columnToCategoryMap[columnName];

            // Only categorized columns can have annotations
            if ( null !== category ) {

                // C. Check for data type and for what that data type counts as an annotation
                if ( "annot-categorical" === p_state.categories[category].componentName &&
                     Object.keys(column.valueMap).length > 0 ) {

                    count++;
                } else if ( "annot-continuous-values" === p_state.categories[category].componentName &&
                            "" !== column.transformationHeuristic ) {

                    count++;
                }
            }
        });

        // 2. Save the updated annotation in the store
        p_state.annotationCount = count;
    },

    resetState(p_state) {
        Object.keys(p_state).forEach((key) => {
          const initialState = getDefaultState();
          if (Object.prototype.hasOwnProperty.call(initialState, key)) {
            Vue.set(p_state, key, initialState[key]);
          }
        });
      },

    deselectTool(p_state, toolIdentifier) {
        const toolIndex = p_state.toolTerms.findIndex(tool => tool.identifier === toolIdentifier);
        p_state.toolTerms[toolIndex].selected = false;
    }
};
