import nextPage from "~/components/next-page";

let store;
const pages = ["home", "categorization", "annotation"];
const uiText = {

    button: {

        "home": "Next step: Categorize columns",
        "categorization": "Next step: Annotate columns",
        "annotation": "Next step: Review and download harmonized data"
    }
};

describe("next page button", () => {

    beforeEach(() => {

        // Setup
        store = {

            // commit: (p_mutationName, p_argument) => { store.mutations[p_mutationName](p_argument); },
            commit: () => {},

            getters: {

                getNextPage: () => {

                    // console.log(`getNextPage called with store.state: ${JSON.stringify(store.state)}`);

                    let nextPage = "";

                    switch ( store.state.currentPage ) {

                        case "home":
                            nextPage = "categorization";
                            break;
                        case "categorization":
                            nextPage = "annotation";
                            break;
                        case "annotation":
                            nextPage = "download";
                            break;
                        case "download":
                            nextPage = "";
                            break;
                    }

                    // console.log(`Next page is ${nextPage}`);

                    return nextPage;
                },

                isPageAccessible: () => (p_pageName) => {

                    // console.log(`isPageAccessible called for ${p_pageName}`);

                    let pageAccessible = false;

                    switch ( p_pageName ) {

                        case "home":

                            // Landing page is always accessible
                            pageAccessible = true;
                            break;

                        case "categorization":

                            // console.log(`dataTable: ${store.state.dataTable}`);

                            // Categorization page is accessible if a data table has been uploaded
                            pageAccessible = store.state.dataTable.length > 0;

                            break;

                        case "annotation": {

                            // 1. Make sure one (and only one) column has been categorized as 'Subject ID'
                            const singleSubjectIDColumn = ( 1 === Object.values(store.state.columnToCategoryMap)
                                                                        .filter(category => "Subject ID" === category)
                                                                        .length );

                            // 2. Make sure at least one other category other than 'Subject ID' has been linked to a column
                            const notOnlySubjectIDCategorized = ( Object.values(store.state.columnToCategoryMap)
                                                                        .filter(category => "Subject ID" !== category &&
                                                                                null !== category)
                                                                        .length >= 1 );

                            // Annotation page is only accessible if one (and only one)
                            // column has been categorized as 'Subject ID' and if at least
                            // one category other than Subject ID has been categorized
                            pageAccessible = singleSubjectIDColumn && notOnlySubjectIDCategorized;

                            break;
                        }

                        case "download":

                            pageAccessible = store.state.annotationCount > 0;

                            break;
                    }

                    // console.log(`${p_pageName} ${(pageAccessible)? "is" : "is not"} accessible`);

                    return pageAccessible;
                }
            },

            mutations: {

                setCurrentPage: () => (p_pageName) => {

                    console.log(`setCurrentPage called for ${p_pageName}`);

                    store.state.currentPage = p_pageName;
                }
            },

            state: {

                annotationCount: 0,
                columnToCategoryMap: {},
                currentPage: "home",
                dataTable: [],
                pageData: {

                    home: {

                        fullName: "Home",
                        location: "/",
                        pageName: "home"
                    },

                    categorization: {

                        fullName: "Categorization",
                        location: "categorization",
                        pageName: "categorization"
                    },

                    annotation: {

                        fullName: "Annotation",
                        location: "annotation",
                        pageName: "annotation"
                    },

                    download: {

                        fullName: "Download",
                        location: "download",
                        pageName: "download"
                    }
                }
            }
        };
    });

    pages.forEach(pageName => {

        it(`Does the label on next page button correspond to the ${pageName} page`, () => {

            // Setup - Mount the next page button
            cy.mount(nextPage, {

                computed: store.getters,
                mocks: { $store: store }
            });

            // Act - Change current page store field to the desired page
            store.mutations.setCurrentPage()(pageName);

            // Assert - Check button text corresponds to the recently set page
            cy.get("[data-cy='button-nextpage']").should("contain", uiText.button[pageName]);
        });
    });

    it("Does next page disabled status correspond to page accessibility", () => {

        // Setup - Mount the next page button
        cy.mount(nextPage, {

            computed: store.getters,
            mocks: { $store: store }
        });

        // Assert

        // A. Button is disabled and page is inaccessible
        cy.get("[data-cy='button-nextpage']").should(($button) => {

            expect($button).to.have.class("disabled");
            expect(store.getters.isPageAccessible()("categorization")).to.be.false;
        });

        // B. Button is enabled and page is accessible if data table is loaded
        cy.get("[data-cy='button-nextpage']").should(($button) => {

            // Setup - Make categorization page accessible
            store.state.dataTable = ["some data"];

            expect($button).to.not.have.class("disabled");
            expect(store.getters.isPageAccessible()("categorization")).to.be.true;
        });
    });

    it("When clicked is setCurrentPage mutation fired *once* with the correct parameters", () => {

        // Setup

        // A. Spy on the commit function
        cy.spy(store, "commit").as("commitSpy");

        // B. Mount the next page button
        cy.mount(nextPage, {

            computed: store.getters,
            mocks: { $store: store }
        });

        // C. Store with values for completed home page
        store.state.currentPage = "home";
        store.state.dataTable = ["some data"];

        // Act - Click on the next page button
        cy.get("[data-cy='button-nextpage']")
          .click()
          .intercept("/categorization", req => {

            // Do not navigate to categorization page since this is a component test
            req.destroy();

            // Assert - currentPage mutation has been called with the correct page name
            cy.get("@commitSpy").should("have.been.calledWith", "setCurrentPage", "categorization");
          });
    });
});
