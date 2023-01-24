import { getters } from "~/store";

let state = {};

describe("getNextPage", () => {

    beforeEach(() => {

        // Setup
        state = {

            currentPage: "home"
        };
    });

    it("Checks each next page after given page is correct", () => {

        // Setup
        let pageNames = ["home", "categorization", "annotation", "download"];

        for ( let index = 0; index < pageNames.length - 1; index++ ) {

            // Act
            state.currentPage = pageNames[index];

            // Assert
            expect(getters.getNextPage(state, pageNames[index])).to.equal(pageNames[index + 1]);
        }
    });
});