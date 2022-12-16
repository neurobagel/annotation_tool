import { getters } from "~/store/index-refactor";

describe('getCategories', () => {
    it('returns an array of existing categories', () => {
        const state = {
            categories : {
                category1: {},
                category2: {},
                myCatIsCool: {}
            }
        };
        const result = getters.getCategories(state);
        expect(result).to.be.deep.equal([
            "category1",
            "category2",
            "myCatIsCool"
        ]);
    });
});
