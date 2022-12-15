// Facilitate Vue reactivity via 'Vue.set' and 'Vue.delete'
import Vue from "vue";

export const state = () => ({
    // columnToCategoryMapping: {}
});

export const getters = {

};


export const mutations = {
    alterColumnCategoryMapping(p_state, activeCategory, columnName) {
        p_state.columnToCategoryMapping[columnName] = activeCategory;
    }
};