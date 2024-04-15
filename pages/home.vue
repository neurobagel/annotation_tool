<template>

    <b-container fluid>

        <b-row>
            <b-col>
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
                    🏗️ This tool (like all of neurobagel) is under active development and we welcome
                    any feedback or suggestions. Feel free to use our feedback widget on the side of the page.
                </p>
                <b-button v-b-toggle.collapse-1 variant="primary">Summary of annotation steps</b-button>
                <b-collapse id="collapse-1">
                    <br />
                    <p>
                        More details can be found <a href="https://neurobagel.org/annotation_tool/" target="_blank">in our documentation</a>.
                    </p>
                    <ol>
                        <li>Upload a TSV phenotypic file (<a href="https://neurobagel.org/data_prep/" target="_blank">see our docs for the TSV requirements</a>)</li>
                        <li>Upload a <a href="https://bids-specification.readthedocs.io/en/stable/03-modality-agnostic-files.html#participants-file" target="_blank">BIDS-compatible JSON data dictionary</a> (optional)</li>
                        <li>Annotate any or all COLUMNS in your data table by telling us what kind of subject information they are "about"</li>
                        <li>Annotate the unique VALUES in the columns you have annotated, by mapping them to controlled terms from
                            <a href="https://neurobagel.org/term_naming_standards/#currently-used-namespaces" target="_blank">existing vocabularies</a>
                        </li>
                        <li>Download your annotated JSON data dictionary</li>
                    </ol>
                    <b>What next?</b>
                    <p>
                        You can now use the new data dictionary to <a href="https://neurobagel.org/cli/" target="_blank">create a harmonized representation of your subject-level data</a> (optional, uses other neurobagel tools).<br>
                        To learn more about neurobagel, check out our website: <a href="https://neurobagel.org/" target="_blank">neurobagel.org</a>.
                    </p>
                </b-collapse>
            </b-col>
        </b-row>

        <!-- Selects data table file (i.e. participants.tsv) -->
        <b-row>
            <b-col>
                <h3>{{ uiText.dataTableHeader }}</h3>
                <file-selector
                    data-cy="data-table-selector"
                    :content-type="contentTypes.dataTable"
                    @file-selected="processDataTable($event)"
                    :enabled="true" />
            </b-col>
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <b-col>
                <b-table
                    v-if="dataTable.length > 0"
                    outlined
                    sticky-header
                    :items="dataTable"
                    data-cy="data-table-display" />
                <p v-else class="instructions-text">
                    Please provide a data table to see a preview here.
                </p>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <h3>{{ uiText.dataDictionaryHeader }}</h3>
                <b-button data-cy="cannot-reuse-annotations-button" v-b-toggle.collapse-2 variant="warning">Cannot reuse annotations</b-button>
                <b-collapse id="collapse-2">
                    <br />
                    At the moment, the annotation tool is not able to load previously created annotations.
                    This means that if you provide a data dictionary here that you created with Neurobagel,
                    any existing semantic annotations will be removed when the data dictionary is loaded.

                    In practice this means that you cannot resume an aborted previous annotation.
                    This is a limitation we are going to address: <a href="https://github.com/neurobagel/annotation_tool/issues/601" target="_blank">#601</a>.
                </b-collapse>
                <file-selector
                    data-cy="data-dictionary-selector"
                    :content-type="contentTypes.dataDictionary"
                    @file-selected="processDataDictionary($event)"
                    :enabled="dataTableSelected" />
            </b-col>
        </b-row>

        <!-- Shows file contents -->
        <b-row>
            <b-col>
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
            </b-col>
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