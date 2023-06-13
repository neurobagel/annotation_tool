import { getters } from "~/store";

describe('getCategoryNames', () => {
    it('returns an array of existing category names', () => {
        const state = {
            categories : {
                category1: {},
                category2: {},
                myCatIsCool: {}
            }
        };
        const result = getters.getCategoryNames(state);
        expect(result).to.be.deep.equal([
            "category1",
            "category2",
            "myCatIsCool"
        ]);
    });
});
