<template>

    <div>

        <b-row align-h="center">
            <b-col cols="6">
                <p>
                    🎉 Congratulations, you have successfully created an <a href="https://neurobagel.org/dictionaries/" target="_blank">augmented .json data dictionary</a>.
                </p>
                <p>
                    Here are some next steps:
                </p>
                <ul>
                    <li>Download the .json data dictionary to your local hard drive by clicking the green "Download" button.</li>
                    <li>Use the .json data dictionary to <a href="https://neurobagel.org/cli/" target="_blank">create a harmonized view of your data</a></li>
                    <li>Learn more about <a href="https://neurobagel.org/" target="_blank">neurobagel</a> and how to use harmonized data for cross-dataset search.</li>
                </ul>
            </b-col>

        </b-row>

        <b-row align-h="center">

            <!-- Button to download the annotation output data -->
            <b-col cols="3">
                <b-button
                    data-cy="download-button"
                    variant="success"
                    @click="fileSaverSaveAs(getJsonOutput)">
                    {{ uiText.downloadButton }}
                </b-button>
            </b-col>

        </b-row>

    </div>

</template>

<script>

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

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

            ...mapGetters([

                "getJsonOutput"
            ]),

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

            fileSaverSaveAs(p_jsonData) {

                // 1. Create a blob version of the JSON output file
                const blob = new Blob([JSON.stringify(p_jsonData, null, this.jsonSpacing)], {type: "text/plain;charset=utf-8"});

                // 2. Open 'save as' file dialog box to allow user to save JSON output file to user's computer
                saveAs(blob, this.defaultOutputFilename);
            }
        }
    };

</script>
