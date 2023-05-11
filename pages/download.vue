<template>

    <div>

        <b-row>

            <!-- Annotated data dictionary preview goes here -->

        </b-row>

        <b-row>

            <b-col cols="9" />

            <!-- Button to download the annotation output data -->
            <b-col cols="3">
                <b-button
                    class="float-right"
                    data-cy="download-button"
                    variant="success"
                    @click="downloadAnnotatedData">
                    {{ uiText.downloadButton }}
                </b-button>
            </b-col>

        </b-row>

    </div>

</template>

<script>

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    // Saves annotated data dictionary to user's computer
    import { saveAs } from "file-saver";

    export default {

        name: "DownloadPage",

        data() {

            return {

                jsonSpacing: 4,

                // Size of the file display textboxes
                // NOTE: Leaving this in for data dictionary preview text box
                textArea: {

                    height: 800,
                    width: 5
                },

                // Text for UI elements
                uiText: {

                    downloadButton: "Download Annotated Data"
                }
            };
        },

        computed: {

            ...mapState([

                "dataDictionary"
            ]),

            dataDictionaryFilenameNoExtension() {

                // Dataset name is original data table filename with no extension
                return this.dataDictionary.filename.split(".").slice(0, -1).join(".");
            },

            defaultOutputFilename() {

                return `${this.dataDictionaryFilenameNoExtension}_annotated_${Date.now()}.json`;
            }
        },

        methods: {

            // NOTE: Commenting out code for downloadAnnotedData and transformAnnotatedJSON for now
            // Leaving this code in as a reminder what the file saveAs functionality needs
            downloadAnnotatedData() {

                // // 1. Format the annotated data dictionary into propietary JSON format
                // const jsonData = this.transformAnnotatedDictionaryToJSON();

                // 2. Open file dialog to prompt the user to name it and
                // download it to their location of choice
                // this.fileSaverSaveAs(jsonData);
                this.fileSaverSaveAs(this.dataDictionary.annotated);
            },

            fileSaverSaveAs(p_jsonData) {

                // 1. Create a blob version of the JSON output file
                const blob = new Blob([JSON.stringify(p_jsonData, null, this.jsonSpacing)], {type: "text/plain;charset=utf-8"});

                // 2. Open 'save as' file dialog box to allow user to save JSON output file to user's computer
                saveAs(blob, this.defaultOutputFilename);
            }

            // transformAnnotatedTableToJSON() {

            //     // Transform the annotated data dictionary into a propietary JSON format for the output file
            //     return {

            //         name: this.datasetName,
            //         type: "dataset",
            //         hasSamples: Object.keys(this.dataDictionary.annotated).map(entry => this.transformDataDictionaryEntry(entry))
            //     };
            // }
        }
    };

</script>
