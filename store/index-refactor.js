// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import Vue from "vue";

export const state = () => ({

    categories: {},

    columnToCategoryMapping: {},

    dataDictionary: {

        // stores the data dictionary loaded by the user (if available) in userProvided
        // and stores the extended version created during annotation in annotated.
        // We use this both as a state object and as the template for the downloadable data dictionary
        userProvided: {},
        annotated: {}
    },

    dataTable: []
});

export const getters = {

    getCategoryNames (p_state) {
        return Object.keys(p_state.categories);
    },

    getColumnDescription (p_state, p_columnName) {
        if ( Object.hasOwn(p_state.dataDictionary.annotated[p_columnName], "description") ) {
            return p_state.dataDictionary.annotated[p_columnName].description;
        }
        else {
            return "";
        }
    },

    getColumnNames(p_state) {

        // Returns list of columns from the loaded data table
        return ( 0 === p_state.dataTable.length ) ? [] : Object.keys(p_state.dataTable[0]);
    },

    getValueDescription (p_state, p_columnName, p_value) {
        // Returns the description of a value in a column, if that description exists
        // Otherwise it returns an empty string
        const description = p_state.dataDictionary.annotated[p_columnName].levels?.[p_value]?.description;
        if ( typeof description  === "undefined" ) {
            return "";
        }
        return description;
    },

    getColumnNames(p_state) {
        return (0 === p_state.dataTable.length) ? [] : Object.keys(p_state.dataTable[0]);
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
    alterColumnCategoryMapping(p_state, targetCategory, columnName) {
        if (p_state.columnToCategoryMapping[columnName] === targetCategory) {
            p_state.columnToCategoryMapping[columnName] = null;
        }
        else {
            p_state.columnToCategoryMapping[columnName] = targetCategory;
        }

    },

    initializeColumnToCategoryMap(p_state, p_columns) {

        // Column to category map lists all columns as keys with default value of null
        p_state.columnToCategoryMapping =
            Object.fromEntries(p_columns.map((column) => [column, null]));
    }
};