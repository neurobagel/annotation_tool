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
                v-model="stringifiedDataTable" />
        </b-row>

        <!-- Selects data table file (i.e. participants.tsv) -->
        <b-row>
            <file-selector
                data-cy="data-table-selector"
                :content-type="contentTypes.dataTable"
                @file-selected="saveDataTable($event)" />
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
                v-model="stringifiedDataDictionary" />
        </b-row>

        <b-row>
            <!-- Selects data dictionary file (i.e. participants.json) -->
            <file-selector
                data-cy="data-dictionary-selector"
                :content-type="contentTypes.dataDictionary"
                @file-selected="saveDataDictionary($event)" />
        </b-row>

    </b-container>

</template>

<script>

    // Allows for calls to store actions
    import { mapActions } from "vuex";

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

            ...mapState([

                "dataDictionary",
                "dataTable",
                "pageData"
            ]),

            stringifiedDataDictionary() {

                // 0. Return a blank string if there is no loaded data dictionary file
                if ( !this.$store.getters.isDataDictionaryLoaded ) {

                    return "";
                }

                // 1. Return a string version of the data dictionary file
                // NOTE: Defaults to json for now
                return JSON.stringify(this.dataDictionary.original, null, 4);
            },

            stringifiedDataTable() {

                // 0. Return a blank string is there is no loaded data table
                if ( !this.$store.getters.isDataTableLoaded ) {

                    return "";
                }

                // 1. Convert the tsv file data into a list of strings
                // NOTE: Defaults to tsv for now
                const textAreaArray = [Object.keys(this.dataTable.original[0]).join("\t")];
                for ( let index = 0; index < Object.keys(this.dataTable.original[0]).length; index++ ) {

                    textAreaArray.push(Object.values(this.dataTable.original[index]).join("\t"));
                }

                // 2. Return the tsv file data joined as one string
                return textAreaArray.join("\n");
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

            saveDataDictionary(p_fileData) {

                // Update the store with json file data
                // NOTE: Defaults to json for now
                this.saveDataDictionary({

                    data: p_fileData.data,
                    filename: p_fileData.filename,
                    fileType: "json"
                });
            },

            saveDataTable(p_fileData) {

                // 1. Update the store with tsv file data
                // NOTE: Defaults to tsv for now
                this.saveDataTable({

                    data: ( 0 === p_fileData.data.length ) ? null : p_fileData.data,
                    filename: p_fileData.filename,
                    fileType: "tsv"
                });

                // 2. Create a new map for linking table columns to annotation categories
                this.createColumnToCategoryMap();
            }
        }
    };

</script>