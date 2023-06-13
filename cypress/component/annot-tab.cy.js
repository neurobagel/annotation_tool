import annotTab from "~/components/annot-tab.vue";

// NOTE: because the annot-tab component is a container for other components that we are not
// mounting here (shallowMount), the UI is always going to be empty.
// We therefore write assertions on existence of elements, not their visibility.
// In Cypress, elements with no width / content are considered invisible.

const store = {
    getters: {
        getAnnotationComponent: () => (category) => "component1"
    }
};

const props = {
    activeCategory: "category1"
};

describe("annotTab", () => {
    it("mounts understands the activeCategory prop", () => {
        cy.mount(annotTab, {
            propsData: props,
            computed: store.getters
        });
        cy.get("[data-cy='category1']").should('exist');

    });
    it("gets the correct annotation component name from the store", () => {
        cy.mount(annotTab, {
            propsData: props,
            computed: store.getters
        });
        cy.get("[data-cy='category1']").get("[data-cy='component1-category1']").should("exist");
    });
});