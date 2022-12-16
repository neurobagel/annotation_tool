// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import Vue from "vue";

export const state = () => ({
    columnToCategoryMapping: {},
    categories: {}
});

export const getters = {

    getCategories (p_state) {
        return Object.keys(p_state.categories);
    }

};


export const mutations = {


    /**
     * Change the mapping between a column and a category.
     * If the two are already mapped, the column should be unlinked.
     * Otherwise the column is mapped to a different category.
     *
     * @param {string} targetCategory Category the column should be mapped to.
     * @param {string} columnName Column that will be mapped to the category.
     */
    alterColumnCategoryMapping(p_state, targetCategory, columnName) {
        if (p_state.columnToCategoryMapping[columnName] === targetCategory) {
            p_state.columnToCategoryMapping[columnName] = null;
        }
        else {
            p_state.columnToCategoryMapping[columnName] = targetCategory;
        }

    }
};