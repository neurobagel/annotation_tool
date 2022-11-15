import CategorySelectTable from "~/components/category-select-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

const state = {

    categories: [

        "Subject ID",
        "Age",
        "Sex",
        "Diagnosis",
        "Assessment Tool"
    ],

    categoryClasses: {},

    categoryToColorMap: {},

    toolColorPalette: {

        color1: "category-style-0",
        color2: "category-style-1",
        color3: "category-style-2",
        color4: "category-style-3",
        color5: "category-style-4",
        colorDefault: "category-style-default"
    },

    getters: {

        categories: () => state.categories,
        categoryClasses: () => state.categoryClasses
    }
};

// const plugins = ["bootstrap-vue", "vue-select"];

function setupCategoryClasses(p_store) {

    // 1. Get color keys from tool color palette
    const colorKeys = Object.keys(p_store.toolColorPalette);

    // 2. Create the category to color map
    let assignedCategories = 0;
    for ( let index = 0; index < p_store.categories.length &&
            index < colorKeys.length; index++ ) {

        // A. Stop when the default color key has been reached
        if ( "colorDefault" === colorKeys[index] )
            break;

        // B. Map this category to color key
        p_store.categoryToColorMap[p_store.categories[index]] = colorKeys[index];

        // C. Keep track of how many categories have been assigned color keys
        assignedCategories += 1;
    }
    // D. Issue warning if there are not enough color keys for the given category set
    if ( p_store.categories.length > assignedCategories ) {
        console.log("WARNING: Not all categories have been assigned color keys!");
    }

    // 4. Set up the category to CSS class map

    // A. Create a map between category names and color classes
    const mapArray = [];
    for ( let index = 0; index < p_store.categories.length; index++ ) {

        const category = p_store.categories[index];
        const colorID = p_store.categoryToColorMap[category];
        const colorClass = p_store.toolColorPalette[colorID];

        mapArray.push([category, colorClass]);
    }

    // B. Save the new category to class map
    p_store.categoryClasses = Object.fromEntries(mapArray);
}

describe("Table for selecting categories to linking to table columns on the categorization page", () => {

    // Setup category clases in the mock store
    setupCategoryClasses(state);

    it("Select each category", () => {
        // 1. Arrange

        // Set up the spy, mount the component, and bind the spy to it
        const onCategorySelectSpy = cy.spy().as("onCategorySelectSpy");
        cy.mount(CategorySelectTable, {

            computed: state.getters,

            listeners: {

                "category-select": onCategorySelectSpy
            },

            plugins: ["bootstrap-vue"]
        });

        // Test each row in the category select table
        for ( let index = 0; index < state.categories.length; index++ ) {

            // 2. Act
            cy.get(`.category-style-${index}`).click();

            // 3. Assert
            cy.get("@onCategorySelectSpy").should(
                "have.been.calledWith",
                {category: state.categories[index]});
        }
    });
});