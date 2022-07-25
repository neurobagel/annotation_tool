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
                    data-cy="download-button"
                    class="float-right"
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
    import { mapState } from "vuex";
    import { mapGetters } from "vuex";

    // Saves file to user's computer
    import { saveAs } from "file-saver";

    export default {

        name: "DownloadPage",

        data() {

            return {

                categoryToColumnMap: {},

                jsonSpacing: 4,

                // Size of the file display textboxes
                textArea: {

                    width: 5,
                    height: 800
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

        mounted() {

            // 1. Set the current page
            this.$store.dispatch("setCurrentPage", "download");

            // 2. Create a reverse of the column to category map in the store
            this.refreshCategoryToColumnMap();
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

            refreshCategoryToColumnMap() {

                this.categoryToColumnMap = {};
                for ( const column in this.columnToCategoryMap ) {

                    const myCategory = this.columnToCategoryMap[column];

                    // Categories may have multiple columns associated with them
                    if ( !Object.keys(this.categoryToColumnMap).includes(myCategory) ) {
                        this.categoryToColumnMap[myCategory] = [];
                    }
                    this.categoryToColumnMap[myCategory].push(column);
                }
            },

            transformAnnotatedTableToJSON() {

                // Transform the annotated data table into a new subject-centric JSON format for the output file
                return {

                    name: this.datasetName,
                    type: "dataset",
                    subjects: this.dataTable.annotated.map(row => this.transformAnnotatedRowToSubjectJSON(row))
                };
            },

            transformAnnotatedRowToSubjectJSON(p_row) {

                // 0. Determine all columns of the original data that have been categorized
                const availableCategories = Object.values(this.columnToCategoryMap);

                // 1. Create the new subject object, key by key
                const subjectJSON = {};

                // NOTE: Currently the categories subject ID, age, and sex must be applied to only one column each

                // A. Subject ID - This categorization is required in order to
                // proceed to the annotation page
                subjectJSON["id"] = p_row[this.categoryToColumnMap["Subject ID"][0]];

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
                    subjectJSON["diagnosis"] = this.categoryToColumnMap["Diagnosis"].map(column => p_row[column])
                        .filter(value => this.missingValueLabel !== value);
                }

                // E. Assessment tool group availability for this subject
                subjectJSON["assessment_tool"] = [];
                for ( const groupName in this.toolGroups ) {

                    // Availability suffix string should be in store?
                    const columnName = groupName + "_avail";

                    // Only include tool group names that are available for this subject
                    if ( true === p_row[columnName] ) {
                        subjectJSON["assessment_tool"].push(columnName);
                    }
                }

                return subjectJSON;
            }
        }
    };

</script>
