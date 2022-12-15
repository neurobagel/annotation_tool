import { mutations } from "~/store/index-refactor";

describe('alterColumnCategoryMapping', () => {
    it('Changes the mapping of an already mapped column to a different category', () => {
      const { alterColumnCategoryMapping } = mutations;
      const state = {
        columnToCategoryMapping : {
            "column1": "Age",
            "column2": null,
            "column3": "Sex",
            "column4": null,
            "column5": null
        }

    };
    alterColumnCategoryMapping(state, "activeCategory", "column1");
    expect(state.columnToCategoryMapping.column1).to.equal("activeCategory");
    });
});
