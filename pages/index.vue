<template>

    <b-container fluid>

        <!-- Data table file loading area -->
        <b-row>
            <h2>{{ uiText.dataTableHeader }}</h2>
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <textarea
                :cols="textArea.height"
                :rows="textArea.width"
                v-model="stringifiedDataTable"
                data-cy="data-table-display" />
        </b-row>

        <!-- Selects data table file (i.e. participants.tsv) -->
        <b-row>
            <file-selector
                data-cy="data-table-selector"
                :content-type="contentTypes.dataTable"
                @file-selected="setDataTable($event)" />
        </b-row>


        <!-- Data dictionary file loading area -->
        <b-row>
            <h2>{{ uiText.dataDictionaryHeader }}</h2>
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <textarea
                :cols="textArea.height"
                :rows="textArea.width"
                v-model="stringifiedDataDictionary"
                data-cy="data-dictionary-display" />
        </b-row>

        <b-row>
            <!-- Selects data dictionary file (i.e. participants.json) -->
            <file-selector
                data-cy="data-dictionary-selector"
                :content-type="contentTypes.dataDictionary"
                @file-selected="setDataDictionary($event)" />
        </b-row>

    </b-container>

</template>

<script>

    // Allows for calls to store actions
    import { mapActions } from "vuex";

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    // Allows for direct mutations of store data
    import { mapMutations } from "vuex";

    // Allows for reference to store data by creating simple, implicit getters
    import { mapState } from "vuex";

    export default {

        name: "IndexPage",

        data() {

            return {

                // Content types that are expected for the file selectors
                contentTypes: {

                    dataDictionary: "application/json",
                    dataTable: "text/tab-separated-values"
                },

                // Size of the file display textboxes
                textArea: {

                    height: 200,
                    width: 5
                },

                // Text for UI elements
                uiText: {

                    dataTableHeader: "Data table",
                    dataDictionaryHeader: "Data dictionary"
                }
            };
        },

        computed: {

            ...mapGetters([

                "getColumnNames"
            ]),

            ...mapState([

                "dataDictionary",
                "dataTable",
                "pageData"
            ]),

            stringifiedDataDictionary() {

                return JSON.stringify(this.dataDictionary, null, 4);
            },

            stringifiedDataTable() {

                // Returns only the cell values of the table as a formatted string (no column names)
                return this.dataTable.map(row => {
                    return Object.values(row).join("\t");
                }).join("\n");
            }
        },

        methods: {

            ...mapActions([

                "saveDataDictionary",
                "saveDataTable"
            ]),

            ...mapMutations([

                "createColumnToCategoryMap"
            ]),

            setDataDictionary(p_fileData) {

                // Update the store with json file data
                // NOTE: Defaults to json for now
                this.saveDataDictionary({

                    data: p_fileData.data,
                    filename: p_fileData.filename,
                    fileType: "json"
                });
            },

            setDataTable(p_fileData) {

                // 1. Update the store with tsv file data
                // NOTE: Defaults to tsv for now
                this.saveDataTable({

                    data: ( 0 === p_fileData.data.length ) ? null : p_fileData.data,
                    filename: p_fileData.filename,
                    fileType: "tsv"
                });

                // 2. Create a new map for linking table columns to annotation categories
                this.initializeColumnToCategoryMap(this.getColumnNames);
            }
        }
    };

</script>