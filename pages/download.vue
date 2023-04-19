<template>

    <div>

        <b-row>

            <!-- Annotated data dictionary preview goes here -->

        </b-row>

        <b-row>

            <b-col cols="9" />

            <!-- Button to proceed to download the annotation output data -->
            <!-- Only enabled when annotation has been at least partially completed -->
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

    // Saves file to user's computer
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

            datasetName() {

                // Dataset name is original data table filename with no extension
                return this.dataTable.filename.split(".").slice(0, -1).join(".");
            },

            defaultOutputFilename() {

                return `${this.datasetName}_annotated_${Date.now()}.json`;
            }
        },

        methods: {

            // NOTE: Commenting out code for downloadAnnotedData and transformAnnotatedJSON for now
            // Leaving this code in as a reminder what the file saveAs functionality needs
            downloadAnnotatedData() {

                // // 1. Format the annotated table into propietary JSON format
                // const jsonData = this.transformAnnotatedTableToJSON();

                // // 2. Open file dialog to prompt the user to name it and
                // // download it to their location of choice
                // this.fileSaverSaveAs(jsonData);
            },

            fileSaverSaveAs(p_jsonData) {

                const blob = new Blob([JSON.stringify(p_jsonData, null, this.jsonSpacing)], {type: "text/plain;charset=utf-8"});
                saveAs(blob, this.defaultOutputFilename);
            }

            // transformAnnotatedTableToJSON() {

            //     // Transform the annotated data table into a new subject-centric JSON format for the output file
            //     return {

            //         name: this.datasetName,
            //         type: "dataset",
            //         hasSamples: this.dataTable.annotated.map(row => this.transformAnnotatedRowToSubjectJSON(row))
            //     };
            // }
        }
    };

</script>
