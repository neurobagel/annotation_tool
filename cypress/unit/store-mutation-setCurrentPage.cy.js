import { mutations } from "~/store/index-refactor";

let state = {};

describe("setCurrentPage", () => {

    beforeEach(() => {

        // Setup
        state = {

            currentPage: "home"
        };
    });

    it("Set the annotation tool's current page", () => {

        // Act
        mutations.setCurrentPage(state, "categorization");

        // Assert
        expect(state.currentPage).to.equal("categorization");
    });
});