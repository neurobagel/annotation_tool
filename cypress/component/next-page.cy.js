import nextPage from "~/components/next-page";

let store;
const uiText = {

    button: { "mypage": "My next page button text" },
    instructions: { "mypage": "This is how to get to the next page..." }
};

describe("next page button", () => {

    beforeEach(() => {

        // Setup
        store = {

            commit: () => {},

            getters: {

                getNextPage: () => {

                    return ( "mypage" === store.state.currentPage ) ? "mynextpage" : "mypage";
                }
            },

            mutations: {

                setCurrentPage: () => (p_pageName) => {

                    store.state.currentPage = p_pageName;
                }
            },

            state: {

                currentPage: "mypage",
                dataTable: [],
                pageData: {



                    mypage: {

                        location: "mypage",
                        pageName: "mypage"
                    },

                    mynextpage: {

                        location: "mynextpage",
                        pageName: "mynextpage"
                    }
                }
            }
        };
    });

    it("Does instruction text appear above the next page button when the button is disabled", () => {

        // Setup - The next page after 'mypage' is currently inaccessible
        store.getters.isPageAccessible = () => (p_pageName) => false;

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: store.getters,
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: { $store: store }
        });

        // Assert - Correct instructions are visible (since button is disabled due to next page inaccessibility)
        cy.get("[data-cy='instructions-nextpage']").should("contain", uiText.instructions[store.state.currentPage]);
    });

    it("Button is enabled when next page is accessible and vice-versa", () => {

        // Setup - Mock the page accessibility getter to test effects on the next page button
        store.getters.isPageAccessible = () => (p_pageName) => true;

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: store.getters,
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: { $store: store }
        });

        // Assert - Button is enabled when next page is accessible
        // cy.get("[data-cy='button-nextpage']").should("not.be.disabled");
        cy.get("[data-cy='button-nextpage']").should("not.have.class", "disabled");
    });

    it("Button is disabled when next page is not accessible", () => {

        // Setup - Mock the page accessibility getter to test effects on the next page button
        store.getters.isPageAccessible = () => (p_pageName) => false;

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: store.getters,
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: { $store: store }
        });

        // Assert - Button is enabled when next page is accessible
        // cy.get("[data-cy='button-nextpage']").should("be.disabled");
        cy.get("[data-cy='button-nextpage']").should("have.class", "disabled");
    });

    it("Does the label on the next page button correspond to the text for the current page?", () => {

        // Setup - Mock the page accessibility getter to test effects on the next page button
        store.getters.isPageAccessible = () => (p_pageName) => true;

        // Act - Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: store.getters,
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: { $store: store }
        });

        // Assert - Check button text corresponds to the recently set page
        cy.get("[data-cy='button-nextpage']").should("contain", uiText.button[store.state.currentPage]);
    });

    it("When enabled, next page button moves to next page's url and sets current page", () => {

        // Setup

        // 1. Mock the page accessibility getter to test effects on the next page button
        store.getters.isPageAccessible = () => (p_pageName) => true;

        // 2. Set up an intercept on the next page button click
        cy.intercept("GET", "/" + store.getters.getNextPage(), req => {}).as("buttonclick");

        // 3. Set up a spy on the store commit function
        cy.spy(store, "commit").as("commitSpy");

        // 4. Mount the next page button with mocks
        cy.mount(nextPage, {

            computed: store.getters,
            data() {
                return {
                    uiText: uiText
                };
            },
            mocks: { $store: store }
        });

        // Act - Click the next page button
        cy.get("[data-cy='button-nextpage']").click();

        // Assert

        // 1. Check if the url correctly includes the next page name
        cy.wait("@buttonclick").its("request.url").should("include", store.getters.getNextPage());

        // 2. Check to see if the set current page mutation has fired for the next page
        cy.get("@commitSpy").should("have.been.calledWith", "setCurrentPage", store.getters.getNextPage());
    });
});
