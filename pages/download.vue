<template>

    <div>

        <b-row>

            <b-col cols="12">
                <b-table
                    bordered
                    outlined
                    sticky-header
                    striped
                    head-variant="dark"
                    :items="dataTable.annotated" />
            </b-col>

        </b-row>

        <b-row>

            <b-col cols="9" />

            <!-- Button to proceed to download the annotation output data -->
            <!-- Only enabled when annotation has been at least partially completed -->
            <b-col cols="3">
                <b-button
                    class="float-right"
                    data-cy="download-button"
                    :disabled="!isDataAnnotated"
                    :variant="downloadButtonColor"
                    @click="downloadAnnotatedData">
                    {{ uiText.downloadButton }}
                </b-button>
            </b-col>

        </b-row>

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    // Saves file to user's computer
    import { saveAs } from "file-saver";

    export default {

        name: "DownloadPage",

        data() {

            return {

                jsonSpacing: 4,

                // Size of the file display textboxes
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

                "isDataAnnotated"
            ]),

            ...mapState([

                "columnToCategoryMap",
                "dataTable",
                "missingValueLabel",
                "toolGroups"
            ]),

            categoryToColumnMap() {

                // Create a reverse lookup map of the columnToCategory map in the store
                const categoryToColumnMap = {};
                for ( const column in this.columnToCategoryMap ) {

                    const category = this.columnToCategoryMap[column];

                    // Categories may have multiple columns associated with them
                    if ( !Object.keys(categoryToColumnMap).includes(category) ) {

                        categoryToColumnMap[category] = [];
                    }

                    categoryToColumnMap[category].push(column);
                }

                return categoryToColumnMap;
            },

            datasetName() {

                // Dataset name is original data table filename with no extension
                return this.dataTable.filename.split(".").slice(0, -1).join(".");
            },

            defaultOutputFilename() {

                return `${this.datasetName}_annotated_${Date.now()}.json`;
            },

            downloadButtonColor() {

                // Bootstrap variant color of the button leading to the output download
                return this.isDataAnnotated ? "success" : "secondary";
            }
        },

        methods: {

            downloadAnnotatedData() {

                // 1. Format the annotated table into propietary JSON format
                const jsonData = this.transformAnnotatedTableToJSON();

                // 2. Open file dialog to prompt the user to name it and
                // download it to their location of choice
                this.fileSaverSaveAs(jsonData);
            },

            fileSaverSaveAs(p_jsonData) {

                const blob = new Blob([JSON.stringify(p_jsonData, null, this.jsonSpacing)], {type: "text/plain;charset=utf-8"});
                saveAs(blob, this.defaultOutputFilename);
            },

            transformAnnotatedRowToSubjectJSON(p_row) {

                // 0. Determine all columns of the original data that have been categorized
                const availableCategories = Object.values(this.columnToCategoryMap);

                // 1. Create the new subject object, key by key
                const subjectJSON = {};

                // NOTE: Currently the categories subject ID, age, and sex must be applied to only one column each

                // A. Subject ID - This categorization is required in order to
                // proceed to the annotation page
                subjectJSON["label"] = p_row[this.categoryToColumnMap["Subject ID"][0]];

                // B. Age
                if ( availableCategories.includes("Age") ) {

                    subjectJSON["age"] = p_row[this.categoryToColumnMap["Age"][0]];
                }

                // C. Sex
                if ( availableCategories.includes("Sex") ) {

                    subjectJSON["sex"] = p_row[this.categoryToColumnMap["Sex"][0]];
                }

                // D. Diagnoses
                if ( availableCategories.includes("Diagnosis") ) {

                    // I. Create a list of values from the diagnosis columns in the annotated table row
                    subjectJSON["diagnosis"] = this.categoryToColumnMap["Diagnosis"]
                        .map(column => { return {identifier: p_row[column]}; })
                        .filter(value => this.missingValueLabel !== value.identifier);
                }

                // E. Assessment tool group availability for this subject
                subjectJSON["assessment_tool"] = [];
                for ( const groupName in this.toolGroups ) {

                    // NOTE: Availability suffix string should be in store?
                    const column = groupName + "_avail";

                    // Only include tool group names that are available for this subject
                    if ( true === p_row[column] ) {

                        subjectJSON["assessment_tool"].push(column);
                    }
                }

                return subjectJSON;
            },

            transformAnnotatedTableToJSON() {

                // Transform the annotated data table into a new subject-centric JSON format for the output file
                return {

                    name: this.datasetName,
                    type: "dataset",
                    hasSamples: this.dataTable.annotated.map(row => this.transformAnnotatedRowToSubjectJSON(row))
                };
            }
        }
    };

</script>
