<template>

    <b-container fluid>

        <!-- Data table file loading area -->
        <b-row>
            <h3>{{ uiText.dataTableHeader }}</h3>
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <b-table
                outlined
                sticky-header
                :items="dataTable"
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
            <h3>{{ uiText.dataDictionaryHeader }}</h3>
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <vue-json-pretty
                virtual
                deep="3"
                height="200"
                :data="dataDictionary.userProvided"
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
                "dataTable"
            ]),

            dataTableSelected() {

                // Return whether or not a data table has been selected
                // (used to enable data dictionary selection)
                return ( this.dataTable.length > 0 );
            },

            stringifiedDataDictionary() {

                return ( 0 === Object.keys(this.dataDictionary.userProvided).length )
                    ? "" : JSON.stringify(this.dataDictionary.userProvided, null, 4);
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

                "processDataDictionary",
                "processDataTable"
            ])
        }
    };

</script>