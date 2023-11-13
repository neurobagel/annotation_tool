<template>

    <b-container fluid>

        <!-- Data table file loading area -->
        <b-row>
            <h3>{{ uiText.dataTableHeader }}</h3>
        </b-row>

        <!-- Selects data table file (i.e. participants.tsv) -->
        <b-row>
            <file-selector
                data-cy="data-table-selector"
                :content-type="contentTypes.dataTable"
                @file-selected="processDataTable($event)"
                :enabled="true" />
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <b-table
                v-if="dataTable.length > 0"
                outlined
                sticky-header
                :items="dataTable"
                data-cy="data-table-display" />
            <p v-else class="instructions-text">
                Please provide a data table to see a preview here.
            </p>
        </b-row>


        <!-- Data dictionary file loading area -->
        <b-row>
            <h3>{{ uiText.dataDictionaryHeader }}</h3>
        </b-row>

        <b-row>
            <!-- Selects data dictionary file (i.e. participants.json) -->
            <file-selector
                data-cy="data-dictionary-selector"
                :content-type="contentTypes.dataDictionary"
                @file-selected="processDataDictionary($event)"
                :enabled="dataTableSelected" />
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <pre
                v-if="Object.keys(this.dataDictionary.userProvided).length > 0"
                style="height: 200px; width: 100%; overflow: auto;"
                data-cy="data-dictionary-display">
                {{ stringifiedDataDictionary }}
            </pre>
            <p v-else class="instructions-text">
                Provide a data dictionary to see the preview.
                If you load a data table, a skeleton data dictionary will be created for you
            </p>
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

                return JSON.stringify(this.dataDictionary.userProvided, null, 4);
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