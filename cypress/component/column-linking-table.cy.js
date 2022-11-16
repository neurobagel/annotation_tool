import ColumnLinkingTable from "~/components/column-linking-table.vue";

// Documentation for testing Vue events of components
// https://docs.cypress.io/guides/component-testing/events-vue

const store = {

    state: {

        categories: [

            "Subject ID",
            "Age",
            "Sex",
            "Diagnosis",
            "Assessment Tool"
        ],

        categoryClasses: {},

        categoryToColorMap: {},

        columnToCategoryMap: {},

        dataDictionary: {

            original: {}
        },

        dataTable: {

            columns: [

                "participant_id",
                "age",
                "sex",
                "group",
                "group_dx",
                "number_comorbid_dx",
                "medload",
                "iq",
                "session"
            ],
            original: []
        },

        toolColorPalette: {

            color1: "category-style-0",
            color2: "category-style-1",
            color3: "category-style-2",
            color4: "category-style-3",
            color5: "category-style-4",
            colorDefault: "category-style-default"
        }

    },

    getters: {}
};

store.getters = {

    categories: () => store.state.categories,
    categoryClasses: () => store.state.categoryClasses,
    columnToCategoryMap: () => store.state.columnToCategoryMap,
    dataDictionary: () => store.state.dataDictionary,
    dataTable: () => store.state.dataTable
};

const props = {

    selectedCategory: "Subject ID"
};

function setupColumnToCategoryMap() {

    // NOTE: Map will be wiped if ever category data structures are re-initialized

    // Only proceed if map is not yet created.
    if ( Object.keys(store.state.columnToCategoryMap).length !== 0 )
        return;

    // Column to category map lists all columns as keys with default value of null
    store.state.columnToCategoryMap =
        Object.fromEntries(store.state.dataTable.columns.map((columnName) => [columnName, null]));
}

function setupDataTableAndDictionary() {

    store.state.dataTable.original.push({});

    for ( const column of store.state.dataTable.columns ) {

        store.state.dataTable.original[0][column] = "";

        store.state.dataDictionary.original[column] = { description: `${column} description text` };
    }
}

// const plugins = ["bootstrap-vue", "vue-select"];

function setupCategoryClasses() {

    // 1. Get color keys from tool color palette
    const colorKeys = Object.keys(store.state.toolColorPalette);

    // 2. Create the category to color map
    let assignedCategories = 0;
    for ( let index = 0; index < store.state.categories.length &&
            index < colorKeys.length; index++ ) {

        // A. Stop when the default color key has been reached
        if ( "colorDefault" === colorKeys[index] )
            break;

        // B. Map this category to color key
        store.state.categoryToColorMap[store.state.categories[index]] = colorKeys[index];

        // C. Keep track of how many categories have been assigned color keys
        assignedCategories += 1;
    }
    // D. Issue warning if there are not enough color keys for the given category set
    if ( store.state.categories.length > assignedCategories ) {
        console.log("WARNING: Not all categories have been assigned color keys!");
    }

    // 4. Set up the category to CSS class map

    // A. Create a map between category names and color classes
    const mapArray = [];
    for ( let index = 0; index < store.state.categories.length; index++ ) {

        const category = store.state.categories[index];
        const colorID = store.state.categoryToColorMap[category];
        const colorClass = store.state.toolColorPalette[colorID];

        mapArray.push([category, colorClass]);
    }

    // B. Save the new category to class map
    store.state.categoryClasses = Object.fromEntries(mapArray);
}

function setupStore() {

    // 1. Setup category classes in the mock store
    setupCategoryClasses();

    // 2. Setup data table for category-column linking
    setupDataTableAndDictionary();

    // 3. Setup column to category map based on data table
    setupColumnToCategoryMap();
}

describe("Tests basic functionality of the table that links categories with data table columns", () => {

    setupStore();

    it("Link and unlink one column from the currently selected category", () => {

        console.log(JSON.stringify(store.state));

        // 1. Arrange - Set up the spy, mount the component, and bind the spy to it
        const onColumnNameSelectedSpy = cy.spy().as("onColumnNameSelectedSpy");
        cy.mount(ColumnLinkingTable, {

            computed: store.getters,

            listeners: {

                "column-name-selected": onColumnNameSelectedSpy
            },

            plugins: ["bootstrap-vue"],

            propsData: props
        });

        // 2. Action: Link the first column to the current category
        cy.get("[data-cy='column-linking-table-table'] tbody > tr:first-child > td")
            .contains(store.state.dataTable.columns[0])
            .click();

        // 3. Assert

        // A. color of table row matches first color class
        cy.get("[data-cy='column-linking-table-table'] tbody > tr:first-child > td")
            .should("have.class", store.state.toolColorPalette.color1);

        // B. \
        cy.get("@onColumnNameSelectedSpy").should(
            "have.been.calledWith",
            { column: store.state.dataTable.columns[0] });
    });
});