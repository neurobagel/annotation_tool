import nextPage from "~/components/next-page";

let store;
const uiText = {

    button: { "mypage": "My next page button text" },
    instructions: { "mypage": "This is how to get to the next page..." }
};

// NOTE: Due to new, cross-origin security measures in Cypress 12 for component tests,
// testing that the click event has been fired for the next page button is blocked.

describe("next page button", () => {

    beforeEach(() => {

        // Setup
        store = {

            commit: () => {},

            state: {

                currentPage: "mypage",
                dataTable: [],
                pageOrder: ["mypage", "mynextpage"]
            }
        };
    });

    it("Does instruction text appear above the next page button when the button is disabled", () => {

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: {
                isPageAccessible: () => (p_pageName) => false
            },
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: {
                $store: store,
                $route: {
                    name: "mypage"
                }
            }
        });

        // Assert - Correct instructions are visible (since button is disabled due to next page inaccessibility)
        cy.get("[data-cy='instructions-nextpage']").should("contain", uiText.instructions[store.state.currentPage]);
    });

    it("Button is enabled when next page is accessible and vice-versa", () => {

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: {
                isPageAccessible: () => (p_pageName) => true
            },
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: {
                $store: store,
                $route: {
                    name: "mypage"
                }
            }
        });

        // Assert - Button is enabled when next page is accessible
        cy.get("[data-cy='button-nextpage']").should("not.have.class", "disabled");
    });

    it("Button is disabled when next page is not accessible", () => {

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: {
                isPageAccessible: () => (p_pageName) => false
            },
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: {
                $store: store,
                $route: {
                    name: "mypage"
                }
            }
        });

        // Assert - Button is enabled when next page is accessible
        cy.get("[data-cy='button-nextpage']").should("have.class", "disabled");
    });

    it("Does the label on the next page button correspond to the text for the current page?", () => {

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: {
                isPageAccessible: () => (p_pageName) => true
            },
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: {
                $store: store,
                $route: {
                    name: "mypage"
                }
            }
        });

        // Assert - Check button text corresponds to the recently set page
        cy.get("[data-cy='button-nextpage']").should("contain", uiText.button[store.state.currentPage]);
    });
});
