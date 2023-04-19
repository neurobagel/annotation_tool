<template>

    <b-container fluid>

        <!-- Column-categorization linking -->
        <b-row>

            <!-- Category selection table -->
            <b-col cols="4">
                <category-select-table
                    data-cy="categorization-table"
                    :categories="categories"
                    :category-classes="categoryClasses"
                    :instructions="uiText.categorySelectInstructions"
                    :title="uiText.categorySelectTitle"
                    @category-select="setSelectedCategory($event)" />
            </b-col>

            <!-- Category to column linking table -->
            <b-col cols="8">
                <column-linking-table
                    data-cy="column-linking-table"
                    :category-classes="categoryClasses"
                    :column-to-category-map="columnToCategoryMap"
                    :fields="columnLinkingTable.fields"
                    :selected-category="selectedCategory"
                    :table-data="columnToCategoryTable"
                    @column-name-selected="tableClick($event)" />
            </b-col>

        </b-row>

        <!-- Whitespace to separate category-column categorization area from tool grouping area -->
        <b-row>&nbsp;</b-row>

        <!-- Tool grouping -->
        <categ-tool-group
            :column-names="dataTable.columns"
            @remove-tool-from-group="removeToolFromGroup($event)"
            @tool-group-action="toolGroupAction($event)" />

        <!-- Next page button (passed inside categ-tool-group for UI space consideration) -->
        <b-row>
            <b-col class="text-right" cols="12">

                <!-- Optional instructions to remind user of criteria to proceed to annotation page -->
                <p class="instructions-text" v-if="!pageData.annotation.accessible">
                    {{ uiText.nextPageCriteria }}
                </p>

                <!-- Button to proceed to the next page -->
                <!-- Only enabled when at least one column has been categorized -->
                <b-button
                    class="float-right"
                    data-cy="button-nextpage"
                    :disabled="!pageData.annotation.accessible"
                    :to="'/' + pageData.annotation.location"
                    :variant="nextPageButtonColor">
                    {{ uiText.nextButton }}
                </b-button>
            </b-col>
        </b-row>

    </b-container>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    export default {

        name: "CategorizationPage",

        data() {

            return {

                // Columns for file data table
                columnLinkingTable: {

                    fields: [

                        { key: "column" },
                        { key: "description" }
                    ]
                },

                columnToCategoryTable: [],

                // Category selection (default is index 0, no selection is -1)
                selectedCategory: "",

                // Text for UI elements
                uiText: {

                    categorySelectInstructions: "Click category and then corresponding column from tsv file",
                    categorySelectTitle: "Recommended Categories",
                    nextButton: "Next step: Annotate columns",
                    nextPageCriteria: "One column must be categorized as 'Subject ID' and all assessment tools must be grouped to proceed"
                }
            };
        },

        computed: {

            ...mapState([

                "categories",
                "categoryClasses",
                "columnToCategoryMap",
                "dataTable",
                "dataDictionary",
                "pageData",
                "toolGroups"
            ]),

            nextPageButtonColor() {

                // Bootstrap variant color of the button leading to the annotation page
                return this.pageData.annotation.accessible ? "success" : "secondary";
            }
        },

        provide() {

            return {

                "columnToCategoryMap": this.columnToCategoryMap,
                "toolGroups": this.toolGroups
            };
        },

        mounted() {

            // 1. Set the current page name
            this.$store.dispatch("setCurrentPage", "categorization");

            // 2. Create the data structure for the category to column linking table
            this.setupColumnToCategoryTable();

            // 3. Set selected category to the first category by default
            this.setSelectedCategory({ category: this.categories[0]});

            // 4. Determine if the annotation page is available yet and if so, enable it and perform setup actions
            this.$store.dispatch("initializePage", {

                pageName: "annotation",
                enable: this.nextPageAccessible()
            });
        },

        methods: {

            countLinkedColumns() {

                // Count the number of columns that have had categories linked to them
                let links = 0;
                for ( const column in this.columnToCategoryMap ) {
                    if ( null !== this.columnToCategoryMap[column] )
                        links += 1;
                }

                return links;
            },

            nextPageAccessible() {

                // 1. Determine if at least one column has been linked to a category
                const categorizationStatus = this.countLinkedColumns() > 0;

                // 2. Determine if all columns assigned the 'Assessment Tool' category have been grouped
                const assessmentToolColumns = [];
                for ( const column in this.columnToCategoryMap ) {
                    if ( "Assessment Tool" === this.columnToCategoryMap[column] ) {
                        assessmentToolColumns.push(column);
                    }
                }

                // 3. Make sure all assessment tool columns are grouped
                for ( const toolGroup in this.toolGroups ) {
                    for ( const tool of this.toolGroups[toolGroup] ) {
                        const columnIndex = assessmentToolColumns.indexOf(tool);
                        assessmentToolColumns.splice(columnIndex, 1);
                    }
                }
                const toolGroupingStatus = ( 0 === assessmentToolColumns.length );

                // 4. Make sure one (and only one) column has been categorized as 'Subject ID'
                let subjectIDFound = 0;
                for ( const column in this.columnToCategoryMap ) {
                    if ( "Subject ID" === this.columnToCategoryMap[column] ) {
                        subjectIDFound += 1;
                    }
                }
                const singleSubjectIDColumn = ( 1 === subjectIDFound );

                // Annotation page is only accessible if at least one column has
                // been categorized and all assessment tools have been grouped
                // and if one (and only one) column has been categorized as 'Subject ID'
                return categorizationStatus && toolGroupingStatus && singleSubjectIDColumn;
            },

            removeToolFromGroup(p_toolData) {

                this.$store.dispatch("removeToolFromGroup", p_toolData);
            },

            removeToolGroup(p_toolGroupData) {

                // 1. Remove this tool group from the store
                this.$store.dispatch("removeToolGroup", p_toolGroupData);

                // 2. Enable the annotation page and perform setup actions if
                // accessibility criteria have been met
                this.$store.dispatch("initializePage", {

                    pageName: "annotation",
                    enable: this.nextPageAccessible()
                });
            },

            saveNewToolGroup(p_toolGroupData) {

                // 1. Create this new tool group in the store
                this.$store.dispatch("createToolGroup", p_toolGroupData);

                // 2. Enable the annotation page and perform setup actions if
                // accessibility criteria have been met
                this.$store.dispatch("initializePage", {

                    pageName: "annotation",
                    enable: this.nextPageAccessible()
                });
            },

            setSelectedCategory(p_clickData) {

                // Save the name of the selected category
                this.selectedCategory = p_clickData.category;
            },

            setupColumnToCategoryTable() {

                // 0. Check that there is at least a data table and data dictionary in the data store
                if ( null === this.dataTable.original )
                    return;

                // 1. Produce an array of dicts
                this.columnToCategoryTable = [];

                // A. Each dict has a header entry from the data table file
                const headerFields = [];
                for ( const headerField in this.dataTable.original[0] ) {

                    // I. Save the header field in a list
                    headerFields.push(headerField);

                    // II. Save a new dict for this column and description
                    this.columnToCategoryTable.push({

                        "category": null,
                        "column": headerField,
                        "description": ""
                    });
                }

                // 2. Add in descriptions if a data dictionary has been supplied
                if ( null !== this.dataDictionary.original ) {

                    // A. and a corresponding "description" column that is (possibly) sourced from the json file
                    for ( const column in this.dataDictionary.original ) {

                        // I. Save a lowercase version of the current json key
                        const columnLowercase = column.toLowerCase();

                        // II. Try to match the json key with one in the tsv file
                        if ( headerFields.includes(columnLowercase) ) {

                            for ( let index = 0; index < this.columnToCategoryTable.length; index++ ) {

                                // NOTE: Advanced column name matching here between tsv and json? J. Armoza 01/26/22
                                if ( columnLowercase === this.columnToCategoryTable[index].column.toLowerCase() ) {

                                    // a. Determine the description string for this json file column entry
                                    let descriptionStr = "";
                                    for ( const subkey in this.dataDictionary.original[column] ) {

                                        if ( "description" === subkey.toLowerCase() ) {
                                            descriptionStr = this.dataDictionary.original[column][subkey];
                                            break;
                                        }
                                    }

                                    // b. Save the description from the json file column entry
                                    this.columnToCategoryTable[index].description = descriptionStr;
                                }
                            }
                        }
                    }
                }
            },

            tableClick(p_clickData) {

                // 1. Style or unstyle table row

                // A. Determine if category-column linking or unlinking has occurred
                const linking = ( this.selectedCategory !== this.columnToCategoryMap[p_clickData.column] );

                // B. Record the linking/unlinking in the data store
                const dataStoreFunction = ( linking ) ? "linkColumnWithCategory" : "unlinkColumnFromCategory";

                // I. Build a new object for passing to the store for category-column linking
                const dataForStore = { column: p_clickData["column"] };
                if ( linking ) {
                    dataForStore.category = this.selectedCategory;
                }

                // II. Link or unlink the currently-selected category and the clicked column
                this.$store.dispatch(dataStoreFunction, dataForStore);

                // 2. Enable the annotation page and perform setup actions if
                // accessibility criteria have been met
                this.$store.dispatch("initializePage", {

                    pageName: "annotation",
                    enable: this.nextPageAccessible()
                });
            },

            toolGroupAction(p_event) {

                // 1. Create, modify, or remove this tool group in the store
                this.$store.dispatch(p_event.action, p_event.data);

                // 2. Enable the annotation page and perform setup actions if
                // accessibility criteria have been met
                this.$store.dispatch("initializePage", {

                    pageName: "annotation",
                    enable: this.nextPageAccessible()
                });
            }
        }
    };

</script>
