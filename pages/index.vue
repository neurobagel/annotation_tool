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
                :value="stringifiedDataTable"
                data-cy="data-table-display" />
        </b-row>

        <!-- Selects data table file (i.e. participants.tsv) -->
        <b-row>
            <file-selector
                data-cy="data-table-selector"
                :content-type="contentTypes.dataTable"
                @file-selected="processDataTable($event)"
                :enabled="true" />
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
                :value="dataDictionaryAsString"
                data-cy="data-dictionary-display" />
        </b-row>

        <b-row>
            <!-- Selects data dictionary file (i.e. participants.json) -->
            <file-selector
                data-cy="data-dictionary-selector"
                :content-type="contentTypes.dataDictionary"
                @file-selected="processDataDictionary($event)"
                :enabled="dataTableSelected" />
        </b-row>

    </b-container>

</template>

<script>
    import { mapActions, mapState } from "vuex";

    export default {

        name: "IndexPage",

        data() {

            return {

                // Content types that are expected for the file selectors
                contentTypes: {

                    dataDictionary: "application/json",
                    dataTable: "text/tab-separated-values"
                },

                dataDictionaryAsString: "",

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

        mounted() {

            this.stringifyDataDictionary();
        },

        computed: {

            ...mapState([

                "dataDictionary",
                "dataTable"
            ]),

            dataTableSelected() {

                return ( this.dataTable.length > 0 );
            },

            stringifiedDataTable() {

                // Returns only the cell values of the table as a formatted string (no column names)
                return this.dataTable.map(row => {
                    return Object.values(row).join("\t");
                }).join("\n");
            }
        },

        watch: {

            dataDictionary: {

                deep: true,
                handler() {

                    this.stringifyDataDictionary();
                }
            }
        },

        methods: {

            ...mapActions([

                "processDataDictionary",
                "processDataTable"
            ]),

            stringifyDataDictionary() {

                this.dataDictionaryAsString = "";
                if ( Object.keys(this.dataDictionary.userProvided).length > 0 ) {

                    this.dataDictionaryAsString = JSON.stringify(this.dataDictionary.userProvided, null, 4);
                }
            }
        }
    };

</script>