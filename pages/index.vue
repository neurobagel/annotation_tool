<template>

    <b-container fluid>

        <b-row align-h="left">
            <b-col cols="12">
                <h1>
                    👋 Welcome to the neurobagel annotation tool
                </h1>
                <p>
                    This tool allows you to create a machine readable data dictionary
                    in .json format for a tabular phenotypic file in .tsv format ("Data table").
                    If you already have a <a href="https://bids-specification.readthedocs.io/en/stable/03-modality-agnostic-files.html#phenotypic-and-assessment-data" target="_blank">BIDS-like .json data dictionary</a>, you can provide it here
                     (under "Data Dictionary") and augment it with more detailed annotations.
                </p>
                <p>
                    🏗️ This tool (like all of neurobagel) is under active development and we are thankful
                    for all feedback and suggestions you may have. You can either use our feedback widget
                    on the side of this window, or open an issue on <a href="https://github.com/neurobagel/annotation_tool" target="_blank">our GitHub repository</a>.
                </p>
                <b-button v-b-toggle.collapse-1 variant="primary">More details on the annotation process</b-button>
                <b-collapse id="collapse-1">
                    <br />
                    <ol>
                        <li>Upload a .tsv tabular phenotypic file (<a href="https://neurobagel.org/annotation_tool/" target="_blank">see our docs for details</a>)</li>
                        <li>Upload a <a href="https://neurobagel.org/dictionaries/" target="_blank">BIDS-like .json data dictionary</a> (optional)</li>
                        <li>Annotate any or all "Columns" in your table by telling us what data they are "about"</li>
                        <li>Annotate the values in the "Columns" you have annotated, by mapping them to controlled terms from
                            <a href="https://neurobagel.org/term_naming_standards/#currently-used-namespaces" target="_blank">existing vocabularies</a>
                        </li>
                        <li>Download your augmented data dictionary in .json</li>
                        <li>Use the augmented data dictionary to <a href="https://neurobagel.org/cli/" target="_blank">create a harmonized view of your data</a> (optional, uses other neurobagel tools)</li>
                    </ol>
                    <p>
                        If you want to learn more about neurobagel, check out our website: <a href="https://neurobagel.org/" target="_blank">neurobagel.org</a>.
                    </p>
                </b-collapse>
            </b-col>
        </b-row>

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